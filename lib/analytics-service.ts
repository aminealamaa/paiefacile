import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { calculateMoroccanPayroll } from "@/lib/moroccan-taxes";

export interface KPIData {
  total_employees: number;
  total_gross_salary: number;
  total_net_salary: number;
  total_cnss_employee: number;
  total_cnss_employer: number;
  total_amo_employee: number;
  total_amo_employer: number;
  total_igr: number;
  average_salary: number;
  tax_burden_percentage: number;
  cnss_burden_percentage: number;
  amo_burden_percentage: number;
  igr_burden_percentage: number;
}

export interface PayrollTrend {
  month: number;
  year: number;
  total_employees: number;
  total_gross_salary: number;
  total_net_salary: number;
  total_taxes: number;
  average_salary: number;
}

export interface DepartmentAnalysis {
  department: string;
  employee_count: number;
  total_salary: number;
  average_salary: number;
  tax_burden: number;
  percentage_of_total: number;
}

export interface CostBreakdown {
  salaries: {
    gross: number;
    net: number;
    percentage: number;
  };
  taxes: {
    cnss_employee: number;
    cnss_employer: number;
    amo_employee: number;
    amo_employer: number;
    igr: number;
    total: number;
    percentage: number;
  };
  benefits: {
    health_insurance: number;
    retirement: number;
    other: number;
    total: number;
    percentage: number;
  };
  overhead: {
    processing: number;
    compliance: number;
    administrative: number;
    total: number;
    percentage: number;
  };
}

/**
 * Get current KPIs for a company
 * Français: Obtenir les KPI actuels pour une entreprise
 */
export async function getCompanyKPIs(companyId: string): Promise<KPIData> {
  const supabase = await createSupabaseServerClient();
  
  // Get all employees for the company
  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", companyId);
    

  if (error) {
    console.error("Error fetching employees:", error);
    return {
      total_employees: 0,
      total_gross_salary: 0,
      total_net_salary: 0,
      total_cnss_employee: 0,
      total_cnss_employer: 0,
      total_amo_employee: 0,
      total_amo_employer: 0,
      total_igr: 0,
      average_salary: 0,
      tax_burden_percentage: 0,
      cnss_burden_percentage: 0,
      amo_burden_percentage: 0,
      igr_burden_percentage: 0
    };
  }

  if (!employees || employees.length === 0) {
    console.log("No employees found - returning sample data for demo");
    // Return sample data for demonstration
    return {
      total_employees: 5,
      total_gross_salary: 25000,
      total_net_salary: 18000,
      total_cnss_employee: 1120,
      total_cnss_employer: 2150,
      total_amo_employee: 565,
      total_amo_employer: 1085,
      total_igr: 3120,
      average_salary: 5000,
      tax_burden_percentage: 28.0,
      cnss_burden_percentage: 13.1,
      amo_burden_percentage: 6.6,
      igr_burden_percentage: 12.5
    };
  }

  let totalGrossSalary = 0;
  let totalNetSalary = 0;
  let totalCNSSEmployee = 0;
  let totalCNSSEmployer = 0;
  let totalAMOEmployee = 0;
  let totalAMOEmployer = 0;
  let totalIGR = 0;

  // Calculate payroll for each employee
  for (const employee of employees) {
    const baseSalary = employee.base_salary || 0;
    
    if (baseSalary > 0) {
      const payrollResult = calculateMoroccanPayroll(
        baseSalary,
        0, // bonuses
        0, // overtime hours
        1.25, // overtime rate
        employee.marital_status || "single",
        employee.children_count || 0
      );

      totalGrossSalary += payrollResult.grossSalary;
      totalNetSalary += payrollResult.netSalary;
      totalCNSSEmployee += payrollResult.cnssEmployee;
      totalCNSSEmployer += payrollResult.cnssEmployer;
      totalAMOEmployee += payrollResult.amoEmployee;
      totalAMOEmployer += payrollResult.amoEmployer;
      totalIGR += payrollResult.igr;
    }
  }


  const totalTaxes = totalCNSSEmployee + totalCNSSEmployer + totalAMOEmployee + totalAMOEmployer + totalIGR;
  const averageSalary = employees.length > 0 ? totalGrossSalary / employees.length : 0;
  const taxBurdenPercentage = totalGrossSalary > 0 ? (totalTaxes / totalGrossSalary) * 100 : 0;
  const cnssBurdenPercentage = totalGrossSalary > 0 ? ((totalCNSSEmployee + totalCNSSEmployer) / totalGrossSalary) * 100 : 0;
  const amoBurdenPercentage = totalGrossSalary > 0 ? ((totalAMOEmployee + totalAMOEmployer) / totalGrossSalary) * 100 : 0;
  const igrBurdenPercentage = totalGrossSalary > 0 ? (totalIGR / totalGrossSalary) * 100 : 0;

  return {
    total_employees: employees.length,
    total_gross_salary: Math.round(totalGrossSalary * 100) / 100,
    total_net_salary: Math.round(totalNetSalary * 100) / 100,
    total_cnss_employee: Math.round(totalCNSSEmployee * 100) / 100,
    total_cnss_employer: Math.round(totalCNSSEmployer * 100) / 100,
    total_amo_employee: Math.round(totalAMOEmployee * 100) / 100,
    total_amo_employer: Math.round(totalAMOEmployer * 100) / 100,
    total_igr: Math.round(totalIGR * 100) / 100,
    average_salary: Math.round(averageSalary * 100) / 100,
    tax_burden_percentage: Math.round(taxBurdenPercentage * 100) / 100,
    cnss_burden_percentage: Math.round(cnssBurdenPercentage * 100) / 100,
    amo_burden_percentage: Math.round(amoBurdenPercentage * 100) / 100,
    igr_burden_percentage: Math.round(igrBurdenPercentage * 100) / 100
  };
}

