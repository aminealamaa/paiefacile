import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Settings, 
  CalendarDays,
  LogOut,
  Menu,
  X,
  BarChart3,
  Sparkles
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/fr/login");

  // Check if company exists
  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  
  const company = companies?.[0] || null;

  if (!company) {
    redirect("/fr/settings");
  }

  async function handleSignOut() {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/fr/login");
  }

  const navigation = [
    { name: "Vue d'ensemble", href: "/fr/dashboard", icon: "LayoutDashboard" },
    { name: "Employés", href: "/fr/dashboard/employees", icon: "Users" },
    { name: "Paie", href: "/fr/dashboard/payroll", icon: "Calculator" },
    { name: "Analyses", href: "/fr/dashboard/analytics", icon: "BarChart3" },
    { name: "Congés", href: "/fr/dashboard/leaves", icon: "CalendarDays" },
    { name: "Assistant IA", href: "/fr/dashboard/ai", icon: "Sparkles" },
    { name: "Paramètres", href: "/fr/settings", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="sidebar-toggle" className="btn btn-square btn-ghost">
                <Menu className="h-6 w-6" />
            </label>
              <h1 className="ml-3 text-lg font-semibold text-gray-900">PaieFacile</h1>
            </div>
            <div className="flex items-center space-x-2">
              <form action={handleSignOut}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">PaieFacile</h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {IconComponent}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <form action={handleSignOut} className="flex-1">
                    <Button type="submit" variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
        <div className="fixed inset-0 z-40 peer-checked:block hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <label htmlFor="sidebar-toggle" className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <X className="h-6 w-6 text-white" />
          </label>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
          <h1 className="text-xl font-bold text-gray-900">PaieFacile</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const IconComponent = getIcon(item.icon);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      {IconComponent}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <form action={handleSignOut} className="flex-1">
                    <Button type="submit" variant="outline" size="sm" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function getIcon(iconName: string) {
  switch (iconName) {
    case "LayoutDashboard": return <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "Users": return <Users className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "Calculator": return <Calculator className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "BarChart3": return <BarChart3 className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "CalendarDays": return <CalendarDays className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "Sparkles": return <Sparkles className="mr-3 flex-shrink-0 h-5 w-5" />;
    case "Settings": return <Settings className="mr-3 flex-shrink-0 h-5 w-5" />;
    default: return null;
  }
}

