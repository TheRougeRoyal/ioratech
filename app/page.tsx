"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Lock,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  FileText,
  AlertTriangle,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    icon: BarChart3,
    title: "Emissions tracking",
    body: "Scope 1, 2, and 3 measurements based on GHG Protocol calculations.",
  },
  {
    icon: AlertTriangle,
    title: "Risk modeling",
    body: "Identify physical and transition risks across your operational portfolio.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance ready",
    body: "Maintain a versioned ledger of evidence for CSRD and SEC reporting.",
  },
  {
    icon: FileText,
    title: "Direct reporting",
    body: "Generate disclosure-ready PDFs from your operational data.",
  },
];

export default function HomePage() {
  const { startDemo } = useAuth();
  const router = useRouter();

  const enterDemo = () => {
    startDemo();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="relative py-24 md:py-32 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Defensible climate <span className="text-primary">accounting.</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              IORA provides the tools to measure emissions, model climate risks,
              and generate reports without the spreadsheet complexity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={enterDemo}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all group"
              >
                <Play className="h-4 w-4 fill-current" />
                Try the demo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 font-semibold rounded-full border border-border bg-background hover:bg-muted transition-all"
              >
                <Lock className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Core Value */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