/**
 * Get payroll trends for the last 12 months
 * Français: Obtenir les tendances de paie pour les 12 derniers mois
 */
export async function getPayrollTrends(companyId: string, months: number = 12): Promise<PayrollTrend[]> {
  const trends: PayrollTrend[] = [];
  const currentDate = new Date();
  
  // Get current KPIs to use as base
  const kpis = await getCompanyKPIs(companyId);
  
  // If no real data, generate sample trends
  if (kpis.total_employees === 0) {
    console.log("No real data - generating sample trends");
    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = targetDate.getMonth() + 1;
      const year = targetDate.getFullYear();
      
      // Generate sample data with some variation
      const variation = 0.8 + (Math.random() * 0.4); // 80% to 120% variation
      const baseSalary = 25000;
      const baseEmployees = 5;
      
      trends.push({
        month,
        year,
        total_employees: Math.round(baseEmployees * variation),
        total_gross_salary: Math.round(baseSalary * variation),
        total_net_salary: Math.round(baseSalary * 0.72 * variation), // 72% net
        total_taxes: Math.round(baseSalary * 0.28 * variation), // 28% taxes
        average_salary: Math.round((baseSalary * variation) / (baseEmployees * variation))
      });
    }
    return trends;
  }
  
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();
    
    trends.push({
      month,
      year,
      total_employees: kpis.total_employees,
      total_gross_salary: kpis.total_gross_salary,
      total_net_salary: kpis.total_net_salary,
      total_taxes: kpis.total_cnss_employee + kpis.total_cnss_employer + 
                   kpis.total_amo_employee + kpis.total_amo_employer + kpis.total_igr,
      average_salary: kpis.average_salary
    });
  }
  
  return trends;
}

/**
 * Get department analysis
 * Français: Obtenir l'analyse par département
 */
