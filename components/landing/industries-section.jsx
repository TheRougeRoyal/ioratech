"use client";

import { useState } from "react";
import { Building2, TrendingUp, Factory, Landmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const industries = [
  {
    id: "corporations",
    icon: Building2,
    title: "Corporations",
    description: "Track and reduce emissions across operations and supply chains. Meet disclosure requirements with confidence.",
    features: ["Supply chain emissions mapping", "Net-zero pathway planning", "Board-ready dashboards"],
    metrics: { clients: "320+", emissions: "1.2B tCO2e", reduction: "18% avg" },
    chartData: [65, 62, 58, 55, 52, 48, 45, 42],
  },
  {
    id: "investment",
    icon: TrendingUp,
    title: "Investment Funds",
    description: "Assess climate risk exposure across portfolios. Integrate ESG factors with quantitative rigor.",
    features: ["Portfolio carbon footprint", "Climate VaR analysis", "Engagement tracking"],
    metrics: { aum: "$2.8T", portfolios: "1,200+", coverage: "45,000 issuers" },
    chartData: [45, 52, 48, 55, 62, 58, 65, 68],
  },
  {
    id: "infrastructure",
    icon: Factory,
    title: "Infrastructure",
    description: "Manage physical climate risks to assets. Plan resilient investments for long-term value.",
    features: ["Asset-level risk mapping", "Adaptation planning", "Insurance optimization"],
    metrics: { assets: "8,500+", value: "$420B", scenarios: "40+" },
    chartData: [72, 68, 65, 62, 58, 55, 52, 48],
  },
  {
    id: "public",
    icon: Landmark,
    title: "Public Sector",
    description: "Model policy impacts and track effectiveness. Support evidence-based climate policy development.",
    features: ["Policy impact modeling", "Cross-jurisdiction analysis", "Scenario comparisons"],
    metrics: { jurisdictions: "85+", policies: "2,400+", impact: "320M people" },
    chartData: [35, 42, 48, 52, 58, 62, 65, 68],
  },
];

export function IndustriesSection() {
  const [activeTab, setActiveTab] = useState("corporations");
  const activeIndustry = industries.find((i) => i.id === activeTab);

  return (
    <section id="industries" className="py-20 md:py-28 bg-muted/10 border-b border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Built for Your Industry</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Tailored solutions for organizations that require institutional-grade climate intelligence.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted/50 p-1 h-auto flex flex-wrap gap-1 border border-border/40 rounded-lg max-w-max">
            {industries.map((industry) => (
              <TabsTrigger
                key={industry.id}
                value={industry.id}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-md"
              >
                <industry.icon className="h-3.5 w-3.5 mr-2" />
                {industry.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Details panel */}
            <div className="flex flex-col justify-between p-6 rounded-xl border border-border/50 bg-card">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{activeIndustry.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activeIndustry.description}</p>
                </div>

                <ul className="space-y-2">
                  {activeIndustry.features.map((feature) => (
                    <li key={feature} className="flex items-center text-xs font-mono text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-foreground mr-2.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-8 pt-6 border-t border-border/30 mt-6">
                {Object.entries(activeIndustry.metrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-lg font-bold">{value}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">{key}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance panel */}
            <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Performance Overview</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">Last 8 quarters</div>
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">Updated quarterly</span>
                </div>

                {/* Simulated Chart */}
                <div className="flex items-end justify-between h-28 gap-2 mb-4">
                  {activeIndustry.chartData.map((value, i) => (
                    <div
                      key={i}
                      style={{ height: `${value}%` }}
                      className="flex-1 bg-muted-foreground/20 rounded-t hover:bg-muted-foreground/30 transition-colors"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30 text-center">
                <div>
                  <div className="text-base font-bold text-emerald-500 font-mono">-12%</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Emissions</div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono">A-</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Rating</div>
                </div>
                <div>
                  <div className="text-base font-bold font-mono">98%</div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
