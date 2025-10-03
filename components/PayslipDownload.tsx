"use client";

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";

// Register a font for better text rendering
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Roboto',
    fontSize: 9
  },
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10
  },
  headerLeft: {
    width: '50%',
    fontSize: 8
  },
  headerCenter: {
    width: '30%',
    textAlign: 'center'
  },
  headerRight: {
    width: '20%',
    textAlign: 'right',
    fontSize: 8
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15
  },
  employeeSection: {
    flexDirection: 'row',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000'
  },
  employeeLeft: {
    width: '50%',
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#000'
  },
  employeeRight: {
    width: '50%',
    padding: 5
  },
  payrollTable: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 3,
    fontSize: 8,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    padding: 3,
    fontSize: 8,
    minHeight: 15
  },
  tableRowBold: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 3,
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9'
  },
  col1: { width: '40%', paddingLeft: 3 },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '15%', textAlign: 'right' },
  col5: { width: '15%', textAlign: 'right' },
  summarySection: {
    flexDirection: 'row',
    marginTop: 10
  },
  summaryLeft: {
    width: '60%'
  },
  summaryRight: {
    width: '40%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 8
  },
  summaryRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 3
  },
  footer: {
    marginTop: 20,
    fontSize: 7,
    textAlign: 'center',
    color: '#666'
  }
});

interface PayslipDocumentProps {
  company: Record<string, unknown>;
  result: Record<string, unknown>;
}

