"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Calculator, Percent } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: React.ReactNode;
  description?: string;
  format?: "currency" | "number" | "percentage";
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  description,
  format = "number"
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return typeof val === "number" ? `${val.toLocaleString('fr-MA')} MAD` : val;
    } else if (format === "percentage") {
      return typeof val === "number" ? `${val.toFixed(1)}%` : val;
    } else {
      return typeof val === "number" ? val.toLocaleString('fr-MA') : val;
    }
  };

  const getTrendIcon = () => {
    switch (changeType) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-xs mt-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1">
              {change > 0 ? "+" : ""}{change.toFixed(1)}%
            </span>
            <span className="ml-1 text-gray-500">vs mois dernier</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Predefined KPI cards for common metrics
export function EmployeeCountCard({ value, change }: { value: number; change?: number }) {
  return (
    <KPICard
      title="Nombre d'Employés"
      value={value}
      change={change}
      changeType={change && change > 0 ? "increase" : change && change < 0 ? "decrease" : "neutral"}
      icon={<Users className="h-4 w-4" />}
      description="Total des employés actifs"
      format="number"
    />
  );
}

export function TotalPayrollCard({ value, change }: { value: number; change?: number }) {
  return (
    <KPICard
      title="Masse Salariale"
      value={value}
      change={change}
      changeType={change && change > 0 ? "increase" : change && change < 0 ? "decrease" : "neutral"}
      icon={<DollarSign className="h-4 w-4" />}
      description="Total des salaires bruts"
      format="currency"
    />
  );
}

export function AverageSalaryCard({ value, change }: { value: number; change?: number }) {
  return (
    <KPICard
      title="Salaire Moyen"
      value={value}
      change={change}
      changeType={change && change > 0 ? "increase" : change && change < 0 ? "decrease" : "neutral"}
      icon={<Calculator className="h-4 w-4" />}
      description="Salaire brut moyen par employé"
      format="currency"
    />
  );
}

export function TaxBurdenCard({ value, change }: { value: number; change?: number }) {
  return (
    <KPICard
      title="Charge Fiscale"
      value={value}
      change={change}
      changeType={change && change > 0 ? "increase" : change && change < 0 ? "decrease" : "neutral"}
      icon={<Percent className="h-4 w-4" />}
      description="Pourcentage des charges sur salaire brut"
      format="percentage"
    />
  );
}
