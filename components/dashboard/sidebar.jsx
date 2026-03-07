"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useEffect } from "react";

const sidebarLinks = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Carbon Metrics", href: "/dashboard/carbon-metrics", icon: Activity },
  { title: "Risk Analysis", href: "/dashboard/risk-analysis", icon: AlertTriangle },
  { title: "Scenarios", href: "/dashboard/scenario-simulator", icon: Sliders },
  { title: "Compliance", href: "/dashboard/compliance", icon: Shield },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
];

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-14 items-center px-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5" onClick={onNavigate}>
          <div className="h-7 w-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sm font-bold text-sidebar-primary-foreground">I</span>
          </div>
          <span className="text-base font-semibold text-sidebar-foreground">Iora</span>
        </Link>
      </div>

      {/* Nav links */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link key={link.href} href={link.href} onClick={onNavigate}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 h-10 font-normal",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <link.icon className="h-4 w-4 flex-shrink-0" />
                  <span>{link.title}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom settings */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <Link href="/dashboard/settings" onClick={onNavigate}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 h-10 font-normal",
              pathname.startsWith("/dashboard/settings")
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>Settings</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function DashboardSidebar({ open, onOpenChange }) {
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    onOpenChange?.(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarContent pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          {/* Drawer */}
          <aside
            className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-xl animate-in slide-in-from-left duration-200"
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground"
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
