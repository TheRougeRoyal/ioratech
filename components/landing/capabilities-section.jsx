"use client";

import {
  Activity,
  FileText,
  Globe,
  Shield,
  Sliders,
  ArrowUpRight,
} from "lucide-react";

const capabilities = [
  {
    icon: Activity,
    title: "Carbon Footprint Modeling",
    shortDesc: "Scope 1, 2 & 3 tracking",
    description:
      "Comprehensive emissions accounting across your entire value chain with automated data pipelines and supplier engagement tools.",
    metrics: ["500+ data connectors", "98.5% accuracy", "Real-time updates"],
  },
  {
    icon: Globe,
    title: "Risk Forecasting Engine",
    shortDesc: "Physical & transition risk",
    description:
      "Quantify climate risks using NGFS scenarios and advanced spatial analytics. Map exposures across assets and supply chains.",
    metrics: ["8 climate scenarios", "Global coverage", "Asset-level detail"],
  },
  {
    icon: Shield,
    title: "Regulatory Monitoring",
    shortDesc: "Global compliance tracking",
    description:
      "Stay ahead of evolving climate regulations across 190+ jurisdictions. Automated alerts and compliance gap analysis.",
    metrics: ["190+ jurisdictions", "Daily updates", "Gap analysis"],
  },
  {
    icon: Sliders,
    title: "Scenario Simulation",
    shortDesc: "Strategic modeling",
    description:
      "Model the financial impact of different decarbonization pathways and policy scenarios on your portfolio.",
    metrics: ["Monte Carlo engine", "Custom scenarios", "Board-ready outputs"],
  },
  {
    icon: FileText,
    title: "ESG Reporting Automation",
    shortDesc: "Framework alignment",
    description:
      "Generate disclosure-ready reports aligned with TCFD, CSRD, SEC, and other major frameworks with audit trails.",
    metrics: ["12+ frameworks", "Audit-ready", "Auto-generation"],
  },
];

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-20 md:py-28 relative overflow-hidden bg-background border-b border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-mono uppercase tracking-wider mb-6">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Core Infrastructure
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            A complete suite of computational tools for climate risk, engineered for scale and precision.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {capabilities.map((capability, index) => {
            // Bento layout
            let colSpanClasses = "lg:col-span-4 md:col-span-3";
            if (index === 0) colSpanClasses = "lg:col-span-8 md:col-span-6";
            if (index === 4) colSpanClasses = "lg:col-span-4 md:col-span-6";

            const Icon = capability.icon;

            return (
              <div
                key={capability.title}
                className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-sm ${colSpanClasses}`}
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Icon */}
                    <div className="mb-6 h-10 w-10 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>

                    {/* Content */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {capability.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {capability.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/30">
                    {capability.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="inline-flex items-center rounded bg-muted/50 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
