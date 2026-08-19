"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Leaf,
  Sun,
  Moon,
  Play,
  Lock,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Database,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-9 w-9 inline-flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors relative"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
    </button>
  );
}

const FEATURES = [
  {
    icon: BarChart3,
    title: "Emissions tracking",
    body: "Scope 1, 2, 3 measurements with GHG Protocol calculations and trend analysis.",
  },
  {
    icon: AlertTriangle,
    title: "Climate risk modeling",
    body: "Physical and transition risk scenarios across your facilities and supply chain.",
  },
  {
    icon: ShieldCheck,
    title: "Assurance-ready",
    body: "Versioned ledgers, immutable evidence, and audit trails for CSRD, SEC, CDP.",
  },
  {
    icon: FileText,
    title: "One-click reports",
    body: "Generate disclosure PDFs from the same numbers your team uses day-to-day.",
  },
  {
    icon: Database,
    title: "Your data, your control",
    body: "Self-host or run in our cloud. Export raw records anytime, no lock-in.",
  },
  {
    icon: Sparkles,
    title: "AI climate analyst",
    body: "Ask questions in plain English. Get cited answers grounded in your data.",
  },
];

const STEPS = [
  { n: "01", title: "Connect", body: "Plug in utility, ERP, and travel APIs or upload CSVs." },
  { n: "02", title: "Measure", body: "Activity data becomes emissions with methodology baked in." },
  { n: "03", title: "Decide", body: "See hotspots, model scenarios, prioritize reductions." },
  { n: "04", title: "Disclose", body: "Export filings or share read-only links with auditors." },
];

export default function HomePage() {
  const { startDemo } = useAuth();
  const router = useRouter();

  const enterDemo = () => {
    startDemo();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">IORA</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
                Climate Intelligence
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <Link href="/product" className="hover:text-foreground transition-colors">Product</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 text-xs font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center h-9 px-3 sm:px-4 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Public preview · Built on GHG Protocol
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Climate intelligence,{" "}
              <span className="text-primary">ready in minutes.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              IORA turns scattered activity data into a defensible emissions
              ledger, runs risk scenarios on your portfolio, and ships
              disclosure-ready reports. Try the live demo, or sign in to load
              your account.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <button
                onClick={enterDemo}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors group"
              >
                <Play className="h-4 w-4 fill-current" />
                Try the live demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <Lock className="h-4 w-4" />
                Sign in to your account
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-4">
              No credit card required · SOC 2 in progress · Self-host available
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              One platform for the whole climate workflow
            </h2>
            <p className="text-muted-foreground mt-3">
              Measure, model, reduce, disclose. Built so finance, sustainability,
              and operations teams share one source of truth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="border border-border bg-card p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-2xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              From raw data to filed report
            </h2>
            <p className="text-muted-foreground mt-3">
              Four steps. No spreadsheet gymnastics.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="border border-border bg-card p-6 space-y-3"
              >
                <div className="text-xs font-mono font-bold text-primary">
                  {s.n}
                </div>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
                <CheckCircle2 className="h-4 w-4 text-primary/60" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="border border-border bg-card p-8 md:p-12 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              See your numbers in five minutes.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Spin up the demo with sample data, or sign in if you already have
              an account. Your call.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <button
                onClick={enterDemo}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch the demo
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md border border-border bg-background hover:bg-muted text-foreground transition-colors"
              >
                <Lock className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-3.5 w-3.5" />
            <span>© {new Date().getFullYear()} Iora Climate Technologies, Inc.</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/product" className="hover:text-primary transition-colors">Product</Link>
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
