import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {Link} from "@/lib/navigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  Settings, 
  CalendarDays,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  async function handleSignOut() {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  const navigation = [
    { name: "navigation.overview", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "navigation.employees", href: "/dashboard/employees", icon: "Users" },
    { name: "navigation.payroll", href: "/dashboard/payroll", icon: "Calculator" },
    { name: "navigation.leaves", href: "/dashboard/leaves", icon: "CalendarDays" },
    { name: "navigation.settings", href: "/dashboard/settings", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        <input type="checkbox" id="sidebar-toggle" className="hidden" />
        <label htmlFor="sidebar-toggle" className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 opacity-0 pointer-events-none transition-opacity duration-300 peer-checked:opacity-100 peer-checked:pointer-events-auto"></label>
        
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-300 peer-checked:translate-x-0">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">PaieFacile</h1>
            <label htmlFor="sidebar-toggle">
              <X className="h-6 w-6 text-gray-400 cursor-pointer" />
            </label>
          </div>
          <MobileNavigation navigation={navigation} />
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
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case "LayoutDashboard": return <LayoutDashboard className="mr-3 flex-shrink-0 h-5 w-5" />;
                    case "Users": return <Users className="mr-3 flex-shrink-0 h-5 w-5" />;
                    case "Calculator": return <Calculator className="mr-3 flex-shrink-0 h-5 w-5" />;
                    case "CalendarDays": return <CalendarDays className="mr-3 flex-shrink-0 h-5 w-5" />;
                    case "Settings": return <Settings className="mr-3 flex-shrink-0 h-5 w-5" />;
                    default: return null;
                  }
                };
                return (
                  <NavigationLink
                    key={item.name}
                    href={item.href}
                    icon={getIcon(item.icon)}
                    translationKey={item.name}
                  />
                );
              })}
            </nav>
            
            {/* Language Switcher and Logout */}
            <div className="px-2 space-y-2 border-t border-gray-200 pt-4">
              <div className="px-2">
                <LanguageSwitcher />
              </div>
              <form action={handleSignOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
                  <LogoutText />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <label htmlFor="sidebar-toggle">
            <Menu className="h-6 w-6 text-gray-400 cursor-pointer" />
          </label>
          <h1 className="text-xl font-bold text-gray-900">PaieFacile</h1>
          <LanguageSwitcher />
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

function NavigationLink({ 
  href, 
  icon, 
  translationKey 
}: { 
  href: string; 
  icon: React.ReactNode; 
  translationKey: string;
}) {
  const t = useTranslations();
  
  return (
    <Link
      href={href}
      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      {icon}
      {t(translationKey)}
    </Link>
  );
}

function LogoutText() {
  const t = useTranslations('navigation');
  return <span>{t('logout')}</span>;
}
