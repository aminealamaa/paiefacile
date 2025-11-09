"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { PayrollTrend } from "@/lib/analytics-service";

interface PayrollTrendsChartProps {
  data: PayrollTrend[];
  title?: string;
  showLegend?: boolean;
}

export function PayrollTrendsChart({ 
  data, 
  title = "Évolution de la Paie",
  showLegend = true 
}: PayrollTrendsChartProps) {
  const formatMonth = (month: number, year: number) => {
    const months = [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
    ];
    return `${months[month - 1]} ${year}`;
  };

  const formatCurrency = (value: number) => {
    return `${(value / 1000).toFixed(0)}k MAD`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('fr-MA');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value, index) => formatMonth(value, data[index]?.year || new Date().getFullYear())}
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                yAxisId="salary"
                orientation="left"
                tickFormatter={formatCurrency}
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                yAxisId="employees"
                orientation="right"
                tickFormatter={formatNumber}
                stroke="#666"
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === "total_gross_salary" || name === "total_net_salary" || name === "average_salary") {
                    return [`${value.toLocaleString('fr-MA')} MAD`, name === "total_gross_salary" ? "Salaire Brut Total" : 
                            name === "total_net_salary" ? "Salaire Net Total" : "Salaire Moyen"];
                  } else if (name === "total_employees") {
                    return [`${value} employés`, "Nombre d'Employés"];
                  } else {
                    return [`${value.toLocaleString('fr-MA')} MAD`, "Total Taxes"];
                  }
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return formatMonth(data.month, data.year);
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
              {showLegend && (
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
              )}
              <Line
                yAxisId="salary"
                type="monotone"
                dataKey="total_gross_salary"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Salaire Brut Total"
              />
              <Line
                yAxisId="salary"
                type="monotone"
                dataKey="total_net_salary"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Salaire Net Total"
              />
              <Line
                yAxisId="employees"
                type="monotone"
                dataKey="total_employees"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                name="Nombre d'Employés"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified version for smaller spaces
export function PayrollTrendsMiniChart({ data }: { data: PayrollTrend[] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
                  return months[value - 1];
                }}
                stroke="#666"
                fontSize={10}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                stroke="#666"
                fontSize={10}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString('fr-MA')} MAD`, "Salaire Brut"]}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
                    return `${months[data.month - 1]} ${data.year}`;
                  }
                  return label;
                }}
              />
              <Line
                type="monotone"
                dataKey="total_gross_salary"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
