import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Redirect to the locale-specific login page
  redirect('/fr/login');
}
