"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, TrendingUp, Factory, Landmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const industries = [
  {
    id: "corporations",
    icon: Building2,
    title: "Corporations",
    description: "Bring operations and supplier emissions into one decision flow, then align reduction work to annual planning cycles.",
    features: ["Supplier emissions mapping", "Reduction roadmap planning", "Executive-ready summaries"],
    metrics: { clients: "320+", emissions: "1.2B tCO2e", reduction: "18% avg" },
    chartData: [65, 62, 58, 55, 52, 48, 45, 42],
  },
  {
    id: "investment",
    icon: TrendingUp,
    title: "Investment Funds",
    description: "Evaluate climate exposure across portfolios and tie insights directly to stewardship and allocation decisions.",
    features: ["Portfolio footprint", "Climate VaR analysis", "Engagement progress tracking"],
    metrics: { aum: "$2.8T", portfolios: "1,200+", coverage: "45,000 issuers" },
    chartData: [45, 52, 48, 55, 62, 58, 65, 68],
  },
  {
    id: "infrastructure",
    icon: Factory,
    title: "Infrastructure",
    description: "Understand where climate hazards can affect critical assets and prioritize adaptation spend with clear trade-offs.",
    features: ["Asset-level risk mapping", "Adaptation planning", "Insurance strategy support"],
    metrics: { assets: "8,500+", value: "$420B", scenarios: "40+" },
    chartData: [72, 68, 65, 62, 58, 55, 52, 48],
  },
  {
    id: "public",
    icon: Landmark,
    title: "Public Sector",
    description: "Model policy options, compare outcomes across regions, and publish transparent progress updates for stakeholders.",
    features: ["Policy impact modeling", "Cross-jurisdiction comparison", "Public reporting tools"],
    metrics: { jurisdictions: "85+", policies: "2,400+", impact: "320M people" },
    chartData: [35, 42, 48, 52, 58, 62, 65, 68],
  },
];

export function IndustriesSection() {
  const [activeTab, setActiveTab] = useState("corporations");
  const activeIndustry = industries.find((i) => i.id === activeTab);

  return (
    <section id="industries" className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Built for Your Industry</h2>
          <p className="text-lg text-muted-foreground">
            Teams in different sectors face different constraints, so the workflows adapt to your operating model.
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8 items-center"
            >
              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{activeIndustry.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{activeIndustry.description}</p>
                </div>

                <ul className="space-y-3">
                  {activeIndustry.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center text-sm"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
                      {feature}
                    </motion.li>
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

              {/* Analytics Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="bg-card rounded-xl border border-border/50 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm font-medium">Example outcome view</div>
                      <div className="text-xs text-muted-foreground">Illustrative trend over 8 quarters</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-xs text-muted-foreground">Snapshot</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="flex items-end justify-between h-32 gap-2 mb-4">
                    {activeIndustry.chartData.map((value, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/70 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-500">-12%</div>
                      <div className="text-[10px] text-muted-foreground">Emission trend</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">A-</div>
                      <div className="text-[10px] text-muted-foreground">Readiness score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">98%</div>
                      <div className="text-[10px] text-muted-foreground">Data coverage</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}
