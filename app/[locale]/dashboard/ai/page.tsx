import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AIChatInterface } from "@/components/ai/AIChatInterface";
import { OptimizationDashboard } from "@/components/ai/OptimizationDashboard";
import { ComplianceRiskPanel } from "@/components/ai/ComplianceRiskPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, MessageSquare, TrendingUp, Shield } from "lucide-react";

export default async function AIAdvisorPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/fr/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-green-600" />
          Assistant IA - Optimisation & Conformité
        </h1>
        <p className="text-gray-600 mt-2">
          Optimisez votre gestion de paie avec l&apos;intelligence artificielle
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Assistant
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Conformité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posez vos questions sur la paie marocaine</CardTitle>
              <CardDescription>
                Notre assistant IA est spécialisé dans la législation fiscale et sociale marocaine.
                Il peut répondre à vos questions sur la CNSS, l&apos;AMO, l&apos;IGR, et bien plus encore.
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

