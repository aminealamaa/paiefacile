"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEmployeeAdded } from "@/components/MetaPixel";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { addEmployeeAction } from "@/app/actions/employees";
import { t, type Locale } from "@/lib/translations";
import { extractLocaleFromPath } from "@/lib/i18n-utils";

export function AddEmployeeDialog({ locale: propLocale }: { locale?: Locale }) {
  const pathname = usePathname();
  const locale = propLocale || extractLocaleFromPath(pathname);
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
      const errorMessage = err instanceof Error ? err.message : t(locale, "common.unexpectedError");
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
          {t(locale, "employees.newEmployee")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(locale, "employees.addEmployee")}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t(locale, "employees.firstName")}</Label>
              <Input 
                id="first_name"
                name="first_name" 
                placeholder={t(locale, "employees.firstName")} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t(locale, "employees.lastName")}</Label>
              <Input 
                id="last_name"
                name="last_name" 
                placeholder={t(locale, "employees.lastName")} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cin_number">{t(locale, "employees.cin")}</Label>
              <Input 
                id="cin_number"
                name="cin_number" 
                placeholder={t(locale, "employees.cinPlaceholder")} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnss_number">{t(locale, "employees.cnss")}</Label>
              <Input 
                id="cnss_number"
                name="cnss_number" 
                placeholder={t(locale, "employees.cnssPlaceholder")} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="job_title">{t(locale, "employees.position")}</Label>
              <Input 
                id="job_title"
                name="job_title" 
                placeholder={t(locale, "employees.position")} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_salary">{t(locale, "employees.salary")}</Label>
              <Input 
                id="base_salary"
                name="base_salary" 
                placeholder={t(locale, "employees.salary")} 
                type="number" 
                min="0" 
                step="0.01" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contract_type">{t(locale, "employees.contractType")}</Label>
              <Select value={contractType} onValueChange={setContractType} required>
                <SelectTrigger>
                  <SelectValue placeholder={t(locale, "employees.selectContractType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="ANAPEC">ANAPEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hire_date">{t(locale, "employees.hireDate")}</Label>
              <Input 
                id="hire_date"
                name="hire_date" 
                type="date" 
              />
            </div>
          </div>

          {/* Family Information Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t(locale, "employees.familyInfo")}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marital_status">{t(locale, "employees.maritalStatus")}</Label>
                <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder={t(locale, "employees.maritalStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{t(locale, "employees.single")}</SelectItem>
                    <SelectItem value="married">{t(locale, "employees.married")}</SelectItem>
                    <SelectItem value="divorced">{t(locale, "employees.divorced")}</SelectItem>
                    <SelectItem value="widowed">{t(locale, "employees.widowed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="children_count">{t(locale, "employees.childrenCount")}</Label>
                <Input 
                  id="children_count"
                  name="children_count" 
                  type="number" 
                  min="0" 
                  max="6"
                  defaultValue="0"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">{t(locale, "employees.maxChildrenNote")}</p>
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
                {t(locale, "common.cancel")}
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? t(locale, "employees.saving") : t(locale, "common.save")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
