'use client';

import { formatMAD } from '@/lib/moroccan-taxes';

interface MoroccanCurrencyProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
}

export function MoroccanCurrency({ 
  amount, 
  className = "", 
  showSymbol = true 
}: MoroccanCurrencyProps) {
  const formatted = formatMAD(amount);
  
  return (
    <span className={className}>
      {showSymbol ? formatted : `${amount.toFixed(2)} MAD`}
    </span>
  );
}

// Component for displaying salary breakdown
interface SalaryBreakdownProps {
  baseSalary: number;
  overtime: number;
  bonuses: number;
  grossSalary: number;
  cnssEmployee: number;
  amoEmployee: number;
  netTaxable: number;
  igr: number;
  netSalary: number;
}

export function SalaryBreakdown({
  baseSalary,
  overtime,
  bonuses,
  grossSalary,
  cnssEmployee,
  amoEmployee,
  netTaxable,
  igr,
  netSalary
}: SalaryBreakdownProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Salaire de base:</span>
        <MoroccanCurrency amount={baseSalary} />
      </div>
      
      {overtime > 0 && (
        <div className="flex justify-between">
          <span>Heures supplémentaires:</span>
          <MoroccanCurrency amount={overtime} />
        </div>
      )}
      
      {bonuses > 0 && (
        <div className="flex justify-between">
          <span>Primes:</span>
          <MoroccanCurrency amount={bonuses} />
        </div>
      )}
      
      <div className="flex justify-between font-semibold border-t pt-2">
        <span>Salaire brut:</span>
        <MoroccanCurrency amount={grossSalary} />
      </div>
      
      <div className="flex justify-between text-red-600">
        <span>CNSS (4.48%):</span>
        <span>-<MoroccanCurrency amount={cnssEmployee} showSymbol={false} /></span>
      </div>
      
      <div className="flex justify-between text-red-600">
        <span>AMO (2.26%):</span>
        <span>-<MoroccanCurrency amount={amoEmployee} showSymbol={false} /></span>
      </div>
      
      <div className="flex justify-between font-medium border-t pt-2">
        <span>Salaire net imposable:</span>
        <MoroccanCurrency amount={netTaxable} />
      </div>
      
      <div className="flex justify-between text-red-600">
        <span>IGR:</span>
        <span>-<MoroccanCurrency amount={igr} showSymbol={false} /></span>
      </div>
      
      <div className="flex justify-between font-bold text-green-600 border-t-2 border-green-600 pt-2">
        <span>Salaire net:</span>
        <MoroccanCurrency amount={netSalary} />
      </div>
    </div>
  );
}
