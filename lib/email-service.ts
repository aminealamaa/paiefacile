export interface PayslipEmailData {
  employee_name: string;
  employee_email: string;
  company_name: string;
  month: number;
  year: number;
  base_salary: number;
  gross_salary: number;
  cnss: number;
  amo: number;
  igr: number;
  net_salary: number;
  download_url?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send payslip email to employee using client-side email generation
 * Français: Envoyer le bulletin de paie par email à l'employé (client-side)
 */
export async function sendPayslipEmail(data: PayslipEmailData): Promise<EmailResult> {
  try {
    // Create email content
    const subject = `Bulletin de Paie - ${data.month}/${data.year} - ${data.company_name}`;
    const textContent = generatePayslipEmailText(data);
    
    // Generate mailto link
    const mailtoLink = generateMailtoLink(data.employee_email, subject, textContent);
    
    // Open default email client
    window.open(mailtoLink, '_blank');
    
    return { success: true, messageId: 'client-email-opened' };
    
  } catch (error: unknown) {
    console.error('Email service error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ouverture de l\'email';
    return { success: false, error: errorMessage };
  }
}

/**
 * Generate mailto link for opening default email client
 * Français: Générer le lien mailto pour ouvrir le client email par défaut
 */
function generateMailtoLink(email: string, subject: string, body: string): string {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}


/**
 * Generate text email content for payslip
 * Français: Générer le contenu texte de l'email pour le bulletin de paie
 */
function generatePayslipEmailText(data: PayslipEmailData): string {
  return `
BULLETIN DE PAIE - ${data.company_name}
=====================================

Employé: ${data.employee_name}
Période: ${data.month}/${data.year}

DÉTAIL DE LA PAIE:
------------------
Salaire de base: ${data.base_salary.toFixed(2)} MAD
Salaire brut: ${data.gross_salary.toFixed(2)} MAD

DÉDUCTIONS:
-----------
CNSS: -${data.cnss.toFixed(2)} MAD
AMO: -${data.amo.toFixed(2)} MAD
IGR: -${data.igr.toFixed(2)} MAD

NET À PAYER: ${data.net_salary.toFixed(2)} MAD

${data.download_url ? `Télécharger le bulletin PDF: ${data.download_url}` : ''}

---
Ce bulletin de paie a été généré automatiquement par PaieFacile
Date d'envoi: ${new Date().toLocaleDateString('fr-MA')}
Pour toute question, contactez votre service RH.
  `;
}

/**
 * Send bulk payslip emails to multiple employees
 * Français: Envoyer les bulletins de paie en masse à plusieurs employés
 */
export async function sendBulkPayslipEmails(
  payslips: PayslipEmailData[]
): Promise<{ success: number; failed: number; errors: string[] }> {
  try {
    // For bulk emails, we'll create a single email with all payslips
    if (payslips.length === 0) {
      return { success: 0, failed: 0, errors: ['Aucun employé sélectionné'] };
    }

    // Create a combined email for all employees
    const firstPayslip = payslips[0];
    const subject = `Bulletins de Paie - ${firstPayslip.month}/${firstPayslip.year} - ${firstPayslip.company_name}`;
    const body = generateBulkPayslipEmailText(payslips);
    
    // Get all email addresses
    const emailAddresses = payslips.map(p => p.employee_email).join(', ');
    
    // Generate mailto link
    const mailtoLink = generateMailtoLink(emailAddresses, subject, body);
    
    // Open default email client
    window.open(mailtoLink, '_blank');
    
    return { success: payslips.length, failed: 0, errors: [] };
    
  } catch (error: unknown) {
    console.error('Bulk email error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'envoi en masse';
    return { success: 0, failed: payslips.length, errors: [errorMessage] };
  }
}

/**
 * Generate text content for bulk payslip email
 * Français: Générer le contenu texte pour l'email en masse des bulletins
 */
function generateBulkPayslipEmailText(payslips: PayslipEmailData[]): string {
  const firstPayslip = payslips[0];
  
  let content = `
BULLETINS DE PAIE - ${firstPayslip.company_name}
==============================================

Période: ${firstPayslip.month}/${firstPayslip.year}

DÉTAILS DES BULLETINS:
=====================

`;

  payslips.forEach((payslip, index) => {
    content += `
${index + 1}. ${payslip.employee_name}
   Email: ${payslip.employee_email}
   Salaire de base: ${payslip.base_salary.toFixed(2)} MAD
   Salaire brut: ${payslip.gross_salary.toFixed(2)} MAD
   CNSS: -${payslip.cnss.toFixed(2)} MAD
   AMO: -${payslip.amo.toFixed(2)} MAD
   IGR: -${payslip.igr.toFixed(2)} MAD
   NET À PAYER: ${payslip.net_salary.toFixed(2)} MAD

`;
  });

  content += `
---
Ce message contient les bulletins de paie pour ${payslips.length} employé(s).
Date d'envoi: ${new Date().toLocaleDateString('fr-MA')}
Généré automatiquement par PaieFacile
  `;

  return content;
}
