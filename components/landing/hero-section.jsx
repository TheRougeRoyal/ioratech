"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-40 md:pb-24 border-b border-border/40 overflow-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Minimal Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-mono tracking-wider uppercase mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Iora Climate Intelligence 2.0
            <Sparkles className="h-3 w-3 text-muted-foreground" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance leading-none mb-6">
            Strategic Climate Intelligence.{" "}
            <span className="text-muted-foreground/60">Engineered.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed text-balance">
            Enterprise-grade carbon analytics and regulatory foresight.
            We transform climate risk into a measurable, strategic advantage.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Link href="/request-access" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-11 px-6 text-sm font-medium w-full sm:w-auto rounded-md group bg-foreground text-background hover:bg-foreground/90"
              >
                Request Access
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="h-11 px-6 text-sm font-medium w-full sm:w-auto rounded-md border-border bg-background hover:bg-muted/50"
              >
                View Platform
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 py-8 border-t border-b border-border/40 w-full max-w-3xl">
            {[
              { value: "500+", label: "Data Connectors" },
              { value: "98.5%", label: "Accuracy Rate" },
              { value: "190+", label: "Jurisdictions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flat Minimal Dashboard Preview */}
        <div className="mt-16 md:mt-20 mx-auto max-w-4xl px-2 sm:px-0">
          <div className="rounded-xl border border-border/50 bg-card p-2 sm:p-3 shadow-md">
            <div className="rounded-lg overflow-hidden border border-border/40 bg-background">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
