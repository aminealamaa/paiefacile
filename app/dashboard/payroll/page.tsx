import { redirect } from 'next/navigation';

export default function PayrollPage() {
  // Redirect to the locale-specific payroll page
  redirect('/fr/dashboard/payroll');
}
