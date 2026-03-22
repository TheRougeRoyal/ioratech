"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Database, Cpu, FileOutput, ShieldCheck, Check } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    icon: Database,
    number: "01",
    title: "Data Ingestion",
    description:
      "Connect to your ERP, utility providers, and supply chain systems. Our automated pipelines ensure data quality and completeness across 500+ integrations.",
    details: ["API integrations", "Automated validation", "Real-time sync"],
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-600",
  },
  {
    icon: Cpu,
    number: "02",
    title: "Modeling & Risk Intelligence",
    description:
      "ML models trained on millions of data points analyze your operations against climate scenarios. Monte Carlo simulations quantify risks in financial terms your board understands.",
    details: ["AI-powered analysis", "Scenario modeling", "Risk quantification"],
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    textColor: "text-violet-600",
  },
  {
    icon: FileOutput,
    number: "03",
    title: "Strategic Output & Reporting",
    description:
      "Generate board-ready reports, regulatory disclosures, and strategic recommendations. All outputs are audit-ready and framework-aligned.",
    details: ["TCFD/CSRD aligned", "Audit trails", "Board presentations"],
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    textColor: "text-emerald-600",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Assured & Standards-Aligned",
    description:
      "Every calculation is traceable and reproducible, aligned with GHG Protocol, PCAF, and ISSB standards. Our methodology is independently verified by leading assurance providers.",
    details: ["GHG Protocol", "PCAF & ISSB", "Independent verification"],
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-600",
  },
];

export function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="py-24 md:py-32 relative overflow-hidden bg-muted/20 border-y border-border/40"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      </div>

      <div className="container px-4 md:px-6 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
          >
            Architecture
          </motion.div>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6 text-balance bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text">
            Rigorous by Design
          </h2>
          <p className="text-xl text-muted-foreground text-balance mx-auto max-w-2xl">
            From raw data ingestion to assured strategic decisions. A predictable, highly engineered pipeline.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - Animated fill */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border/50 hidden md:block overflow-hidden"
          >
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="absolute inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500"
            />
          </div>

          <div className="space-y-8 md:space-y-0 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="relative md:pl-28 py-4 group"
              >
                {/* Timeline node */}
                <div className="hidden md:flex absolute left-[1.35rem] top-1/2 -translate-y-1/2 z-10"
                >
                  <motion.div
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.15 + 0.2,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className={`h-5 w-5 rounded-full border-4 border-background ${step.bgColor.replace('/10', '/30')} transition-all duration-500 group-hover:scale-125`}
                  >
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-background border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-${step.color.split('-')[1]}-500/10 hover:border-${step.color.split('-')[1]}-500/30 relative overflow-hidden`}
                >
                  {/* Step number watermark */}
                  <div
                    className="absolute -right-4 -top-4 text-[8rem] font-bold text-muted/20 leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-110 group-hover:text-muted/30"
                  >
                    {step.number}
                  </div>

                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`h-14 w-14 shrink-0 rounded-xl ${step.bgColor} flex items-center justify-center border ${step.borderColor} transition-all duration-300 group-hover:shadow-lg`}
                    >
                      <step.icon className={`h-6 w-6 ${step.textColor}`} />
                    </motion.div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-bold ${step.textColor} uppercase tracking-wider`}>
                          Step {step.number}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold tracking-tight mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-5 text-sm md:text-base">
                        {step.description}
                      </p>

                      {/* Feature tags */}
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail, i) => (
                          <motion.span
                            key={detail}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.15 + i * 0.1 + 0.3,
                            }}
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${step.borderColor} ${step.bgColor} ${step.textColor} transition-all duration-300 hover:scale-105`}
                          >
                            <Check className="h-3 w-3" />
                            {detail}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
