import { redirect } from 'next/navigation';

export default function LeavesPage() {
  // Redirect to the locale-specific leaves page
  redirect('/fr/dashboard/leaves');
}
