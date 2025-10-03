"use server";

import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

// Français: Schéma de validation des entrées pour sécuriser l'action serveur
const PayrollInputSchema = z.object({
  employeeId: z.string().min(1),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  bonuses: z.coerce.number().min(0).default(0),
  overtimeHours: z.coerce.number().min(0).default(0),
});

export type PayrollCalculationInput = z.infer<typeof PayrollInputSchema>;

export type PayrollCalculationResult = {
  employeeId: string;
  month: number;
  year: number;
  base_salary: number;
  bonuses: number;
  overtimeHours: number;
  overtimePay: number;
  gross_salary: number; // Salaire Brut
  cnss: number; // Retenue CNSS (part salariale)
  amo: number; // Assurance Maladie Obligatoire (part salariale)
  net_taxable: number; // Salaire Net Imposable (SNI)
  igr: number; // Impôt sur le Revenu
  other_deductions: number;
  net_salary: number; // Net à Payer
};

// Français: Constantes officielles pour le calcul de la paie au Maroc
// Taux de cotisations sociales (part salariale uniquement)
const CNSS_EMPLOYEE_RATE = 0.0448; // 4.48% (part employé)
const CNSS_CEILING = 6000; // MAD - Plafond CNSS
const AMO_EMPLOYEE_RATE = 0.0226; // 2.26% (part employé)

// Français: Barème IGR mensuel officiel (tranches en MAD) avec taux et abattement
// Source: Code Général des Impôts - Barème progressif mensuel
// Exemple pour 15,000 MAD (employé marié avec 2 enfants):
// - CNSS = 15,000 × 4.48% = 672.00 MAD
// - AMO = 15,000 × 2.26% = 339.00 MAD
// - Salaire Imposable = 15,000 - (672 + 339) = 13,989.00 MAD
// - IGR de base = (13,989 × 34%) - 1,433.33 = 3,329.93 MAD
// - Abattements familiaux = 30 MAD (conjoint) + (2 × 30 MAD) (enfants) = 90 MAD
// - IGR final = 3,329.93 - 90 = 3,239.93 MAD
// - Net = 15,000 - (672 + 339 + 3,239.93) = 10,749.07 MAD
const IGR_BRACKETS = [
  { upTo: 2500, rate: 0, rebate: 0 },
  { upTo: 4166, rate: 0.1, rebate: 250 },
  { upTo: 5000, rate: 0.2, rebate: 666.67 },
  { upTo: 6666, rate: 0.3, rebate: 1166.67 },
  { upTo: 15000, rate: 0.34, rebate: 1433.33 },
  { upTo: Infinity, rate: 0.38, rebate: 2033.33 },
] as const;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Français: Calcul des abattements familiaux
// Conjoint à charge: 360 MAD/an = 30 MAD/mois
// Chaque enfant à charge: 360 MAD/an = 30 MAD/mois (max 6 enfants)
function computeFamilyDeductions(maritalStatus: string, childrenCount: number): number {
  let deductions = 0;
  
  // Déduction pour conjoint à charge (si marié)
  if (maritalStatus === 'married') {
    deductions += 30; // 30 MAD/mois
  }
  
  // Déduction pour enfants à charge (max 6)
  const eligibleChildren = Math.min(childrenCount, 6);
  deductions += eligibleChildren * 30; // 30 MAD/mois par enfant
  
  return round2(deductions);
}

// Français: Calcul de l'IGR selon le SNI (Salaire Net Imposable) avec abattements familiaux
function computeIGRFromNetTaxable(netTaxable: number, maritalStatus: string = 'single', childrenCount: number = 0): number {
  // Calculer l'IGR de base selon le barème
  let igr = 0;
  for (const bracket of IGR_BRACKETS) {
    if (netTaxable <= bracket.upTo) {
      igr = netTaxable * bracket.rate - bracket.rebate;
      break;
    }
  }
  
  // Appliquer les abattements familiaux
  const familyDeductions = computeFamilyDeductions(maritalStatus, childrenCount);
  const finalIGR = Math.max(0, igr - familyDeductions);
  
  return round2(finalIGR);
}

