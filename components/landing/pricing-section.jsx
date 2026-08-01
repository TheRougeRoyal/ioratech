"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Shield, Award, FileCheck, PhoneCall } from "lucide-react";
import Link from "next/link";

const serviceTiers = [
  {
    name: "Targeted Audit & Compliance",
    description: "For rapid site assessments, single-issue sampling, or urgent regulatory permits.",
    model: "Fixed Project Fee",
    idealFor: "Real Estate Developers & Local Operators",
    features: [
      "Phase I Environmental Site Assessment (ESA)",
      "ASTM E1527-21 Standard Compliance",
      "Single Medium Sampling (Water or Soil)",
      "State Regulatory Permit Filing",
      "Executive Summary & Risk Report",
      "14-Day Delivery Guarantee",
    ],
    cta: "Schedule Audit",
    popular: false,
  },
  {
    name: "Full-Scale Site Remediation",
    description: "Turnkey engineering oversight, active decontamination, and NFA clearance.",
    model: "Scope & Milestones",
    idealFor: "Industrial Facilities & Brownfields",
    features: [
      "Phase II ESA & Delineation Drilling",
      "In-situ Soil & Aquifer Remediation Design",
      "Excavation & Waste Transport Management",
      "Sub-slab Vapor Intrusion Barrier Installation",
      "Full EPA & State Regulatory Liaison",
      "Regulatory 'No Further Action' (NFA) Dossier",
      "Dedicated Senior PE Project Manager",
    ],
    cta: "Request Project Proposal",
    popular: true,
  },
  {
    name: "Enterprise EHS Retainer",
    description: "Continuous environmental health, safety, and compliance governance across multiple assets.",
    model: "Annual Master Service Agreement",
    idealFor: "Multi-Facility Corporations & Energy Producers",
    features: [
      "Continuous Stack & Water Sampling Telemetry",
      "24/7 Priority Emergency Spill Response",
      "Title V Air & NPDES Permit Management",
      "Annual Regulatory Audit & Defense Support",
      "Custom SPCC & Facility Response Plans",
      "Dedicated Field Specialist & Lab Technicians",
    ],
    cta: "Contact Enterprise Solutions",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="compliance" className="py-20 md:py-28 bg-muted/20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Commercial Engagement Models
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Structured Environmental Engineering Engagement
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
            We provide transparent project pricing based on site scope, sampling density, and regulatory requirements. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col justify-between rounded-xl border ${
                tier.popular
                  ? "border-primary shadow-md bg-card relative"
                  : "border-border bg-card"
              }`}
            >
              <div>
                <CardHeader className="pt-8">
                  {tier.popular && (
                    <div className="mb-2">
                      <Badge className="bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-wider">
                        Most Requested Service
                      </Badge>
                    </div>
                  )}
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="min-h-[40px] text-xs text-muted-foreground mt-2 leading-relaxed">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/60">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Pricing Structure
                    </div>
                    <div className="text-base font-bold text-foreground mt-0.5 font-sans">
                      {tier.model}
                    </div>
                    <div className="text-[11px] text-primary font-medium mt-1">
                      Ideal for: {tier.idealFor}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Included Scope & Deliverables:
                    </div>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start text-xs text-muted-foreground">
                          <Check className="h-4 w-4 text-primary shrink-0 mr-2.5 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-6 pb-8">
                <Link href="#contact" className="w-full">
                  <Button
                    className={`w-full rounded-md h-11 text-xs font-semibold ${
                      tier.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Accreditations Banner */}
        <div className="mt-16 bg-card border border-border rounded-xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Shield className="h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-foreground">NELAP Certified Lab</div>
            <div className="text-[11px] text-muted-foreground">National Environmental Accreditation</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Award className="h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-foreground">PE Licensed Engineers</div>
            <div className="text-[11px] text-muted-foreground">Staffed in All 50 US States</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-foreground">ASTM Compliance</div>
            <div className="text-[11px] text-muted-foreground">E1527-21 Standard Compliant</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <PhoneCall className="h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-foreground">24/7 Spill Response</div>
            <div className="text-[11px] text-muted-foreground">Immediate Dispatch Teams</div>
          </div>
        </div>

      </div>
    </section>
  );
}
