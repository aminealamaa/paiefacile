"use client";

import {Link} from "@/lib/navigation";
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  CalendarDays,
  Settings 
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

interface MobileNavigationProps {
  navigation: NavigationItem[];
}

export function MobileNavigation({ navigation }: MobileNavigationProps) {
  const t = useTranslations();
  
  const handleLinkClick = () => {
    const checkbox = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

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
    <div className="flex-1 px-2 py-4 space-y-1">
      {navigation.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleLinkClick}
          >
            {getIcon(item.icon)}
            {t(item.name)}
          </Link>
        );
      })}
    </div>
  );
}
