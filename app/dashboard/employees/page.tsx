import { redirect } from 'next/navigation';

export default function EmployeesPage() {
  // Redirect to the locale-specific employees page
  redirect('/fr/dashboard/employees');
}
