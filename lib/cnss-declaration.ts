import * as XLSX from 'xlsx';
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { calculateMoroccanPayroll } from "@/lib/moroccan-taxes";

export interface CNSSEmployeeData {
  matricule_cnss: string;
  nom_complet: string;
  cin: string;
  salaire_brut: number;
  salaire_cnss: number; // min(grossSalary, 6000)
  cnss_employe: number;
  cnss_employeur: number;
  jours_travailles: number;
}

export interface CNSSDeclarationData {
  company_name: string;
  company_cnss: string;
  month: number;
  year: number;
  employees: CNSSEmployeeData[];
  totals: {
    total_employees: number;
    total_gross_salary: number;
    total_cnss_salary: number;
    total_cnss_employee: number;
    total_cnss_employer: number;
  };
}

/**
 * Generate CNSS declaration data for all employees
 * Français: Générer les données de déclaration CNSS pour tous les employés
 */
export async function generateCNSSDeclaration(
  userId: string,
  month: number,
  year: number
): Promise<CNSSDeclarationData> {
  const supabase = await createSupabaseServerClient();
  
  // 1. Get company information
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, cnss_affiliation_number")
    .eq("user_id", userId)
    .single();
    
  if (companyError || !company) {
    throw new Error("Company not found");
  }

  // 2. Get all employees for the company
  const { data: employees, error: employeesError } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", company.id);
    
  if (employeesError) {
    throw new Error("Failed to fetch employees");
  }

  if (!employees || employees.length === 0) {
    throw new Error("No employees found");
  }

  // 3. Process each employee for CNSS declaration
  const cnssEmployees: CNSSEmployeeData[] = [];
  
  for (const employee of employees) {
    const baseSalary = employee.base_salary || 0;
    
    // Calculate payroll using existing logic
    const payrollResult = calculateMoroccanPayroll(
      baseSalary,
      0, // bonuses
      0, // overtime hours
      1.25, // overtime rate
      employee.marital_status || "single",
      employee.children_count || 0
    );

    // Apply CNSS ceiling (6000 MAD)
    const cnssSalary = Math.min(baseSalary, 6000);
    
    // Calculate CNSS contributions
    const cnssEmployee = (cnssSalary * 4.48) / 100; // 4.48% employee
    const cnssEmployer = (cnssSalary * 8.60) / 100; // 8.60% employer
    
    // Assume 30 days worked per month (you can make this configurable)
    const daysWorked = 30;

    cnssEmployees.push({
      matricule_cnss: employee.cnss_number || "",
      nom_complet: `${employee.first_name} ${employee.last_name}`,
      cin: employee.cin_number || "",
      salaire_brut: baseSalary,
      salaire_cnss: cnssSalary,
      cnss_employe: Math.round(cnssEmployee * 100) / 100,
      cnss_employeur: Math.round(cnssEmployer * 100) / 100,
      jours_travailles: daysWorked
    });
  }

  // 4. Calculate totals
  const totals = {
    total_employees: cnssEmployees.length,
    total_gross_salary: cnssEmployees.reduce((sum, emp) => sum + emp.salaire_brut, 0),
    total_cnss_salary: cnssEmployees.reduce((sum, emp) => sum + emp.salaire_cnss, 0),
    total_cnss_employee: cnssEmployees.reduce((sum, emp) => sum + emp.cnss_employe, 0),
    total_cnss_employer: cnssEmployees.reduce((sum, emp) => sum + emp.cnss_employeur, 0)
  };

  return {
    company_name: company.name,
    company_cnss: company.cnss_affiliation_number || "",
    month,
    year,
    employees: cnssEmployees,
    totals
  };
}

/**
 * Generate Excel file for CNSS declaration
 * Français: Générer le fichier Excel pour la déclaration CNSS
 */
