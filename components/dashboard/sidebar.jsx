"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Sliders,
  FileText,
  Shield,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Carbon Metrics", href: "/dashboard/carbon-metrics", icon: Activity },
  { title: "Risk Analysis", href: "/dashboard/risk-analysis", icon: AlertTriangle },
  { title: "Scenarios", href: "/dashboard/scenario-simulator", icon: Sliders },
  { title: "Compliance", href: "/dashboard/compliance", icon: Shield },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
];

function NavItem({ item, pathname, onClick }) {
  const isActive =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link href={item.href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 h-9 text-sm font-normal",
          isActive
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.title}
      </Button>
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-12 items-center px-4 border-b">
        <Link href="/" className="flex items-center px-4" onClick={onNavigate}>
          <Image
            src="/logo.png"
            alt="Ioratech Logo"
            width={120}
            height={28}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={onNavigate}
            />
          ))}
        </nav>
      </ScrollArea>

      <div className="px-2 py-2 border-t">
        <NavItem
          item={{ title: "Settings", href: "/dashboard/settings", icon: Settings }}
          pathname={pathname}
          onClick={onNavigate}
        />
      </div>
    </div>
  );
}

export function DashboardSidebar({ open, onOpenChange }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-64 flex-col border-r bg-card">
        <SidebarContent pathname={pathname} onNavigate={() => {}} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card border-r shadow-lg">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => onOpenChange(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
