import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { OptimizationDashboard } from "@/components/ai/OptimizationDashboard";
import { ComplianceRiskPanel } from "@/components/ai/ComplianceRiskPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, MessageSquare, TrendingUp, Shield } from "lucide-react";
import { t, type Locale } from "@/lib/translations";

export default async function AIAdvisorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locale = (localeParam || 'fr') as Locale;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-green-600" />
          {t(locale, "ai.title")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t(locale, "ai.subtitle")}
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t(locale, "ai.chat.title")}
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t(locale, "ai.optimization.title")}
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t(locale, "ai.compliance.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t(locale, "ai.chat.title")}</CardTitle>
              <CardDescription>
                {t(locale, "ai.chat.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <AIChatInterface />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <OptimizationDashboard />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceRiskPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

