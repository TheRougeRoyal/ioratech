"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  FileCheck2,
  Lock,
  Play,
  ShieldCheck,
} from "lucide-react";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const WORKFLOW = [
  {
    number: "01",
    title: "Bring your data together",
    body: "Connect facility, utility, travel, and supplier data without losing the source behind each number.",
  },
  {
    number: "02",
    title: "See what needs attention",
    body: "IORA highlights missing evidence, unusual changes, and the facilities most exposed to climate risk.",
  },
  {
    number: "03",
    title: "Share a report you can stand behind",
    body: "Review the calculation trail, answer questions from stakeholders, and export a report when it is ready.",
  },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "A clear emissions picture",
    body: "Track Scope 1, 2, and 3 in one place, with the assumptions and activity data still attached.",
  },
  {
    icon: AlertTriangle,
    title: "Fewer last-minute surprises",
    body: "Find gaps and rising risks early, while there is still time to do something about them.",
  },
  {
    icon: FileCheck2,
    title: "Evidence that travels with the number",
    body: "Keep invoices, factors, notes, and approvals together instead of hunting through shared drives.",
  },
];

export default function HomePage() {
  const { startDemo } = useAuth();
  const router = useRouter();

  const enterDemo = async () => {
    startDemo();
    // Small delay to ensure AuthContext state updates before the guard hits
    await new Promise(resolve => setTimeout(resolve, 100));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main>
        <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
            <div className="space-y-7 lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Climate reporting for teams doing the work
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                Stop rebuilding your climate report every quarter.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                IORA brings emissions data, climate risk, and reporting evidence
                into one calm workspace, so your team can spend less time
                chasing spreadsheets and more time making decisions.
              </p>
              <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  onClick={enterDemo}
                  size="lg"
                  className="group gap-2"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Explore the demo now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                No sales call required to look around.
              </p>
            </div>

            <div className="relative lg:col-span-6">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
              <DashboardPreview />
              <div className="absolute -bottom-5 -left-3 hidden max-w-[230px] rounded-lg border border-border bg-card p-4 shadow-lg sm:block">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Evidence attached
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Every reported number has a trail your finance and
                  sustainability teams can review.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-border py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Made for the messy middle
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                The work behind a trustworthy report is rarely tidy.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                IORA gives the details a home without making the people doing
                the work feel like they need a data science degree.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="border-t-2 border-primary pt-5">
                    <Icon className="mb-5 h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{feature.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="bg-muted/30 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-4">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                A simpler rhythm
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From scattered inputs to a report your team trusts.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Start with the information you already have. Improve it as you
                go. Keep the context when the report leaves your team.
              </p>
            </div>
            <div className="space-y-0 lg:col-span-7 lg:col-start-6">
              {WORKFLOW.map((step) => (
                <div key={step.number} className="flex gap-5 border-t border-border py-6">
                  <span className="font-mono text-sm text-primary">{step.number}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Make the next reporting cycle less painful.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Take a look around, or tell us what your current process looks like.
              </p>
            </div>
            <Button
              type="button"
              size="lg"
              className="gap-2"
              asChild
            >
              <Link href="/contact">
                Start a conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
