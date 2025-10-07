"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download, TrendingUp } from "lucide-react";
import { KPIData, PayrollTrend, DepartmentAnalysis, CostBreakdown } from "@/lib/analytics-service";
import { 
  EmployeeCountCard, 
  TotalPayrollCard, 
  AverageSalaryCard, 
  TaxBurdenCard 
} from "./KPICard";
import { PayrollTrendsChart, PayrollTrendsMiniChart } from "./PayrollTrendsChart";
import { DepartmentAnalysisChart, DepartmentSummaryCards } from "./DepartmentAnalysisChart";
import { CostBreakdownChart, CostSummaryCards } from "./CostBreakdownChart";

interface AnalyticsDashboardProps {
  companyId: string;
  initialData?: {
    kpis: KPIData;
    trends: PayrollTrend[];
    departments: DepartmentAnalysis[];
    costs: CostBreakdown;
  };
}

export function AnalyticsDashboard({ companyId, initialData }: AnalyticsDashboardProps) {
  const [kpis] = useState<KPIData | null>(initialData?.kpis || null);
  const [trends] = useState<PayrollTrend[]>(initialData?.trends || []);
  const [departments] = useState<DepartmentAnalysis[]>(initialData?.departments || []);
  const [costs] = useState<CostBreakdown | null>(initialData?.costs || null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("12");
  const [chartType, setChartType] = useState<"pie" | "bar">("bar");

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would call your analytics API here
      // For now, we'll use the initial data or show loading state
      console.log("Loading analytics data for company:", companyId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // The data would be loaded from your analytics service
      // setKpis(await getCompanyKPIs(companyId));
      // setTrends(await getPayrollTrends(companyId, parseInt(period)));
      // setDepartments(await getDepartmentAnalysis(companyId));
      // setCosts(await getCostBreakdown(companyId));
      
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      loadAnalyticsData();
    }
  }, [companyId, period, initialData, loadAnalyticsData]);

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting analytics data...");
  };

  if (loading && !initialData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Chargement des données analytiques...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord Analytique</h2>
          <p className="text-gray-600">Analyse complète de votre masse salariale et coûts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 mois</SelectItem>
              <SelectItem value="6">6 mois</SelectItem>
              <SelectItem value="12">12 mois</SelectItem>
              <SelectItem value="24">24 mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EmployeeCountCard value={kpis.total_employees} />
          <TotalPayrollCard value={kpis.total_gross_salary} />
          <AverageSalaryCard value={kpis.average_salary} />
          <TaxBurdenCard value={kpis.tax_burden_percentage} />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Trends */}
        {trends.length > 0 && (
          <PayrollTrendsChart data={trends} title="Évolution de la Paie" />
        )}
        
        {/* Department Analysis */}
        {departments.length > 0 && (
          <DepartmentAnalysisChart 
            data={departments} 
            title="Analyse par Département"
            chartType={chartType}
          />
        )}
      </div>

      {/* Department Summary */}
      {departments.length > 0 && (
        <DepartmentSummaryCards data={departments} />
      )}

      {/* Cost Analysis */}
      {costs && (
        <div className="space-y-6">
          <CostSummaryCards data={costs} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBreakdownChart 
              data={costs} 
              title="Répartition des Coûts"
              chartType="pie"
            />
            <CostBreakdownChart 
              data={costs} 
              title="Détail des Charges Fiscales"
              chartType="bar"
            />
          </div>
        </div>
      )}

      {/* Mini Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends.length > 0 && (
          <PayrollTrendsMiniChart data={trends} />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Indicateurs Clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpis && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Charge CNSS</span>
                    <span className="font-semibold">{kpis.cnss_burden_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Charge AMO</span>
                    <span className="font-semibold">{kpis.amo_burden_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Charge IGR</span>
                    <span className="font-semibold">{kpis.igr_burden_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Salaire Net Moyen</span>
                    <span className="font-semibold">
                      {((kpis.total_net_salary / kpis.total_employees) || 0).toLocaleString('fr-MA')} MAD
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Type Selector */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={chartType === "bar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType("bar")}
          >
            Barres
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "ghost"}
            size="sm"
            onClick={() => setChartType("pie")}
          >
            Secteurs
          </Button>
        </div>
      </div>
    </div>
  );
}
