import { redirect } from 'next/navigation';

export default function DashboardLayout() {
  // Redirect to the locale-specific dashboard
  redirect('/fr/dashboard');
}
