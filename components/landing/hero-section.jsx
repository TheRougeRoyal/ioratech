"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Award, FileText, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 border-b border-border bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>EPA Compliant & State Certified Environmental Engineering</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              Comprehensive Environmental <span className="text-primary underline decoration-primary/30 underline-offset-8">Engineering</span> & Compliance Solutions
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
              We partner with industrial leaders, municipalities, and infrastructure developers to solve complex environmental challenges—from Phase I/II site assessments and ecological restoration to hazardous remediation and regulatory permitting.
            </p>

            {/* Key Value Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-medium text-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Phase I & II Site Assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Full-Scale Soil & Groundwater Remediation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Water Quality & NPDES Permitting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Hazardous Waste & Spill Response</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link href="/#contact">
                <Button
                  size="lg"
                  className="h-12 px-7 text-sm font-semibold rounded-md group bg-primary text-primary-foreground hover:bg-primary/90 shadow-md w-full sm:w-auto justify-center"
                >
                  Schedule Site Evaluation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/#services">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-sm font-semibold rounded-md border-border bg-card hover:bg-muted text-foreground w-full sm:w-auto justify-center"
                >
                  Explore Core Services
                </Button>
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border mt-6">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans">2,400+</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Completed Projects</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans">99.8%</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Regulatory Permit Success</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground font-sans">25+ Yrs</div>
                <div className="text-xs text-muted-foreground uppercase font-semibold mt-0.5">Engineering Excellence</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
              <img
                src="/env_hero_bg.jpg"
                alt="Environmental engineering research project site"
                className="w-full h-[400px] sm:h-[480px] object-cover"
                onError={(e) => {
                  // fallback if image standard path differs
                  e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              
              {/* Overlay Overlay Info Box */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-primary flex items-center gap-1">
                    <Award className="h-4 w-4" /> Live Operations Monitoring
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                    ● Active Field Units
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Our certified environmental scientists operate continuous air, water, and soil sampling telemetry across 40+ states.
                </p>
              </div>
            </div>

            {/* Floating Quick Feature Card */}
            <div className="hidden sm:flex items-center gap-3 absolute -top-5 -left-5 bg-card border border-border p-3.5 rounded-xl shadow-lg">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">ASTM E1527-21 Ready</div>
                <div className="text-[11px] text-muted-foreground">Standard Phase I ESA Reports</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
