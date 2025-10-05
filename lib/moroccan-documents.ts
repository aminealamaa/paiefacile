// Français: Modèles de documents spécifiques au Maroc
// Moroccan-specific document templates

export interface PayslipData {
  employee: {
    name: string;
    cin: string;
    cnss: string;
    position: string;
  };
  company: {
    name: string;
    ice: string;
    patente: string;
    cnss: string;
    address: string;
  };
  period: {
    month: number;
    year: number;
  };
  salary: {
    base: number;
    overtime: number;
    bonuses: number;
    gross: number;
    cnssEmployee: number;
    amoEmployee: number;
    netTaxable: number;
    igr: number;
    net: number;
  };
}

/**
 * Generate Moroccan payslip header
 * Français: Générer l'en-tête du bulletin de paie marocain
 */
export function generatePayslipHeader(data: PayslipData): string {
  return `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0;">BULLETIN DE PAIE</h1>
      <h2 style="color: #374151; font-size: 18px; margin: 5px 0;">${data.company.name}</h2>
      <p style="margin: 5px 0; color: #6b7280;">
        ICE: ${data.company.ice} | Patente: ${data.company.patente}<br>
        CNSS: ${data.company.cnss}<br>
        ${data.company.address}
      </p>
    </div>
  `;
}

/**
 * Generate employee information section
 * Français: Générer la section d'informations employé
 */
export function generateEmployeeInfo(data: PayslipData): string {
  return `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">
        INFORMATIONS EMPLOYÉ
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; background-color: #f9fafb; font-weight: bold;">Nom complet:</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${data.employee.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; background-color: #f9fafb; font-weight: bold;">CIN:</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${data.employee.cin}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; background-color: #f9fafb; font-weight: bold;">CNSS:</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${data.employee.cnss}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; background-color: #f9fafb; font-weight: bold;">Poste:</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${data.employee.position}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; background-color: #f9fafb; font-weight: bold;">Période:</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${data.period.month}/${data.period.year}</td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Generate salary breakdown section
 * Français: Générer la section de détail du salaire
 */
export function generateSalaryBreakdown(data: PayslipData): string {
  return `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">
        DÉTAIL DU SALAIRE
      </h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #1e40af; color: white;">
            <th style="padding: 10px; border: 1px solid #1e40af; text-align: left;">Description</th>
            <th style="padding: 10px; border: 1px solid #1e40af; text-align: right;">Montant (MAD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">Salaire de base</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${data.salary.base.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">Heures supplémentaires</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${data.salary.overtime.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">Primes</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${data.salary.bonuses.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #f3f4f6; font-weight: bold;">
            <td style="padding: 8px; border: 1px solid #d1d5db;">SALAIRE BRUT</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${data.salary.gross.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">CNSS (4.48%)</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">-${data.salary.cnssEmployee.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">AMO (2.26%)</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">-${data.salary.amoEmployee.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 8px; border: 1px solid #d1d5db;">SALAIRE NET IMPOSABLE</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">${data.salary.netTaxable.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #d1d5db;">IGR</td>
            <td style="padding: 8px; border: 1px solid #d1d5db; text-align: right;">-${data.salary.igr.toFixed(2)}</td>
          </tr>
          <tr style="background-color: #10b981; color: white; font-weight: bold;">
            <td style="padding: 8px; border: 1px solid #10b981;">SALAIRE NET</td>
            <td style="padding: 8px; border: 1px solid #10b981; text-align: right;">${data.salary.net.toFixed(2)} MAD</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate complete Moroccan payslip
 * Français: Générer le bulletin de paie marocain complet
 */
export function generateMoroccanPayslip(data: PayslipData): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bulletin de Paie - ${data.employee.name}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          color: #374151;
          direction: rtl;
        }
        .payslip-container {
          max-width: 800px;
          margin: 0 auto;
          border: 2px solid #1e40af;
          padding: 20px;
          background-color: white;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #d1d5db;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="payslip-container">
        ${generatePayslipHeader(data)}
        ${generateEmployeeInfo(data)}
        ${generateSalaryBreakdown(data)}
        <div class="footer">
          <p>Ce bulletin de paie a été généré automatiquement par PaieFacile</p>
          <p>Date d'émission: ${new Date().toLocaleDateString('fr-MA')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate Moroccan work certificate
 * Français: Générer l'attestation de travail marocaine
 */
export function generateWorkCertificate(employee: Record<string, unknown>, company: Record<string, unknown>): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>Attestation de Travail</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; direction: rtl; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { line-height: 1.8; margin-bottom: 30px; }
        .signature { margin-top: 50px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ATTESTATION DE TRAVAIL</h1>
        <h2>${company.name}</h2>
        <p>ICE: ${company.ice} | CNSS: ${company.cnss}</p>
      </div>
      
      <div class="content">
        <p>نشهد نحن ${company.name}، أن السيد/ة <strong>${employee.name}</strong> 
        يحمل/تحمل بطاقة التعريف الوطنية رقم <strong>${employee.cin}</strong>، 
        يعمل/تعمل لدينا في منصب <strong>${employee.position}</strong> منذ 
        <strong>${employee.hire_date}</strong>.</p>
        
        <p>وتؤكد الشركة أن المذكور/ة أعلاه موظف/ة لديها وأن جميع المعلومات المذكورة صحيحة.</p>
      </div>
      
      <div class="signature">
        <p>في ${new Date().toLocaleDateString('ar-MA')}</p>
        <p>مدير الموارد البشرية</p>
        <p>${company.name}</p>
      </div>
    </body>
    </html>
  `;
}
