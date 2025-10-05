// Test file for Moroccan payroll calculations - 2025 Rules
// Test with the provided example: 12,000 MAD base salary

const { calculateMoroccanPayroll } = require('./lib/moroccan-taxes.ts');

console.log('🇲🇦 Testing Moroccan Payroll Calculation - 2025 Rules');
console.log('==================================================');

// Test case: 12,000 MAD base salary
const result = calculateMoroccanPayroll(
  12000,  // baseSalary
  0,      // bonuses
  0,      // overtimeHours
  1.25,   // overtimeRate
  'single', // maritalStatus
  0       // childrenCount
);

console.log('\n📊 Calculation Results:');
console.log('------------------------');
console.log(`Salaire de base: ${result.baseSalary.toFixed(2)} MAD`);
console.log(`Primes: ${result.bonuses.toFixed(2)} MAD`);
console.log(`Heures supplémentaires: ${result.overtimePay.toFixed(2)} MAD`);
console.log(`Salaire brut: ${result.grossSalary.toFixed(2)} MAD`);
console.log(`CNSS (4.48% sur plafond 6000): -${result.cnssEmployee.toFixed(2)} MAD`);
console.log(`AMO (2.26%): -${result.amoEmployee.toFixed(2)} MAD`);
console.log(`Net imposable: ${result.netTaxable.toFixed(2)} MAD`);
console.log(`IGR: -${result.igr.toFixed(2)} MAD`);
console.log(`Salaire net: ${result.netSalary.toFixed(2)} MAD`);

console.log('\n🔍 Detailed Breakdown:');
console.log('----------------------');
console.log(`CNSS Base (capped at 6000): ${Math.min(12000, 6000)} MAD`);
console.log(`CNSS Employee (4.48%): ${(Math.min(12000, 6000) * 0.0448).toFixed(2)} MAD`);
console.log(`AMO Employee (2.26%): ${(12000 * 0.0226).toFixed(2)} MAD`);

// Calculate annual taxable for IGR
const annualTaxable = result.netTaxable * 12;
console.log(`Annual taxable income: ${annualTaxable.toFixed(2)} MAD`);

// IGR calculation breakdown
let annualTax = 0;
const brackets = [
  { min: 0, max: 40000, rate: 0 },
  { min: 40000, max: 60000, rate: 0.10 },
  { min: 60000, max: 80000, rate: 0.20 },
  { min: 80000, max: 100000, rate: 0.30 },
  { min: 100000, max: 180000, rate: 0.34 },
  { min: 180000, max: Infinity, rate: 0.37 }
];

for (const bracket of brackets) {
  if (annualTaxable > bracket.min) {
    const taxableInThisBracket = Math.min(annualTaxable - bracket.min, bracket.max - bracket.min);
    const taxInThisBracket = taxableInThisBracket * bracket.rate;
    annualTax += taxInThisBracket;
    console.log(`Bracket ${bracket.min}-${bracket.max}: ${taxableInThisBracket.toFixed(2)} × ${(bracket.rate * 100)}% = ${taxInThisBracket.toFixed(2)} MAD`);
  }
}

console.log(`Annual IGR: ${annualTax.toFixed(2)} MAD`);
console.log(`Monthly IGR: ${(annualTax / 12).toFixed(2)} MAD`);

console.log('\n✅ Expected vs Actual:');
console.log('----------------------');
console.log('Expected CNSS: -268.80 MAD');
console.log(`Actual CNSS: -${result.cnssEmployee.toFixed(2)} MAD`);
console.log('Expected AMO: -271.20 MAD');
console.log(`Actual AMO: -${result.amoEmployee.toFixed(2)} MAD`);
console.log('Expected Net imposable: 11,460.00 MAD');
console.log(`Actual Net imposable: ${result.netTaxable.toFixed(2)} MAD`);
console.log('Expected IGR: -2,463.07 MAD');
console.log(`Actual IGR: -${result.igr.toFixed(2)} MAD`);
console.log('Expected Net salary: 8,996.93 MAD');
console.log(`Actual Net salary: ${result.netSalary.toFixed(2)} MAD`);
