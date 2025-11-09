"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Download, CheckCircle, AlertCircle } from "lucide-react";
import { generateCNSSDeclarationAction } from "@/app/actions/cnss-declaration";

export function CNSSDeclarationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [format, setFormat] = useState<"excel" | "csv" | "pdf">("excel");

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      formData.set('month', month.toString());
      formData.set('year', year.toString());
      formData.set('format', format);
      
      const result = await generateCNSSDeclarationAction(formData);
      
      if (result?.success && result.fileBuffer) {
        // Convert base64 to blob and download
        const binaryString = atob(result.fileBuffer);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: result.mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setSuccess(`Fichier ${result.fileName} téléchargé avec succès!`);
      } else if (result?.error) {
        setError(result.error);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inattendue";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      setSuccess(null);
    }
  };

  const months = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" }
  ];

  const monthName = months.find(m => m.value === month)?.label || "Mois";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          📄 Télécharger déclaration CNSS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2" />
              Génération Déclaration CNSS
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Period Selection */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2020"
                max="2030"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month">Mois</Label>
              <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Format de fichier</Label>
            <Select value={format} onValueChange={(value: "excel" | "csv" | "pdf") => setFormat(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx) - Recommandé</SelectItem>
                <SelectItem value="csv">CSV (.csv) - Import simple</SelectItem>
                <SelectItem value="pdf">PDF (.pdf) - Format officiel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Informations</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Période:</strong> {monthName} {year}</p>
              <p><strong>Format:</strong> {
                format === "excel" ? "Excel (.xlsx)" : 
                format === "csv" ? "CSV (.csv)" : 
                "PDF (.pdf)"
              }</p>
              <p><strong>Plafond CNSS:</strong> 6,000 MAD</p>
              <p><strong>Taux CNSS:</strong> 4.48% (employé) / 8.60% (employeur)</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Génération...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Générer et Télécharger
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