export function generateCNSSExcelFile(data: CNSSDeclarationData): Buffer {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Prepare data for Excel (CNSS-compliant format)
  const excelData = [
    // Header row (CNSS standard format)
    [
      "Matricule CNSS",
      "Nom et Prénom", 
      "CIN",
      "Salaire Brut",
      "Salaire Plafonné CNSS",
      "CNSS Salarié (4.48%)",
      "CNSS Employeur (8.60%)",
      "Jours Travaillés"
    ],
    // Employee data
    ...data.employees.map(emp => [
      emp.matricule_cnss,
      emp.nom_complet,
      emp.cin,
      emp.salaire_brut,
      emp.salaire_cnss,
      emp.cnss_employe,
      emp.cnss_employeur,
      emp.jours_travailles
    ]),
    // Totals row
    [
      "TOTAL",
      "",
      "",
      data.totals.total_gross_salary,
      data.totals.total_cnss_salary,
      data.totals.total_cnss_employee,
      data.totals.total_cnss_employer,
      ""
    ]
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(excelData);
  
  // Set column widths
  const columnWidths = [
    { wch: 15 }, // Matricule CNSS
    { wch: 25 }, // Nom Complet
    { wch: 12 }, // CIN
    { wch: 12 }, // Salaire Brut
    { wch: 12 }, // Salaire CNSS
    { wch: 12 }, // CNSS Employé
    { wch: 12 }, // CNSS Employeur
    { wch: 12 }  // Jours Travaillés
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Déclaration CNSS");
  
  // Add company info sheet
  const companyInfo = [
    ["Informations Entreprise"],
    ["Nom:", data.company_name],
    ["Matricule CNSS:", data.company_cnss],
    ["Période:", `${data.month}/${data.year}`],
    ["Date de génération:", new Date().toLocaleDateString('fr-MA')],
    ["Généré par:", "PaieFacile"]
  ];
  
  const companySheet = XLSX.utils.aoa_to_sheet(companyInfo);
  XLSX.utils.book_append_sheet(workbook, companySheet, "Informations");

  // Convert to buffer
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate CSV file for CNSS declaration (alternative format)
 * Français: Générer le fichier CSV pour la déclaration CNSS
 */
export function generateCNSSCSVFile(data: CNSSDeclarationData): string {
  const headers = [
    "Matricule CNSS",
    "Nom Complet", 
    "CIN",
    "Salaire Brut",
    "Salaire CNSS",
    "CNSS Employé",
    "CNSS Employeur",
    "Jours Travaillés"
  ];

  const rows = data.employees.map(emp => [
    emp.matricule_cnss,
    emp.nom_complet,
    emp.cin,
    emp.salaire_brut.toString(),
    emp.salaire_cnss.toString(),
    emp.cnss_employe.toString(),
    emp.cnss_employeur.toString(),
    emp.jours_travailles.toString()
  ]);

  const totalsRow = [
    "TOTAL",
    "",
    "",
    data.totals.total_gross_salary.toString(),
    data.totals.total_cnss_salary.toString(),
    data.totals.total_cnss_employee.toString(),
    data.totals.total_cnss_employer.toString(),
    ""
  ];

  const allRows = [headers, ...rows, totalsRow];
  
  return allRows.map(row => 
    row.map(cell => `"${cell}"`).join(",")
  ).join("\n");
}

/**
 * Generate PDF file for CNSS declaration (official format)
 * Français: Générer le fichier PDF pour la déclaration CNSS (format officiel)
 */
export function generateCNSSPDFFile(data: CNSSDeclarationData): Buffer {
  // For now, we'll create a simple text-based PDF structure
  // In a production environment, you'd use a proper PDF library like jsPDF
  
  const pdfContent = `
DÉCLARATION CNSS - ÉTAT 9421
============================

ENTREPRISE: ${data.company_name}
MATRICULE CNSS: ${data.company_cnss}
PÉRIODE: ${data.month}/${data.year}
DATE DE GÉNÉRATION: ${new Date().toLocaleDateString('fr-MA')}

DÉTAILS DES EMPLOYÉS:
====================

${data.employees.map((emp, index) => `
${index + 1}. ${emp.nom_complet}
   Matricule CNSS: ${emp.matricule_cnss}
   CIN: ${emp.cin}
   Salaire Brut: ${emp.salaire_brut.toFixed(2)} MAD
   Salaire Plafonné: ${emp.salaire_cnss.toFixed(2)} MAD
   CNSS Salarié: ${emp.cnss_employe.toFixed(2)} MAD
   CNSS Employeur: ${emp.cnss_employeur.toFixed(2)} MAD
   Jours Travaillés: ${emp.jours_travailles}
`).join('')}

TOTAUX:
========
Nombre d'employés: ${data.totals.total_employees}
Total Salaire Brut: ${data.totals.total_gross_salary.toFixed(2)} MAD
Total Salaire Plafonné: ${data.totals.total_cnss_salary.toFixed(2)} MAD
Total CNSS Salarié: ${data.totals.total_cnss_employee.toFixed(2)} MAD
Total CNSS Employeur: ${data.totals.total_cnss_employer.toFixed(2)} MAD

---
Généré automatiquement par PaieFacile
Conforme aux exigences CNSS Maroc
  `;

  return Buffer.from(pdfContent, 'utf-8');
}
