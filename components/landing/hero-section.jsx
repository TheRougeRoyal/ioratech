"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-14 md:pt-28 md:pb-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/80 border border-border/50 mb-6">
              <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">Platform Active</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
              Operational{" "}
              <span className="text-primary">Climate</span>
              <br />
              Intelligence.
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Strategic carbon modeling, regulatory foresight, and enterprise-grade analytics.
              Built for organizations that take climate risk seriously.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/request-access">
                <Button size="lg" className="h-12 px-8 text-base font-medium">
                  Request Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium">
                  <Play className="mr-2 h-4 w-4" />
                  View Platform
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Enterprise clients</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">2.4B</div>
                <div className="text-sm text-muted-foreground">tCO2e tracked</div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