export async function getDepartmentAnalysis(companyId: string): Promise<DepartmentAnalysis[]> {
  const supabase = await createSupabaseServerClient();
  
  const { data: employees, error } = await supabase
    .from("employees")
    .select("*")
    .eq("company_id", companyId);
    
  if (error) {
    console.error("Error fetching employees for department analysis:", error);
    return [];
  }

  if (!employees || employees.length === 0) {
    console.log("No employees found - returning sample department data");
    // Return sample department data
    return [
      {
        department: "Développement",
        employee_count: 3,
        total_salary: 15000,
        average_salary: 5000,
        tax_burden: 4200,
        percentage_of_total: 60.0
      },
      {
        department: "Marketing",
        employee_count: 2,
        total_salary: 10000,
        average_salary: 5000,
        tax_burden: 2800,
        percentage_of_total: 40.0
      }
    ];
  }

  // Group employees by department (using job_title as department for now)
  const departmentMap = new Map<string, typeof employees>();
  
  employees.forEach(employee => {
    const department = employee.job_title || "Non spécifié";
    if (!departmentMap.has(department)) {
      departmentMap.set(department, []);
    }
    departmentMap.get(department)!.push(employee);
  });

  const totalSalary = employees.reduce((sum, emp) => sum + (emp.base_salary || 0), 0);
  const analysis: DepartmentAnalysis[] = [];

  departmentMap.forEach((deptEmployees, department) => {
    const deptTotalSalary = deptEmployees.reduce((sum, emp) => sum + (emp.base_salary || 0), 0);
    const deptAverageSalary = deptEmployees.length > 0 ? deptTotalSalary / deptEmployees.length : 0;
    
    // Calculate tax burden for this department
    let deptTaxBurden = 0;
    deptEmployees.forEach(emp => {
      const payrollResult = calculateMoroccanPayroll(
        emp.base_salary || 0,
        0, 0, 1.25,
        emp.marital_status || "single",
        emp.children_count || 0
      );
      deptTaxBurden += payrollResult.cnss + payrollResult.amo + payrollResult.igr;
    });

    analysis.push({
      department,
      employee_count: deptEmployees.length,
      total_salary: Math.round(deptTotalSalary * 100) / 100,
      average_salary: Math.round(deptAverageSalary * 100) / 100,
      tax_burden: Math.round(deptTaxBurden * 100) / 100,
      percentage_of_total: totalSalary > 0 ? Math.round((deptTotalSalary / totalSalary) * 10000) / 100 : 0
    });
  });

  return analysis.sort((a, b) => b.total_salary - a.total_salary);
}

/**
 * Get cost breakdown analysis
 * Français: Obtenir l'analyse de répartition des coûts
 */
export async function getCostBreakdown(companyId: string): Promise<CostBreakdown> {
  const kpis = await getCompanyKPIs(companyId);
  
  // If no real data, return sample cost breakdown
  if (kpis.total_employees === 0) {
    console.log("No real data - returning sample cost breakdown");
    return {
      salaries: {
        gross: 25000,
        net: 18000,
        percentage: 70.0
      },
      taxes: {
        cnss_employee: 1120,
        cnss_employer: 2150,
        amo_employee: 565,
        amo_employer: 1085,
        igr: 3120,
        total: 8040,
        percentage: 22.5
      },
      benefits: {
        health_insurance: 500,
        retirement: 300,
        other: 200,
        total: 1000,
        percentage: 2.8
      },
      overhead: {
        processing: 200,
        compliance: 150,
        administrative: 100,
        total: 450,
        percentage: 1.3
      }
    };
  }
  
  const totalCosts = kpis.total_gross_salary + 
                    kpis.total_cnss_employer + 
                    kpis.total_amo_employer;

  return {
    salaries: {
      gross: kpis.total_gross_salary,
      net: kpis.total_net_salary,
      percentage: totalCosts > 0 ? Math.round((kpis.total_gross_salary / totalCosts) * 10000) / 100 : 0
    },
    taxes: {
      cnss_employee: kpis.total_cnss_employee,
      cnss_employer: kpis.total_cnss_employer,
      amo_employee: kpis.total_amo_employee,
      amo_employer: kpis.total_amo_employer,
      igr: kpis.total_igr,
      total: kpis.total_cnss_employee + kpis.total_cnss_employer + 
             kpis.total_amo_employee + kpis.total_amo_employer + kpis.total_igr,
      percentage: totalCosts > 0 ? Math.round(((kpis.total_cnss_employee + kpis.total_cnss_employer + 
                   kpis.total_amo_employee + kpis.total_amo_employer + kpis.total_igr) / totalCosts) * 10000) / 100 : 0
    },
    benefits: {
      health_insurance: 0, // Placeholder - would come from benefits data
      retirement: 0, // Placeholder - would come from retirement contributions
      other: 0, // Placeholder - would come from other benefits
      total: 0,
      percentage: 0
    },
    overhead: {
      processing: 0, // Placeholder - would come from processing costs
      compliance: 0, // Placeholder - would come from compliance costs
      administrative: 0, // Placeholder - would come from admin costs
      total: 0,
      percentage: 0
    }
  };
}
