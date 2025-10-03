import { redirect } from 'next/navigation';

export default function SettingsPage() {
  // Redirect to the locale-specific settings page
  redirect('/fr/dashboard/settings');
}
