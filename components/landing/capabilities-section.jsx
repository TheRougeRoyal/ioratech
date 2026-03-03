"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  FileText,
  Globe,
  Shield,
  Sliders,
  ChevronRight,
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="capabilities" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Core Capabilities</h2>
          <p className="text-lg text-muted-foreground">
            A complete suite of tools for climate risk management and carbon intelligence,
            engineered for enterprise scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className={`h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredIndex === index ? "border-border shadow-lg scale-[1.02]" : "hover:border-border/80"
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <motion.div
                      animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                      className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <capability.icon className="h-5 w-5 text-primary" />
                    </motion.div>
                    <motion.div
                      animate={{ x: hoveredIndex === index ? 0 : 10, opacity: hoveredIndex === index ? 1 : 0 }}
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-base mt-4">{capability.title}</CardTitle>
                  <CardDescription className="text-sm">{capability.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: hoveredIndex === index ? "auto" : 0,
                      opacity: hoveredIndex === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      {capability.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {capability.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
