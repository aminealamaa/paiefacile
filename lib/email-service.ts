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
 * Generate HTML email content for payslip
 * Français: Générer le contenu HTML de l'email pour le bulletin de paie
 */
function generatePayslipEmailHTML(data: PayslipEmailData): string {
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bulletin de Paie</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .email-container {
          background-color: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .payslip-title {
          font-size: 18px;
          color: #374151;
        }
        .employee-info {
          background-color: #f3f4f6;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .salary-breakdown {
          background-color: #fef3c7;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .net-salary {
          background-color: #d1fae5;
          padding: 20px;
          border-radius: 6px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          color: #065f46;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .download-btn {
          display: inline-block;
          background-color: #1e40af;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 15px;
        }
        .download-btn:hover {
          background-color: #1e3a8a;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="company-name">${data.company_name}</div>
          <div class="payslip-title">Bulletin de Paie - ${data.month}/${data.year}</div>
        </div>
        
        <div class="employee-info">
          <h3>Informations Employé</h3>
          <p><strong>Nom:</strong> ${data.employee_name}</p>
          <p><strong>Période:</strong> ${data.month}/${data.year}</p>
        </div>
        
        <div class="salary-breakdown">
          <h3>Détail de la Paie</h3>
          <p><strong>Salaire de base:</strong> ${data.base_salary.toFixed(2)} MAD</p>
          <p><strong>Salaire brut:</strong> ${data.gross_salary.toFixed(2)} MAD</p>
          <hr style="margin: 10px 0;">
          <p><strong>Déductions:</strong></p>
          <p>• CNSS: -${data.cnss.toFixed(2)} MAD</p>
          <p>• AMO: -${data.amo.toFixed(2)} MAD</p>
          <p>• IGR: -${data.igr.toFixed(2)} MAD</p>
        </div>
        
        <div class="net-salary">
          <p>NET À PAYER: ${data.net_salary.toFixed(2)} MAD</p>
        </div>
        
        ${data.download_url ? `
        <div style="text-align: center;">
          <a href="${data.download_url}" class="download-btn">
            📄 Télécharger le Bulletin PDF
          </a>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>Ce bulletin de paie a été généré automatiquement par <strong>PaieFacile</strong></p>
          <p>Date d'envoi: ${new Date().toLocaleDateString('fr-MA')}</p>
          <p>Pour toute question, contactez votre service RH.</p>
        </div>
      </div>
    </body>
    </html>
  `;
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
