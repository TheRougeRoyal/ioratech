"use client";

import { useAuth } from "@/lib/auth-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function DashboardLayout({ children }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-r-transparent" />
      </div>
    );
  }
  if (!user) return null;

  const isActive = (href) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));
  const title = NAV.find((n) => isActive(n.href))?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Top bar (mobile + desktop title strip) */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">Iora</Link>
          <span className="text-neutral-300 dark:text-neutral-700">/</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{title}</span>
        </div>
        <button
          onClick={() => signOut().then(() => router.push("/login"))}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
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
                  "block px-3 py-1.5 text-sm rounded",
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
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-0.5">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-3 py-1.5 text-sm rounded",
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
  );
}
