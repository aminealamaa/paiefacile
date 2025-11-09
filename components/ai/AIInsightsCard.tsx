"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analyzeCompanyOptimizationAction } from "@/app/actions/ai-optimization";
import { runComplianceCheckAction } from "@/app/actions/ai-compliance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Shield, ArrowRight, Loader2 } from "lucide-react";

export function AIInsightsCard() {
  const [optimizationSavings, setOptimizationSavings] = useState<number | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const [optResult, complianceResult] = await Promise.allSettled([
          analyzeCompanyOptimizationAction(),
          runComplianceCheckAction(),
        ]);

        if (optResult.status === "fulfilled" && optResult.value.success && optResult.value.data) {
          setOptimizationSavings(optResult.value.data.totalPotentialSavings);
        } else if (optResult.status === "rejected") {
          console.error("Error loading optimization insights:", optResult.reason);
        }

        if (complianceResult.status === "fulfilled" && complianceResult.value.success && complianceResult.value.data) {
          setRiskScore(complianceResult.value.data.overallRiskScore);
        } else if (complianceResult.status === "rejected") {
          console.error("Error loading compliance insights:", complianceResult.reason);
        }
      } catch (error) {
        console.error("Error loading AI insights:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-600" />
          Insights IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {optimizationSavings !== null && optimizationSavings > 0 && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm font-medium text-green-900">
                  Économies potentielles
                </div>
                <div className="text-lg font-bold text-green-700">
                  {optimizationSavings.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "MAD",
                    minimumFractionDigits: 0,
                  })}
                  /an
                </div>
              </div>
            </div>
          </div>
        )}

        {riskScore !== null && (
          <div
            className={`flex items-center justify-between p-3 rounded-lg border ${
              riskScore >= 70
                ? "bg-red-50 border-red-200"
                : riskScore >= 40
                ? "bg-yellow-50 border-yellow-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield
                className={`h-5 w-5 ${
                  riskScore >= 70
                    ? "text-red-600"
                    : riskScore >= 40
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              />
              <div>
                <div className="text-sm font-medium">
                  Score de conformité
                </div>
                <div className="text-lg font-bold">{riskScore}/100</div>
              </div>
            </div>
          </div>
        )}

        <Link href="/fr/dashboard/ai">
          <Button className="w-full" variant="outline">
            Voir tous les insights IA
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

