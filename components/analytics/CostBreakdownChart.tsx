"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { PieChart as PieChartIcon, BarChart3, Calculator, Percent } from "lucide-react";
import { CostBreakdown } from "@/lib/analytics-service";

interface CostBreakdownChartProps {
  data: CostBreakdown;
  title?: string;
  chartType?: "pie" | "bar";
}

const COLORS = {
  salaries: "#3b82f6",
  taxes: "#ef4444", 
  benefits: "#10b981",
  overhead: "#f59e0b"
};

export function CostBreakdownChart({ 
  data, 
  title = "Répartition des Coûts",
  chartType = "pie"
}: CostBreakdownChartProps) {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('fr-MA')} MAD`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare data for charts
  const pieData = [
    { 
      name: "Salaires", 
      value: data.salaries.gross, 
      percentage: data.salaries.percentage,
      color: COLORS.salaries 
    },
    { 
      name: "Charges Fiscales", 
      value: data.taxes.total, 
      percentage: data.taxes.percentage,
      color: COLORS.taxes 
    },
    { 
      name: "Avantages", 
      value: data.benefits.total, 
      percentage: data.benefits.percentage,
      color: COLORS.benefits 
    },
    { 
      name: "Frais Généraux", 
      value: data.overhead.total, 
      percentage: data.overhead.percentage,
      color: COLORS.overhead 
    }
  ].filter(item => item.value > 0);

  const barData = [
    { 
      category: "Salaires Bruts", 
      amount: data.salaries.gross,
      percentage: data.salaries.percentage
    },
    { 
      category: "CNSS Employé", 
      amount: data.taxes.cnss_employee,
      percentage: (data.taxes.cnss_employee / (data.salaries.gross + data.taxes.total)) * 100
    },
    { 
      category: "CNSS Employeur", 
      amount: data.taxes.cnss_employer,
      percentage: (data.taxes.cnss_employer / (data.salaries.gross + data.taxes.total)) * 100
    },
    { 
      category: "AMO Employé", 
      amount: data.taxes.amo_employee,
      percentage: (data.taxes.amo_employee / (data.salaries.gross + data.taxes.total)) * 100
    },
    { 
      category: "AMO Employeur", 
      amount: data.taxes.amo_employer,
      percentage: (data.taxes.amo_employer / (data.salaries.gross + data.taxes.total)) * 100
    },
    { 
      category: "IGR", 
      amount: data.taxes.igr,
      percentage: (data.taxes.igr / (data.salaries.gross + data.taxes.total)) * 100
    }
  ].filter(item => item.amount > 0);

  if (chartType === "pie") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2" />
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
                  formatter={(value: number, name: string, props: { payload: { name: string; percentage: number } }) => [
                    `${value.toLocaleString('fr-MA')} MAD`,
                    props.payload.name
                  ]}
                />
                <Legend />
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
          <BarChart3 className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                stroke="#666"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                stroke="#666"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: { payload: { category: string; percentage: number } }) => [
                  [
                    `${value.toLocaleString('fr-MA')} MAD`,
                    `${props.payload.percentage.toFixed(1)}% du total`
                  ],
                  props.payload.category
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="amount" 
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

// Cost summary cards
export function CostSummaryCards({ data }: { data: CostBreakdown }) {
  const totalCosts = data.salaries.gross + data.taxes.total + data.benefits.total + data.overhead.total;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Salaires Bruts</p>
              <p className="text-xl font-bold text-gray-900">
                {data.salaries.gross.toLocaleString('fr-MA')} MAD
              </p>
              <p className="text-xs text-gray-500">{data.salaries.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Percent className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Charges Fiscales</p>
              <p className="text-xl font-bold text-gray-900">
                {data.taxes.total.toLocaleString('fr-MA')} MAD
              </p>
              <p className="text-xs text-gray-500">{data.taxes.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <PieChartIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avantages</p>
              <p className="text-xl font-bold text-gray-900">
                {data.benefits.total.toLocaleString('fr-MA')} MAD
              </p>
              <p className="text-xs text-gray-500">{data.benefits.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Frais Généraux</p>
              <p className="text-xl font-bold text-gray-900">
                {data.overhead.total.toLocaleString('fr-MA')} MAD
              </p>
              <p className="text-xs text-gray-500">{data.overhead.percentage.toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