// Français: Calcul des heures supplémentaires.
// Hypothèse: taux horaire = salaire de base / 191h; majoration par défaut 25%.
function computeOvertimePay(baseSalary: number, overtimeHours: number, premiumRate = 1.25): number {
  const monthlyHours = 191;
  const hourlyRate = baseSalary / monthlyHours;
  return round2(overtimeHours * hourlyRate * premiumRate);
}

// Français: Action serveur principale. Signature compatible avec useFormState.
export async function calculatePayroll(
  _prevState: any,
  formData: FormData
): Promise<{ error?: string; result?: PayrollCalculationResult }> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const parsed = PayrollInputSchema.safeParse({
      employeeId: formData.get("employeeId")?.toString() ?? "",
      month: formData.get("month")?.toString() ?? "",
      year: formData.get("year")?.toString() ?? "",
      bonuses: formData.get("bonuses")?.toString() ?? "0",
      overtimeHours: formData.get("overtimeHours")?.toString() ?? "0",
    });
    if (!parsed.success) {
      return { error: parsed.error.flatten().formErrors.join("\n") };
    }

    const { employeeId, month, year, bonuses, overtimeHours } = parsed.data;

    // Français: Récupérer l'entreprise pour scoper les données
    const { data: company } = await supabase
      .from("companies")
      .select("id, name, ice, patente, cnss_affiliation_number, address")
      .eq("user_id", user.id)
      .single();
    if (!company) return { error: "Company not found" };

    // Français: Charger l'employé avec ses informations familiales, scoping par company_id
    const { data: employee, error: empErr } = await supabase
      .from("employees")
      .select("id, base_salary, first_name, last_name, job_title, marital_status, children_count, cin_number, cnss_number, hire_date")
      .eq("id", employeeId)
      .eq("company_id", company.id)
      .single();
    if (empErr || !employee) return { error: empErr?.message ?? "Employee not found" };

    const baseSalary = Number(employee.base_salary) || 0;
    const overtimePay = computeOvertimePay(baseSalary, overtimeHours);
    const grossSalary = round2(baseSalary + bonuses + overtimePay);

    // Français: CNSS plafonnée à 6000 MAD d'assiette
    const cnssBase = Math.min(grossSalary, CNSS_CEILING);
    const cnss = round2(cnssBase * CNSS_EMPLOYEE_RATE);

    // Français: AMO sur salaire brut
    const amo = round2(grossSalary * AMO_EMPLOYEE_RATE);

    // Français: SNI = Brut - cotisations sociales déductibles (CNSS + AMO)
    const netTaxable = Math.max(0, round2(grossSalary - cnss - amo));

    // Français: Récupérer les informations familiales pour le calcul de l'IGR avec abattements
    const maritalStatus = (employee.marital_status as string) || 'single';
    const childrenCount = Number(employee.children_count) || 0;
    
    // Français: IGR selon barème progressif avec abattements familiaux
    const igr = computeIGRFromNetTaxable(netTaxable, maritalStatus, childrenCount);

    const otherDeductions = 0; // Français: autre retenues (avances, saisies) à intégrer si besoin
    const netSalary = round2(grossSalary - cnss - amo - igr - otherDeductions);

    const result: PayrollCalculationResult = {
      employeeId,
      month,
      year,
      employee_name: `${employee.first_name} ${employee.last_name}`,
      job_title: employee.job_title || "",
      cin_number: employee.cin_number || "",
      cnss_number: employee.cnss_number || "",
      hire_date: employee.hire_date || "",
      base_salary: round2(baseSalary),
      bonuses: round2(bonuses),
      overtimeHours: round2(overtimeHours),
      overtimePay,
      gross_salary: grossSalary,
      cnss,
      amo,
      net_taxable: netTaxable,
      igr,
      other_deductions: otherDeductions,
      net_salary: netSalary,
      marital_status: maritalStatus,
      children_count: childrenCount,
      family_deductions: computeFamilyDeductions(maritalStatus, childrenCount),
    };

    return { result };
  } catch (e: any) {
    console.error("calculatePayroll failed", e);
    return { error: e?.message ?? "Unexpected error" };
  }
}


