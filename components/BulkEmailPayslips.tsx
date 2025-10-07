"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send, Users, CheckCircle, AlertCircle } from "lucide-react";
import { sendBulkPayslipEmailsAction } from "@/app/actions/email-payslip";

interface Employee {
  id: string;
  name: string;
  email?: string;
  base_salary: number;
}

interface BulkEmailPayslipsProps {
  employees: Employee[];
  month: number;
  year: number;
  onSuccess?: (result: { sent: number; failed: number; errors: string[] }) => void;
}

export function BulkEmailPayslips({ employees, month, year, onSuccess }: BulkEmailPayslipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeEmails, setEmployeeEmails] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    success: boolean; 
    sent?: number; 
    failed?: number; 
    errors?: string[];
    message?: string;
  } | null>(null);

  const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employeeId]);
    } else {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
      // Remove email when unselected
      setEmployeeEmails(prev => {
        const newEmails = { ...prev };
        delete newEmails[employeeId];
        return newEmails;
      });
    }
  };

  const handleEmailChange = (employeeId: string, email: string) => {
    setEmployeeEmails(prev => ({
      ...prev,
      [employeeId]: email
    }));
  };

  const handleSendBulkEmails = async () => {
    const selectedEmails = selectedEmployees.map(id => employeeEmails[id]).filter(Boolean);
    
    if (selectedEmails.length === 0) {
      setResult({ 
        success: false, 
        message: "Veuillez sélectionner au moins un employé avec une adresse email" 
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const payslips = selectedEmployees.map(employeeId => ({
        employeeId,
        month,
        year,
        employeeEmail: employeeEmails[employeeId]
      }));

      const formData = new FormData();
      formData.set("payslips", JSON.stringify(payslips));

      const response = await sendBulkPayslipEmailsAction(formData);
      
      if (response.success) {
        const result = {
          success: true,
          sent: response.sent,
          failed: response.failed,
          errors: response.errors || [],
          message: `Envoi terminé: ${response.sent} succès, ${response.failed} échecs`
        };
        setResult(result);
        onSuccess?.(result);
      } else {
        setResult({ 
          success: false, 
          message: response.error || "Erreur lors de l'envoi des emails" 
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inattendue";
      setResult({ 
        success: false, 
        message: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setResult(null);
      setSelectedEmployees([]);
      setEmployeeEmails({});
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
        <Button className="bg-green-600 hover:bg-green-700">
          <Mail className="w-4 h-4 mr-2" />
          Envoyer les Bulletins par Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Envoi en Masse des Bulletins de Paie
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Period Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Période</h3>
            <p><strong>Mois:</strong> {monthName} {year}</p>
            <p><strong>Employés disponibles:</strong> {employees.length}</p>
          </div>

          {/* Employee Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold">Sélectionner les Employés</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-3 border rounded-md">
                  <Checkbox
                    id={`employee-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={(checked: boolean) => 
                      handleEmployeeSelection(employee.id, checked)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor={`employee-${employee.id}`} className="font-medium">
                      {employee.name}
                    </Label>
                    <p className="text-sm text-gray-500">
                      Salaire: {employee.base_salary.toFixed(2)} MAD
                    </p>
                  </div>
                  {selectedEmployees.includes(employee.id) && (
                    <div className="w-64">
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={employeeEmails[employee.id] || ""}
                        onChange={(e) => handleEmailChange(employee.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedEmployees.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-semibold mb-2">Résumé de la Sélection</h4>
              <p><strong>Employés sélectionnés:</strong> {selectedEmployees.length}</p>
              <p><strong>Emails fournis:</strong> {Object.keys(employeeEmails).length}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-md ${
              result.success 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <div className="flex items-center mb-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                <span className="font-semibold">{result.message}</span>
              </div>
              
              {result.sent !== undefined && result.failed !== undefined && (
                <div className="text-sm mt-2">
                  <p>✅ Envoyés avec succès: {result.sent}</p>
                  <p>❌ Échecs: {result.failed}</p>
                </div>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-sm">Détails des erreurs:</p>
                  <ul className="text-xs mt-1 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="text-red-600">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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
            onClick={handleSendBulkEmails}
            disabled={isLoading || selectedEmployees.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer {selectedEmployees.length} Email(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
