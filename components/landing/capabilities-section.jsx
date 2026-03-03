"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Activity,
  FileText,
  Globe,
  Shield,
  Sliders,
} from "lucide-react";

const capabilities = [
  {
    icon: Activity,
    title: "Carbon Footprint Modeling",
    shortDesc: "Scope 1, 2, and 3 tracking",
    description:
      "Collect and organize emissions data across operations and value chain activities without rebuilding your process every quarter.",
    metrics: ["Structured data intake", "Supplier coverage", "Versioned records"],
  },
  {
    icon: Globe,
    title: "Risk Forecasting Engine",
    shortDesc: "Physical & transition risk",
    description:
      "Assess how physical and transition risk could affect assets, operations, and suppliers under multiple climate pathways.",
    metrics: ["Scenario comparison", "Location-based exposure", "Actionable risk signals"],
  },
  {
    icon: Shield,
    title: "Regulatory Monitoring",
    shortDesc: "Global compliance tracking",
    description:
      "Track evolving requirements across major frameworks and see where your reporting posture is strong or needs attention.",
    metrics: ["Requirement mapping", "Gap visibility", "Audit-ready evidence"],
  },
  {
    icon: Sliders,
    title: "Scenario Simulation",
    shortDesc: "Strategic modeling",
    description:
      "Test decarbonization choices and policy assumptions before committing capital or setting long-term targets.",
    metrics: ["Policy and price levers", "Financial outcomes", "Decision-ready summaries"],
  },
  {
    icon: FileText,
    title: "ESG Reporting Automation",
    shortDesc: "Framework alignment",
    description:
      "Produce clear, traceable reporting packages aligned with the frameworks your teams and stakeholders already use.",
    metrics: ["Reusable templates", "Change history", "Review workflow"],
  },
];

export function CapabilitiesSection() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">What you can do in Iora</h2>
          <p className="text-lg text-muted-foreground">
            Each workflow is designed to reduce manual work while keeping finance, sustainability,
            and risk teams aligned.
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
            >
              <Card className="h-full border-border/50 bg-card/50 transition-all duration-300 hover:border-border/80 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <capability.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-base mt-4">{capability.title}</CardTitle>
                  <CardDescription className="text-sm">{capability.shortDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{capability.description}</p>
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
