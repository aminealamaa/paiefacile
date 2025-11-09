"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Building2, Users, DollarSign } from "lucide-react";
import { DepartmentAnalysis } from "@/lib/analytics-service";

interface DepartmentAnalysisChartProps {
  data: DepartmentAnalysis[];
  title?: string;
  chartType?: "bar" | "pie";
}

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", 
  "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
];

export function DepartmentAnalysisChart({ 
  data, 
  title = "Analyse par Département",
  chartType = "bar"
}: DepartmentAnalysisChartProps) {
  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}k MAD`;
  };


  if (chartType === "pie") {
    // Transform data for Recharts PieChart
    const pieData = data.map((item, index) => ({
      name: item.department,
      value: item.total_salary,
      percentage: item.percentage_of_total,
      color: COLORS[index % COLORS.length]
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, item: { payload?: { name?: string; percentage?: number } }) => [
                    `${value.toLocaleString('fr-MA')} MAD`,
                    item.payload?.name || name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="department" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                stroke="#666"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number, name: string, item: { payload?: { department?: string; employee_count?: number; average_salary?: number; percentage_of_total?: number } }) => {
                  const data = item.payload;
                  return [
                    [
                      `${value.toLocaleString('fr-MA')} MAD`,
                      `${data?.employee_count || 0} employés`,
                      `Moyenne: ${data?.average_salary?.toLocaleString('fr-MA') || '0'} MAD`,
                      `${data?.percentage_of_total?.toFixed(1) || '0'}% du total`
                    ],
                    name === "total_salary" ? "Salaire Total" : "Employés"
                  ];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.department;
                  }
                  return label;
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="total_salary" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Department summary cards
export function DepartmentSummaryCards({ data }: { data: DepartmentAnalysis[] }) {
  const totalEmployees = data.reduce((sum, dept) => sum + dept.employee_count, 0);
  const totalSalary = data.reduce((sum, dept) => sum + dept.total_salary, 0);
  const averageSalary = totalSalary / totalEmployees;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Employés</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Masse Salariale</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSalary.toLocaleString('fr-MA')} MAD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Salaire Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(averageSalary).toLocaleString('fr-MA')} MAD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
