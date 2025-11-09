"use client";

import { useState, useEffect } from "react";
import { analyzeCompanyOptimizationAction } from "@/app/actions/ai-optimization";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import type { OptimizationAnalysis } from "@/lib/ai-optimization-engine";

export function OptimizationDashboard() {
  const [analysis, setAnalysis] = useState<OptimizationAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCompanyOptimizationAction();
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || "Erreur lors de l'analyse");
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, []);

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <Info className="h-4 w-4" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadAnalysis}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Opportunités d&apos;Optimisation
          </CardTitle>
          <CardDescription>
            Analyse des opportunités d&apos;optimisation fiscale pour votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-600 font-medium">Économies Potentielles</div>
              <div className="text-2xl font-bold text-green-700 mt-1">
                {analysis.totalPotentialSavings.toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "MAD",
                  minimumFractionDigits: 0,
                })}
              </div>
              <div className="text-xs text-green-600 mt-1">par an</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-600 font-medium">Priorité Haute</div>
              <div className="text-2xl font-bold text-red-700 mt-1">
                {analysis.summary.highPriority}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Priorité Moyenne</div>
              <div className="text-2xl font-bold text-yellow-700 mt-1">
                {analysis.summary.mediumPriority}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Priorité Basse</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {analysis.summary.lowPriority}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des Opportunités</CardTitle>
          <CardDescription>
            {analysis.opportunities.length} opportunité(s) détectée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.opportunities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Aucune opportunité d&apos;optimisation détectée.</p>
              <p className="text-sm mt-2">Vos données sont déjà optimisées !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysis.opportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getPriorityColor(opportunity.priority)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(opportunity.priority)}
                      <span className="font-semibold">{opportunity.employeeName}</span>
                    </div>
                    {opportunity.potentialSavings > 0 && (
                      <span className="text-sm font-bold">
                        +{opportunity.potentialSavings.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "MAD",
                          minimumFractionDigits: 0,
                        })}/an
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">{opportunity.description}</p>
                    <p className="text-xs opacity-80 mt-2">
                      <strong>Action requise:</strong> {opportunity.actionRequired}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={loadAnalysis} variant="outline">
          Actualiser l&apos;analyse
        </Button>
      </div>
    </div>
  );
}