const PayslipDocument = ({ company, result }: PayslipDocumentProps) => {
  // Calculate employer contributions for display
  const grossSalary = Number(result.gross_salary) || 0;
  const cnssEmployer = Math.round((Math.min(grossSalary, 6000) * 0.0796) * 100) / 100; // 7.96%
  const amoEmployer = Math.round((grossSalary * 0.0226) * 100) / 100; // 2.26%
  const taxeFormation = Math.round((grossSalary * 0.016) * 100) / 100; // 1.6%
  
  const currentDate = new Date();
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{company.name as string}</Text>
            <Text>{company.address as string || 'Adresse Entreprise'}</Text>
            <Text>ICE: {company.ice || 'XXXXXXXXXX'}</Text>
            <Text>CNSS: {company.cnss_affiliation_number || 'XXXXXXXXXX'}</Text>
            <Text>Patente: {company.patente || 'XXXXXXXXXX'}</Text>
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>BULLETIN DE PAIE</Text>
            <Text style={styles.subtitle}>
              Période du Paie: {monthNames[(Number(result.month) || 1) - 1]} {result.year}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Date d'édition:</Text>
            <Text>{currentDate.toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeSection}>
          <View style={styles.employeeLeft}>
            <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>SALARIE</Text>
            <Text>Nom & Prénom: {result.employee_name || 'N/A'}</Text>
            <Text>Matricule: {result.employeeId}</Text>
            <Text>CIN: {result.cin_number || 'XXXXXXXXXX'}</Text>
            <Text>CNSS: {result.cnss_number || 'XXXXXXXXXX'}</Text>
            <Text>Fonction: {result.job_title || 'N/A'}</Text>
          </View>
          <View style={styles.employeeRight}>
            <Text>Situation de famille: {result.marital_status === 'married' ? 'Marié(e)' : 'Célibataire'}</Text>
            <Text>Nombre d'enfants: {result.children_count || 0}</Text>
            <Text>Date d'embauche: {result.hire_date ? new Date(result.hire_date as string).toLocaleDateString('fr-FR') : 'XX/XX/XXXX'}</Text>
            <Text>Salaire de base: {result.base_salary} MAD</Text>
            <Text>Mode de paiement: Virement</Text>
          </View>
        </View>

        {/* Payroll Table */}
        <View style={styles.payrollTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>RUBRIQUES</Text>
            <Text style={styles.col2}>NOMBRE</Text>
            <Text style={styles.col3}>TAUX</Text>
            <Text style={styles.col4}>GAIN</Text>
            <Text style={styles.col5}>RETENUE</Text>
          </View>

          {/* Earnings Section */}
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Salaire de Base</Text>
            <Text style={styles.col2}>1</Text>
            <Text style={styles.col3}>-</Text>
            <Text style={styles.col4}>{result.base_salary}</Text>
            <Text style={styles.col5}>-</Text>
          </View>

          {Number(result.bonuses) > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>Primes et Indemnités</Text>
              <Text style={styles.col2}>-</Text>
              <Text style={styles.col3}>-</Text>
              <Text style={styles.col4}>{result.bonuses}</Text>
              <Text style={styles.col5}>-</Text>
            </View>
          )}

          {Number(result.overtimePay) > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>Heures Supplémentaires</Text>
              <Text style={styles.col2}>{result.overtimeHours}</Text>
              <Text style={styles.col3}>125%</Text>
              <Text style={styles.col4}>{result.overtimePay}</Text>
              <Text style={styles.col5}>-</Text>
            </View>
          )}

          <View style={styles.tableRowBold}>
            <Text style={styles.col1}>TOTAL BRUT</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>-</Text>
            <Text style={styles.col4}>{result.gross_salary}</Text>
            <Text style={styles.col5}>-</Text>
          </View>

          {/* Deductions Section */}
          <View style={styles.tableRow}>
            <Text style={styles.col1}>CNSS (Part Salariale)</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>4.48%</Text>
            <Text style={styles.col4}>-</Text>
            <Text style={styles.col5}>{result.cnss}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>AMO (Part Salariale)</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>2.26%</Text>
            <Text style={styles.col4}>-</Text>
            <Text style={styles.col5}>{result.amo}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.col1}>Salaire Net Imposable</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>-</Text>
            <Text style={styles.col4}>{result.net_taxable}</Text>
            <Text style={styles.col5}>-</Text>
          </View>

          {Number(result.family_deductions) > 0 && (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>Abattements Familiaux</Text>
              <Text style={styles.col2}>-</Text>
              <Text style={styles.col3}>-</Text>
              <Text style={styles.col4}>{result.family_deductions}</Text>
              <Text style={styles.col5}>-</Text>
            </View>
          )}

          <View style={styles.tableRow}>
            <Text style={styles.col1}>IGR</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>-</Text>
            <Text style={styles.col4}>-</Text>
            <Text style={styles.col5}>{result.igr}</Text>
          </View>

          <View style={styles.tableRowBold}>
            <Text style={styles.col1}>NET À PAYER</Text>
            <Text style={styles.col2}>-</Text>
            <Text style={styles.col3}>-</Text>
            <Text style={styles.col4}>{result.net_salary}</Text>
            <Text style={styles.col5}>-</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryLeft}>
            <Text style={{ fontSize: 8, fontWeight: 'bold', marginBottom: 5 }}>CHARGES PATRONALES:</Text>
            <View style={styles.summaryRow}>
              <Text>CNSS Patronale (7.96%)</Text>
              <Text>{cnssEmployer.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>AMO Patronale (2.26%)</Text>
              <Text>{amoEmployer.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Taxe Formation Prof. (1.6%)</Text>
              <Text>{taxeFormation.toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryRowBold}>
              <Text>TOTAL CHARGES PATRONALES</Text>
              <Text>{(cnssEmployer + amoEmployer + taxeFormation).toFixed(2)} MAD</Text>
            </View>
          </View>
          
          <View style={styles.summaryRight}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }}>RÉCAPITULATIF</Text>
            <View style={styles.summaryRow}>
              <Text>Salaire Brut</Text>
              <Text>{result.gross_salary} MAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Total Retenues</Text>
              <Text>{(Number(result.cnss) + Number(result.amo) + Number(result.igr)).toFixed(2)} MAD</Text>
            </View>
            <View style={styles.summaryRowBold}>
              <Text>NET À PAYER</Text>
              <Text>{result.net_salary} MAD</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Ce bulletin de paie est généré automatiquement par PaieFacile</Text>
          <Text>Conforme à la législation marocaine du travail</Text>
        </View>
      </Page>
    </Document>
  );
};

export function PayslipDownload({ company, result }: { company: Record<string, unknown>; result: Record<string, unknown> }) {
  return (
    <PDFDownloadLink
      document={<PayslipDocument company={company} result={result} />}
      fileName={`bulletin-paie-${result.month}-${result.year}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <Button disabled={loading}>
          {loading ? 'Génération...' : 'Télécharger Bulletin (PDF)'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}