"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEmployeeAdded } from "@/components/MetaPixel";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { addEmployeeAction } from "@/app/actions/employees";

export function AddEmployeeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [contractType, setContractType] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add the select values to form data since Select component doesn't automatically add them
      if (contractType) {
        formData.set('contract_type', contractType);
      }
      if (maritalStatus) {
        formData.set('marital_status', maritalStatus);
      }
      
      const result = await addEmployeeAction(formData);
      
      if (result?.success) {
        // Track employee addition
        trackEmployeeAdded();
        
        setIsOpen(false);
        // Reset form
        setContractType("");
        setMaritalStatus("");
        // Refresh the page to show the new employee
        window.location.reload();
      } else if (result?.error) {
        if (result.redirectTo) {
          // If we need to redirect to settings, do it
          router.push(result.redirectTo);
        } else {
          setError(result.error);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur inattendue s'est produite";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog closes
      setContractType("");
      setMaritalStatus("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Employé
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Employé</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input 
                id="first_name"
                name="first_name" 
                placeholder="Prénom" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input 
                id="last_name"
                name="last_name" 
                placeholder="Nom" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cin_number">CIN</Label>
              <Input 
                id="cin_number"
                name="cin_number" 
                placeholder="CIN number" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnss_number">CNSS</Label>
              <Input 
                id="cnss_number"
                name="cnss_number" 
                placeholder="CNSS number" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_title">Poste</Label>
              <Input 
                id="job_title"
                name="job_title" 
                placeholder="Poste" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_salary">Salaire</Label>
              <Input 
                id="base_salary"
                name="base_salary" 
                placeholder="Salaire" 
                type="number" 
                min="0" 
                step="0.01" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contract_type">Type de contrat</Label>
              <Select value={contractType} onValueChange={setContractType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="ANAPEC">ANAPEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hire_date">Date d&apos;embauche</Label>
              <Input 
                id="hire_date"
                name="hire_date" 
                type="date" 
              />
            </div>
          </div>

          {/* Family Information Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informations Familiales</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marital_status">Situation familiale</Label>
                <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Situation familiale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Célibataire</SelectItem>
                    <SelectItem value="married">Marié(e)</SelectItem>
                    <SelectItem value="divorced">Divorcé(e)</SelectItem>
                    <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="children_count">Nombre d&apos;enfants</Label>
                <Input 
                  id="children_count"
                  name="children_count" 
                  type="number" 
                  min="0" 
                  max="6"
                  defaultValue="0"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">Maximum 6 enfants pour les déductions fiscales</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-end space-x-2 w-full">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
