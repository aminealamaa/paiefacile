import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      redirect("/fr/dashboard");
    }
  } catch (error) {
    console.warn('Supabase connection error:', error);
    // Continue to show login form even if Supabase is not configured
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte PaieFacile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/fr/signup" className="underline">
              Inscrivez-vous ici
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
