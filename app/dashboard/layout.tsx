"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/carbon-metrics", label: "Carbon Metrics" },
  { href: "/dashboard/risk-analysis", label: "Risk Analysis" },
  { href: "/dashboard/scenario-simulator", label: "Scenarios" },
  { href: "/dashboard/compliance", label: "Compliance" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isDemo, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-r-transparent" />
      </div>
    );
  }

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const title = NAV.find((n) => isActive(n.href))?.label ?? "Dashboard";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
        {/* Top bar (mobile + desktop title strip) */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 lg:px-6 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
          {isDemo && (
            <span
              className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5"
              title="You're exploring Iora with sample data. Sign in to load your real account."
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Demo preview
            </span>
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="lg:hidden p-1 h-8 w-8"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="text-sm font-semibold tracking-tight">Iora</Link>
            <span className="text-neutral-300 dark:text-neutral-700">/</span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{title}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
            onClick={() => signOut().then(() => router.push("/login"))}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-3rem)]">
            <nav className="p-3 space-y-0.5">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "block px-3 py-1.5 text-sm rounded transition-colors",
                    isActive(n.href)
                      ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 font-medium"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Mobile drawer */}
          {open && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
              <aside className="absolute inset-y-0 left-0 w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Iora</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="space-y-0.5">
                  {NAV.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                      "block px-3 py-1.5 text-sm rounded transition-colors",
                      isActive(n.href)
                        ? "bg-neutral-100 dark:bg-neutral-900 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    )}
                    >
                      {n.label}
                    </Link>
                  ))}
                </nav>
              </aside>
            </div>
          )}

          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1200px]">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
