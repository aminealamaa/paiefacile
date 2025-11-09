import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the locale-specific home page
  redirect('/fr');
}
