import { redirect } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CompanySchema = z.object({
  name: z.string().min(2, "Name is required"),
  rc_number: z.string().optional().default(""),
  if_number: z.string().optional().default(""),
  cnss_affiliation_number: z.string().optional().default(""),
  ice: z.string().optional().default(""),
  patente: z.string().optional().default(""),
  address: z.string().optional().default("")
});

async function updateCompanyAction(formData: FormData) {
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
      return { error: parsed.error.flatten().formErrors.join("\n") };
    }

    console.log("Parsed data:", parsed.data);

    const payload = { 
      ...parsed.data,
      user_id: user.id 
    } as Record<string, unknown>;
    console.log("Payload to insert:", payload);
    
    const { data, error } = await supabase
      .from("companies")
      .insert(payload)
      .select();

    if (error) {
      console.log("Supabase error:", error);
      return { error: error.message };
    }

    console.log("Successfully saved company:", data);
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (e: unknown) {
    console.error("updateCompanyAction failed", e);
    return { error: (e as Error)?.message ?? "Unexpected error" };
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
    <SettingsContent company={company} />
  );
}

function SettingsContent({ company }: { company: Record<string, unknown> | null }) {
  const t = useTranslations('settings');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      <CompanyForm company={company} />
    </div>
  );
}

function CompanyForm({ company }: { company: Record<string, unknown> | null }) {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');

  return (
    <form action={updateCompanyAction} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t('companyName')} *
          </label>
          <Input 
            id="name" 
            name="name" 
            defaultValue={company?.name as string ?? ""} 
            required 
          />
        </div>

        <div>
          <label htmlFor="rc_number" className="block text-sm font-medium mb-1">
            RC Number
          </label>
          <Input 
            id="rc_number" 
            name="rc_number" 
            defaultValue={company?.rc_number as string ?? ""} 
          />
        </div>

        <div>
          <label htmlFor="if_number" className="block text-sm font-medium mb-1">
            IF Number
          </label>
          <Input 
            id="if_number" 
            name="if_number" 
            defaultValue={company?.if_number as string ?? ""} 
          />
        </div>

        <div>
          <label htmlFor="cnss_affiliation_number" className="block text-sm font-medium mb-1">
            CNSS Affiliation Number
          </label>
          <Input 
            id="cnss_affiliation_number" 
            name="cnss_affiliation_number" 
            defaultValue={company?.cnss_affiliation_number as string ?? ""} 
          />
        </div>

        <div>
          <label htmlFor="ice" className="block text-sm font-medium mb-1">
            ICE (Identifiant Commun de l'Entreprise)
          </label>
          <Input 
            id="ice" 
            name="ice" 
            defaultValue={company?.ice as string ?? ""} 
            placeholder="000000000000000"
          />
        </div>

        <div>
          <label htmlFor="patente" className="block text-sm font-medium mb-1">
            Patente
          </label>
          <Input 
            id="patente" 
            name="patente" 
            defaultValue={company?.patente as string ?? ""} 
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Adresse de l'entreprise
          </label>
          <Input 
            id="address" 
            name="address" 
            defaultValue={company?.address as string ?? ""} 
            placeholder="Adresse complète de l'entreprise"
          />
        </div>

        <Button type="submit">{t('saveChanges')}</Button>
      </div>
    </form>
  );
}
