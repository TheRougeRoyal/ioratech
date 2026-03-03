"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Database, Cpu, FileOutput, ArrowRight } from "lucide-react";

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
      "Machine learning models analyze your data against climate scenarios. Quantify risks, identify hotspots, and surface actionable insights.",
    details: ["AI-powered analysis", "Scenario modeling", "Risk quantification"],
  },
  {
    icon: FileOutput,
    number: "03",
    title: "Strategic Output & Reporting",
    description:
      "Generate board-ready reports, regulatory disclosures, and strategic recommendations. All outputs are audit-ready and framework-aligned.",
    details: ["TCFD/CSRD aligned", "Audit trails", "Board presentations"],
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How Iora Works</h2>
          <p className="text-lg text-muted-foreground">
            From raw data to strategic decisions in three integrated steps.
          </p>
        </motion.div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative"
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Step Indicator */}
                  <motion.div
                    animate={{
                      scale: activeStep === index ? 1.1 : 1,
                      backgroundColor: activeStep >= index ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    }}
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-6 border-4 border-background transition-colors"
                  >
                    <step.icon className={`h-5 w-5 ${activeStep >= index ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </motion.div>

                  <motion.div
                    animate={{ opacity: activeStep === index ? 1 : 0.6 }}
                    className="transition-opacity"
                  >
                    <span className="text-xs font-medium text-muted-foreground">{step.number}</span>
                    <h3 className="text-xl font-semibold mt-1 mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <motion.div
                      animate={{ opacity: activeStep > index ? 1 : 0.3 }}
                      className="absolute top-6 left-full -translate-x-1/2 hidden lg:block"
                    >
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <step.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                {index < steps.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <span className="text-xs font-medium text-muted-foreground">{step.number}</span>
                <h3 className="text-lg font-semibold mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
