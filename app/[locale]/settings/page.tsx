import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CompanySchema = z.object({
  name: z.string().min(2, "Name is required"),
  rc_number: z.string().optional().default(""),
  if_number: z.string().optional().default(""),
  cnss_affiliation_number: z.string().optional().default(""),
  ice: z.string().optional().default(""),
  patente: z.string().optional().default(""),
  address: z.string().optional().default("")
});

async function updateCompanyAction(formData: FormData): Promise<void> {
  "use server";
  try {
    console.log("updateCompanyAction called");
    console.log("FormData:", formData);
    
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No user found, redirecting to login");
      redirect("/login");
    }
    console.log("User found:", user.id);

    const parsed = CompanySchema.safeParse({
      name: formData.get("name")?.toString() ?? "",
      rc_number: formData.get("rc_number")?.toString() ?? "",
      if_number: formData.get("if_number")?.toString() ?? "",
      cnss_affiliation_number: formData.get("cnss_affiliation_number")?.toString() ?? "",
      ice: formData.get("ice")?.toString() ?? "",
      patente: formData.get("patente")?.toString() ?? "",
      address: formData.get("address")?.toString() ?? "",
    });
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.flatten().formErrors);
      throw new Error(parsed.error.flatten().formErrors.join("\n"));
    }

    console.log("Parsed data:", parsed.data);

    const payload = { 
      ...parsed.data,
      user_id: user.id 
    } as Record<string, unknown>;
    console.log("Payload to insert:", payload);
    
    // First, check if company already exists
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let data, error;
    if (existingCompany) {
      // Update existing company
      const result = await supabase
        .from("companies")
        .update(payload)
        .eq("user_id", user.id)
        .select();
      data = result.data;
      error = result.error;
    } else {
      // Insert new company
      const result = await supabase
        .from("companies")
        .insert(payload)
        .select();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.log("Supabase error:", error);
      throw new Error(error.message);
    }

    console.log("Successfully saved company:", data);
    revalidatePath("/settings");
    redirect("/dashboard");
  } catch (e: unknown) {
    console.error("updateCompanyAction failed", e);
    throw e;
  }
}

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("name, rc_number, if_number, cnss_affiliation_number, ice, patente, address")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au tableau de bord
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PaieFacile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg">
              <span className="text-white font-bold text-lg">PF</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuration de l&apos;entreprise</h1>
              <p className="text-gray-600 mt-1">Configurez les informations de votre entreprise pour commencer à utiliser PaieFacile</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PF</span>
                  </div>
                  <span>Informations de l&apos;entreprise</span>
                </CardTitle>
                <CardDescription>
                  Remplissez les informations de base de votre entreprise. Seul le nom est obligatoire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyForm company={company} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pourquoi ces informations ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Conformité légale</h4>
                    <p className="text-sm text-gray-600">Respect des réglementations marocaines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Calculs précis</h4>
                    <p className="text-sm text-gray-600">CNSS, AMO et IGR selon les règles marocaines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Documents officiels</h4>
                    <p className="text-sm text-gray-600">Génération automatique des bulletins de paie</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PF</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sécurisé et confidentiel</h4>
                    <p className="text-sm text-gray-700 mt-1">Vos données sont protégées par un chiffrement de niveau bancaire</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyForm({ company }: { company: Record<string, unknown> | null }) {
  return (
    <form action={updateCompanyAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nom de l&apos;entreprise *
          </label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={company?.name as string ?? ""} 
            required 
            className="h-12 text-lg"
            placeholder="Ex: Mon Entreprise SARL"
          />
        </div>

        <div>
          <label htmlFor="rc_number" className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro RC
          </label>
          <Input 
            id="rc_number" 
            name="rc_number" 
            defaultValue={company?.rc_number as string ?? ""} 
            placeholder="Ex: RC123456"
            className="h-11"
          />
        </div>

        <div>
          <label htmlFor="if_number" className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro IF
          </label>
          <Input 
            id="if_number" 
            name="if_number" 
            defaultValue={company?.if_number as string ?? ""} 
            placeholder="Ex: IF123456789"
            className="h-11"
          />
        </div>

        <div>
          <label htmlFor="cnss_affiliation_number" className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro d&apos;affiliation CNSS
          </label>
          <Input 
            id="cnss_affiliation_number" 
            name="cnss_affiliation_number" 
            defaultValue={company?.cnss_affiliation_number as string ?? ""} 
            placeholder="Ex: CNSS123456"
            className="h-11"
          />
        </div>

        <div>
          <label htmlFor="ice" className="block text-sm font-semibold text-gray-700 mb-2">
            ICE (Identifiant Commun de l&apos;Entreprise)
          </label>
          <Input 
            id="ice" 
            name="ice" 
            defaultValue={company?.ice as string ?? ""} 
            placeholder="000000000000000"
            className="h-11"
          />
        </div>

        <div>
          <label htmlFor="patente" className="block text-sm font-semibold text-gray-700 mb-2">
            Patente
          </label>
          <Input 
            id="patente" 
            name="patente" 
            defaultValue={company?.patente as string ?? ""} 
            placeholder="Ex: PAT123456"
            className="h-11"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Adresse de l&apos;entreprise
          </label>
          <Input 
            id="address" 
            name="address" 
            defaultValue={company?.address as string ?? ""} 
            placeholder="Adresse complète de l&apos;entreprise"
            className="h-11"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          * Champs obligatoires
        </div>
        <Button type="submit" size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
            <span className="text-black text-xs font-bold">PF</span>
          </div>
          Enregistrer et continuer
        </Button>
      </div>
    </form>
  );
}
