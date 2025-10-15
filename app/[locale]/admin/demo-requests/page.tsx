import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { DemoRequestsTable } from "@/components/DemoRequestsTable";

export default async function DemoRequestsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect("/login");

  // Check if user is admin (you can implement your own admin logic here)
  // For now, we'll allow any authenticated user to view demo requests
  
  const { data: demoRequests, error } = await supabase
    .from('demo_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching demo requests:', error);
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demandes de Démo</h1>
          <p className="text-gray-600 mt-2">Gérez les demandes de démonstration</p>
        </div>
      </div>

      <DemoRequestsTable demoRequests={demoRequests || []} />
    </div>
  );
}
