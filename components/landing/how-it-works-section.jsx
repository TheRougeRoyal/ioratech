"use client";

import { Database, Cpu, FileOutput, ShieldCheck, Check } from "lucide-react";

const steps = [
  {
    icon: Database,
    number: "01",
    title: "Data Ingestion",
    description:
      "Connect to your ERP, utility providers, and supply chain systems. Our automated pipelines ensure data quality and completeness across 500+ integrations.",
    details: ["API integrations", "Automated validation", "Real-time sync"],
  },
  {
    icon: Cpu,
    number: "02",
    title: "Modeling & Risk Intelligence",
    description:
      "ML models trained on millions of data points analyze your operations against climate scenarios. Monte Carlo simulations quantify risks in financial terms.",
    details: ["AI analysis", "Scenario modeling", "Risk quantification"],
  },
  {
    icon: FileOutput,
    number: "03",
    title: "Strategic Output & Reporting",
    description:
      "Generate board-ready reports, regulatory disclosures, and strategic recommendations. All outputs are audit-ready and framework-aligned.",
    details: ["TCFD/CSRD aligned", "Audit trails", "Board presentations"],
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Assured & Standards-Aligned",
    description:
      "Calculations are traceable and reproducible, aligned with GHG Protocol, PCAF, and ISSB standards. Verified by leading assurance providers.",
    details: ["GHG Protocol", "PCAF & ISSB", "Independent verification"],
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 relative overflow-hidden bg-muted/20 border-b border-border/40"
    >
      <div className="container px-4 md:px-6 mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-background px-3 py-1 text-xs font-mono uppercase tracking-wider mb-6">
            Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Rigorous by Design
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mx-auto max-w-2xl text-balance">
            From raw data ingestion to assured strategic decisions. A predictable, highly engineered pipeline.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between hover:border-border transition-colors duration-300"
              >
                <div>
                  {/* Step badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                      <Icon className="h-4.5 w-4.5 text-foreground" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Details tags */}
                <div className="space-y-1.5 pt-3 border-t border-border/30">
                  {step.details.map((detail) => (
                    <div key={detail} className="flex items-center text-[10px] text-muted-foreground font-mono">
                      <Check className="h-3 w-3 text-emerald-500 mr-1.5 shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
