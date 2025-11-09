import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to the locale-specific dashboard
  redirect('/fr/dashboard');
}
