"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendPayslipEmailAction } from "@/app/actions/email-payslip";

interface EmailPayslipDialogProps {
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  payrollData?: {
    base_salary: number;
    gross_salary: number;
    cnss: number;
    amo: number;
    igr: number;
    net_salary: number;
  };
  downloadUrl?: string;
}

export function EmailPayslipDialog({ 
  employeeId, 
  employeeName, 
  month, 
  year, 
  payrollData,
  downloadUrl 
}: EmailPayslipDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setResult({ success: false, error: "Veuillez saisir une adresse email" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.set("employeeId", employeeId);
      formData.set("month", month.toString());
      formData.set("year", year.toString());
      formData.set("employeeEmail", email);
      if (downloadUrl) {
        formData.set("downloadUrl", downloadUrl);
      }

      const response = await sendPayslipEmailAction(formData);
      
      if (response.success) {
        setResult({ 
          success: true, 
          message: `Client email ouvert avec le bulletin de paie pour ${email}. Vous pouvez maintenant envoyer l'email.` 
        });
        setEmail("");
      } else {
        setResult({ 
          success: false, 
          error: response.error || "Erreur lors de l'envoi de l'email" 
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inattendue";
      setResult({ 
        success: false, 
        error: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setResult(null);
      setEmail("");
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
        <Button variant="outline" size="sm">
          <Mail className="w-4 h-4 mr-2" />
          Envoyer par Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Envoyer le Bulletin de Paie
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Employee Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Informations</h3>
            <p><strong>Employé:</strong> {employeeName}</p>
            <p><strong>Période:</strong> {monthName} {year}</p>
            {payrollData && (
              <p><strong>Net à payer:</strong> {payrollData.net_salary.toFixed(2)} MAD</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Adresse Email de l&apos;Employé</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employe@email.com"
              disabled={isLoading}
              required
            />
          </div>

          {/* Result Display */}
          {result && (
            <div className={`p-3 rounded-md flex items-center ${
              result.success 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {result.success ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <span>{result.message || result.error}</span>
            </div>
          )}

          {/* Preview */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Aperçu de l&apos;Email</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Destinataire:</strong> {email || "employe@email.com"}</p>
              <p><strong>Objet:</strong> Bulletin de Paie - {monthName} {year}</p>
              <p><strong>Contenu:</strong> Email professionnel avec détails de la paie et lien de téléchargement</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSendEmail}
            disabled={isLoading || !email.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer l&apos;Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
