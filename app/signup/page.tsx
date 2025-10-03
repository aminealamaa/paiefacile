import { redirect } from 'next/navigation';

export default function SignupPage() {
  // Redirect to the locale-specific signup page
  redirect('/fr/signup');
}
