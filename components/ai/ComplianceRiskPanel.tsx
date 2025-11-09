"use client";

import { useState, useEffect } from "react";
import { runComplianceCheckAction } from "@/app/actions/ai-compliance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ComplianceReport } from "@/lib/ai-compliance-detector";

export function ComplianceRiskPanel() {
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await runComplianceCheckAction();
      if (result.success && result.data) {
        setReport(result.data);
      } else {
        setError(result.error || "Erreur lors de la vérification");
      }
    } catch (err) {
      setError("Erreur lors du chargement du rapport");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-50 border-red-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getSeverityColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getSeverityIcon = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
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
            <Button onClick={loadReport}>Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
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
      {/* Risk Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Score de Risque de Conformité
          </CardTitle>
          <CardDescription>
            Évaluation globale de la conformité de votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`rounded-lg p-6 border-2 ${getRiskColor(report.overallRiskScore)}`}>
              <div className="text-sm font-medium mb-2">Score Global</div>
              <div className="text-4xl font-bold">{report.overallRiskScore}/100</div>
              <div className="text-xs mt-2">
                {report.compliant ? "Conforme" : "Non conforme"}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="text-sm text-red-600 font-medium">Problèmes Critiques</div>
              <div className="text-2xl font-bold text-red-700 mt-1">
                {report.summary.high}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Avertissements</div>
              <div className="text-2xl font-bold text-yellow-700 mt-1">
                {report.summary.medium}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Informations</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {report.summary.low}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Problèmes de Conformité Détectés</CardTitle>
          <CardDescription>
            {report.issues.length} problème(s) détecté(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Aucun problème de conformité détecté.</p>
              <p className="text-sm mt-2">Votre entreprise est conforme !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {report.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(issue.severity)}
                      <span className="font-semibold">
                        {issue.employeeName || "Entreprise"}
                      </span>
                    </div>
                    <span className="text-xs font-medium uppercase">
                      {issue.severity}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">{issue.message}</p>
                    <p className="text-xs opacity-80 mt-2">
                      <strong>Recommandation:</strong> {issue.recommendation}
                    </p>
                    {issue.currentValue !== undefined && (
                      <div className="mt-2 text-xs">
                        <span className="opacity-70">Valeur actuelle:</span>{" "}
                        {String(issue.currentValue)}
                        {issue.expectedValue !== undefined && issue.expectedValue !== null && (
                          <>
                            {" | "}
                            <span className="opacity-70">Attendu:</span>{" "}
                            {String(issue.expectedValue)}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={loadReport} variant="outline">
          Actualiser la vérification
        </Button>
      </div>
    </div>
  );
}

