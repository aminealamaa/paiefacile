"use client";

import { Button } from "@/components/ui/button";

export function PayslipDownload({ company, result }: { company: Record<string, unknown>; result: Record<string, unknown> }) {
  const handleDownload = () => {
    // Simple text-based payslip for now
    const payslipText = `
BULLETIN DE PAIE
================

Entreprise: ${company?.name || 'N/A'}
Période: ${result?.month || 'N/A'}/${result?.year || 'N/A'}

Employé: ${result?.employee_name || 'N/A'}
Salaire de base: ${result?.base_salary || 0} MAD
Primes: ${result?.bonuses || 0} MAD
Salaire brut: ${result?.gross_salary || 0} MAD

Déductions:
- CNSS: ${result?.cnss || 0} MAD
- AMO: ${result?.amo || 0} MAD
- IGR: ${result?.igr || 0} MAD

NET À PAYER: ${result?.net_salary || 0} MAD
    `;
    
    const blob = new Blob([payslipText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin-paie-${result?.month || 'N/A'}-${result?.year || 'N/A'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      Télécharger le Bulletin de Paie
    </Button>
  );
}