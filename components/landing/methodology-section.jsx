"use client";

import { motion } from "framer-motion";
import { Database, Cpu, LineChart, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Data Integration",
    description:
      "Connect to 500+ data sources including ERP systems, utility providers, and supply chain platforms. Our automated pipelines ensure data quality and completeness.",
  },
  {
    icon: Cpu,
    title: "AI-Powered Analysis",
    description:
      "Machine learning models trained on millions of data points identify patterns, fill gaps, and generate accurate emissions factors specific to your operations.",
  },
  {
    icon: LineChart,
    title: "Scenario Modeling",
    description:
      "Run thousands of Monte Carlo simulations to stress-test your portfolio against climate scenarios. Quantify risks in financial terms your board understands.",
  },
  {
    icon: ShieldCheck,
    title: "Assured Outputs",
    description:
      "All calculations are audit-ready and align with GHG Protocol, PCAF, and ISSB standards. Our methodology is independently verified by leading assurance providers.",
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="py-20 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Methodology</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rigorous, transparent, and aligned with global standards.
            Every data point is traceable, every calculation is reproducible.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1">
                  <div
                    className={`p-6 rounded-xl border border-border/50 bg-card/50 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-12">
                  <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
