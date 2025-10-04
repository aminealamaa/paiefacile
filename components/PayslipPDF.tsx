"use client";

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  date: {
    fontSize: 12,
    textAlign: 'right',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyLeft: {
    width: '48%',
  },
  employeeRight: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableHeaderCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    textAlign: 'left',
  },
  tableCellRight: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    fontWeight: 'bold',
  },
  summarySection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  annualCumuls: {
    width: '50%',
    marginRight: 10,
  },
  employerCharges: {
    width: '50%',
    marginLeft: 10,
  },
  summaryTable: {
    borderWidth: 1,
    borderColor: '#000000',
  },
  summaryHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  summaryHeaderCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  summaryCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    textAlign: 'right',
    flex: 1,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

interface PayslipData {
  company: {
    name: string;
    address: string;
    ice: string;
    cnss_affiliation_number: string;
    patente: string;
  };
  employee: {
    name: string;
    cin_number: string;
    cnss_number: string;
    job_title: string;
    marital_status: string;
    children_count: number;
    hire_date: string;
    base_salary: number;
  };
  payroll: {
    base_salary: number;
    gross_salary: number;
    cnss_employee: number;
    amo_employee: number;
    igr: number;
    family_deductions: number;
    net_salary: number;
  };
}

function PayslipDocument({ data }: { data: PayslipData }) {
  const formatCurrency = (amount: number) => amount.toFixed(2);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BULLETIN DE PAIE</Text>
          <Text style={styles.date}>03/13</Text>
        </View>

        {/* Company and Employee Info */}
        <View style={styles.companyInfo}>
          <View style={styles.companyLeft}>
            <Text style={styles.sectionTitle}>EMPLOYEUR</Text>
            <Text>{data.company.name}</Text>
            <Text>{data.company.address}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>RC:</Text>
              <Text style={styles.value}>20 82 - IF 300011220006</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>CNSS:</Text>
              <Text style={styles.value}>{data.company.cnss_affiliation_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Patente:</Text>
              <Text style={styles.value}>{data.company.patente}</Text>
            </View>
          </View>

          <View style={styles.employeeRight}>
            <Text style={styles.sectionTitle}>SALARIE</Text>
            <Text>{data.employee.name}</Text>
            <Text>85 RUE ABOU HASSANI</Text>
            <Text>10000 RABAT</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Situation familiale:</Text>
              <Text style={styles.value}>{data.employee.marital_status}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Nbre d&apos;enfants:</Text>
              <Text style={styles.value}>{data.employee.children_count}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Date d&apos;embauche:</Text>
              <Text style={styles.value}>{formatDate(data.employee.hire_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Emploi:</Text>
              <Text style={styles.value}>{data.employee.job_title}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>CIN:</Text>
              <Text style={styles.value}>{data.employee.cin_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>CNSS:</Text>
              <Text style={styles.value}>{data.employee.cnss_number}</Text>
            </View>
          </View>
        </View>

        {/* Payroll Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: '25%' }]}>RUBRIQUES</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>NOMBRE</Text>
            <Text style={[styles.tableHeaderCell, { width: '15%' }]}>TAUX</Text>
            <Text style={[styles.tableHeaderCell, { width: '22.5%' }]}>GAIN</Text>
            <Text style={[styles.tableHeaderCell, { width: '22.5%' }]}>RETENUE</Text>
          </View>

          {/* Earnings Section */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>Salaire de base</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>1</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.base_salary)}</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>Prime d&apos;ancienneté</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>200.00</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>Indemnité kilométrique</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>300.00</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>Heures supplémentaires</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>200.00</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
          </View>

          {/* Total Gross */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, { width: '25%' }]}>TOTAL BRUT</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
          </View>

          {/* Deductions Section */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>CNSS</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>4.48%</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.cnss_employee)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>AMO</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>2.00%</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.amo_employee)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>IGR</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.igr)}</Text>
          </View>

          {data.payroll.family_deductions > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '25%' }]}>Abattements familiaux</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
              <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
              <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.family_deductions)}</Text>
            </View>
          )}

          {/* Total Deductions */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, { width: '25%' }]}>TOTAL RETENUES</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>
              {formatCurrency(data.payroll.cnss_employee + data.payroll.amo_employee + data.payroll.igr)}
            </Text>
          </View>

          {/* Net Pay */}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCell, { width: '25%' }]}>NET A PAYER</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>-</Text>
            <Text style={[styles.tableCellRight, { width: '22.5%' }]}>{formatCurrency(data.payroll.net_salary)}</Text>
          </View>
        </View>

        {/* Summary Sections */}
        <View style={styles.summarySection}>
          <View style={styles.annualCumuls}>
            <Text style={styles.sectionTitle}>CUMULS ANNUELS</Text>
            <View style={styles.summaryTable}>
              <View style={styles.summaryHeader}>
                <Text style={[styles.summaryHeaderCell, { width: '25%' }]}>BRUT</Text>
                <Text style={[styles.summaryHeaderCell, { width: '25%' }]}>IMPOSABLE</Text>
                <Text style={[styles.summaryHeaderCell, { width: '25%' }]}>NET</Text>
                <Text style={[styles.summaryHeaderCell, { width: '25%' }]}>IGR</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryCell, { width: '25%' }]}>Mois en cours</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.net_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.igr)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryCell, { width: '25%' }]}>Cumul annuel</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.net_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '25%' }]}>{formatCurrency(data.payroll.igr)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.employerCharges}>
            <Text style={styles.sectionTitle}>CHARGES PATRONALES</Text>
            <View style={styles.summaryTable}>
              <View style={styles.summaryHeader}>
                <Text style={[styles.summaryHeaderCell, { width: '20%' }]}>TAUX</Text>
                <Text style={[styles.summaryHeaderCell, { width: '30%' }]}>BASE</Text>
                <Text style={[styles.summaryHeaderCell, { width: '50%' }]}>MONTANT</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryCell, { width: '20%' }]}>CNSS</Text>
                <Text style={[styles.summaryCell, { width: '30%' }]}>8.98%</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary * 0.0898)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryCell, { width: '20%' }]}>AMO</Text>
                <Text style={[styles.summaryCell, { width: '30%' }]}>2.55%</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary * 0.0255)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryCell, { width: '20%' }]}>Formation professionnelle</Text>
                <Text style={[styles.summaryCell, { width: '30%' }]}>1.60%</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary)}</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>{formatCurrency(data.payroll.gross_salary * 0.016)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={[styles.summaryCell, { width: '20%' }]}>TOTAL CHARGES PATRONALES</Text>
                <Text style={[styles.summaryCell, { width: '30%' }]}>-</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>-</Text>
                <Text style={[styles.summaryCell, { width: '50%' }]}>
                  {formatCurrency(data.payroll.gross_salary * (0.0898 + 0.0255 + 0.016))}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Arrêté le présent bulletin de paie à la somme de: {data.payroll.net_salary.toFixed(2)} dirhams.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export function PayslipPDF({ company, result }: { company: Record<string, unknown>; result: Record<string, unknown> }) {
  // Transform the data to match the expected format
  const payslipData: PayslipData = {
    company: {
      name: company?.name as string || 'N/A',
      address: company?.address as string || 'N/A',
      ice: company?.ice as string || 'N/A',
      cnss_affiliation_number: company?.cnss_affiliation_number as string || 'N/A',
      patente: company?.patente as string || 'N/A',
    },
    employee: {
      name: result?.employee_name as string || 'N/A',
      cin_number: result?.cin_number as string || 'N/A',
      cnss_number: result?.cnss_number as string || 'N/A',
      job_title: result?.job_title as string || 'N/A',
      marital_status: result?.marital_status as string || 'Célibataire',
      children_count: result?.children_count as number || 0,
      hire_date: result?.hire_date as string || 'N/A',
      base_salary: result?.base_salary as number || 0,
    },
    payroll: {
      base_salary: result?.base_salary as number || 0,
      gross_salary: result?.gross_salary as number || 0,
      cnss_employee: result?.cnss as number || 0,
      amo_employee: result?.amo as number || 0,
      igr: result?.igr as number || 0,
      family_deductions: result?.family_deductions as number || 0,
      net_salary: result?.net_salary as number || 0,
    },
  };

  return (
    <PDFDownloadLink
      document={<PayslipDocument data={payslipData} />}
      fileName={`bulletin-paie-${result?.employee_name || 'employee'}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <Button disabled={loading} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          {loading ? 'Génération...' : 'Télécharger le Bulletin de Paie (PDF)'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
