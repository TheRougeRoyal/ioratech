"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    features: ["Policy impact modeling", "Cross-jurisdiction analysis", "Public reporting tools"],
    metrics: { jurisdictions: "85+", policies: "2,400+", impact: "320M people" },
    chartData: [35, 42, 48, 52, 58, 62, 65, 68],
  },
];

export function IndustriesSection() {
  const [activeTab, setActiveTab] = useState("corporations");
  const activeIndustry = industries.find((i) => i.id === activeTab);

  return (
    <section id="industries" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Built for Your Industry</h2>
          <p className="text-lg text-muted-foreground">
            Tailored solutions for organizations that require institutional-grade climate intelligence.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            {industries.map((industry) => (
              <TabsTrigger
                key={industry.id}
                value={industry.id}
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-2.5"
              >
                <industry.icon className="h-4 w-4 mr-2" />
                {industry.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3">{activeIndustry.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{activeIndustry.description}</p>
              </div>

              <ul className="space-y-3">
                {activeIndustry.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-6 pt-4">
                {Object.entries(activeIndustry.metrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-medium">Performance Overview</div>
                  <div className="text-xs text-muted-foreground">Last 8 quarters</div>
                </div>
                <span className="text-xs text-muted-foreground">Updated quarterly</span>
              </div>

              <div className="flex items-end justify-between h-32 gap-2 mb-4">
                {activeIndustry.chartData.map((value, i) => (
                  <div
                    key={i}
                    style={{ height: `${value}%` }}
                    className="flex-1 bg-primary/25 rounded-t"
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">-12%</div>
                  <div className="text-[10px] text-muted-foreground">Emissions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">A-</div>
                  <div className="text-[10px] text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">98%</div>
                  <div className="text-[10px] text-muted-foreground">Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
