"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ArrowRight, Sparkles, ShieldCheck, Leaf, BarChart3, Activity,
  TrendingDown, CheckCircle2, Sun, Moon, Play, Lock,
  AlertTriangle, Factory, Flame, Cloud, FileText, Shield,
  ChevronRight, LineChart, Database, Cpu,
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
      className="h-9 w-9 inline-flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
    </button>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
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

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/product" className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary">
            Product
          </Link>
          <Link href="/about" className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const { startDemo } = useAuth();
  const router = useRouter();
  const enterDemo = () => {
    startDemo();
    router.push("/dashboard");
  };
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Now in public preview · Built on GHG Protocol
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              The climate dashboard that{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-8">
                actually fits
              </span>{" "}
              your day.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Track emissions, model physical and transition risk, and produce
              audit-ready reports — all in one place. Walk through the live demo
              in your browser, no signup, no credit card.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
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
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-1.5 h-12 px-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Create account
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border mt-6">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">2,400+</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Sites tracked</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">99.8%</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Audit pass rate</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">12 frameworks</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Built-in</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
              <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Iora Dashboard</span>
                </div>
                <div className="w-12" />
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total emissions</span>
                      <Activity className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="text-xl font-bold tracking-tight">124,500 <span className="text-xs font-normal text-muted-foreground font-mono">tCO2e</span></div>
                    <div className="flex items-center text-[10px] text-emerald-500 font-mono mt-1">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      -12.3% YOY
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Risk score</span>
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="text-xl font-bold tracking-tight">Medium</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">52 / 100 points</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Emissions trend</span>
                    <span className="text-[9px] text-muted-foreground font-mono">Last 12 months</span>
                  </div>
                  <div className="flex items-end justify-between h-16 gap-1">
                    {[45, 42, 48, 44, 38, 42, 35, 32, 38, 34, 30, 28].map((v, i) => (
                      <div key={i} style={{ height: `${v}%` }} className="flex-1 bg-muted-foreground/20 rounded-sm hover:bg-muted-foreground/45 transition-colors" />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[8px] text-muted-foreground font-mono uppercase tracking-wider">
                    <span>Jan</span><span>Jun</span><span>Dec</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Compliance status</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500">4 / 4 Aligned</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const capabilities = [
  { icon: BarChart3, title: "Carbon metrics", category: "Scope 1 · 2 · 3", description: "Record and visualize emissions across every scope, category, and period." },
  { icon: AlertTriangle, title: "Risk analysis", category: "Physical & transition", description: "Score heat, flood, water, wildfire, carbon pricing, and policy risk." },
  { icon: LineChart, title: "Scenario simulator", category: "1.5°C pathways", description: "Model net-zero, delayed transition, and disorderly scenarios." },
  { icon: FileText, title: "Reports", category: "Audit-ready", description: "Generate TCFD, GRI, SASB, CSRD, ESRS, ISSB, CDP, GHG Protocol reports." },
  { icon: Shield, title: "Compliance", category: "Stay current", description: "Cross-jurisdiction rule tracking with alerts when a requirement changes." },
  { icon: Database, title: "API & integrations", category: "Wire into your stack", description: "Connect ERP, utility, and supply-chain platforms via REST or webhooks." },
];

function Capabilities() {
  return (
    <section className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              What's inside
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              One workspace for your whole climate program
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="group relative flex flex-col rounded-xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded">
                    {c.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: Database, title: "Connect your data", description: "Plug in your utilities, ERP, travel, and supply-chain feeds. Or upload a spreadsheet." },
  { icon: Cpu, title: "Let Iora crunch the numbers", description: "Emissions factors, scope attribution, and risk scoring run automatically." },
  { icon: LineChart, title: "See the program at a glance", description: "A live dashboard, weekly digests, and threshold alerts." },
  { icon: FileText, title: "Generate a report when you're ready", description: "Pick a framework, choose a period, export. No copy-paste." },
];

function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            From data to disclosure in four steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="relative bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-primary/40 font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const standards = [
  "GHG Protocol", "TCFD", "GRI", "SASB", "CSRD", "ESRS",
  "ISSB", "CDP", "PCAF", "ISO 14001", "ISO 14064", "SBTi",
];

function Trust() {
  return (
    <section className="py-16 md:py-20 bg-muted/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Standards we cover
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Built around the frameworks your auditors already use
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border border border-border">
          {standards.map((s) => (
            <div key={s} className="bg-card px-4 py-5 text-center">
              <p className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">{s}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-10">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            SOC 2 Type II in progress
          </div>
          <span className="text-muted-foreground/40">·</span>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            GDPR & CCPA compliant
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { startDemo } = useAuth();
  const router = useRouter();
  const enterDemo = () => {
    startDemo();
    router.push("/dashboard");
  };
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-card to-emerald-50/40 dark:to-emerald-950/20">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl" />
          <div className="relative p-8 sm:p-12 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Two ways to start
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Open the demo, or sign in and pick up where you left off
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4">
              <button
                onClick={startDemo}
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
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-base font-bold tracking-tight">IORA</span>
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Iora Climate Technologies, Inc.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main>
        <Hero />
        <Capabilities />
        <HowItWorks />
        <Trust />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
