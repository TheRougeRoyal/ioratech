"use client";

import { motion } from "framer-motion";
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
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: Globe,
    title: "Risk Forecasting Engine",
    shortDesc: "Physical & transition risk",
    description:
      "Quantify climate risks using NGFS scenarios and advanced spatial analytics. Map exposures across assets and supply chains.",
    metrics: ["8 climate scenarios", "Global coverage", "Asset-level detail"],
    gradient: "from-amber-500/20 to-orange-500/10",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    icon: Shield,
    title: "Regulatory Monitoring",
    shortDesc: "Global compliance tracking",
    description:
      "Stay ahead of evolving climate regulations across 190+ jurisdictions. Automated alerts and compliance gap analysis.",
    metrics: ["190+ jurisdictions", "Daily updates", "Gap analysis"],
    gradient: "from-blue-500/20 to-indigo-500/10",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Sliders,
    title: "Scenario Simulation",
    shortDesc: "Strategic modeling",
    description:
      "Model the financial impact of different decarbonization pathways and policy scenarios on your portfolio.",
    metrics: ["Monte Carlo engine", "Custom scenarios", "Board-ready outputs"],
    gradient: "from-violet-500/20 to-purple-500/10",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
  },
  {
    icon: FileText,
    title: "ESG Reporting Automation",
    shortDesc: "Framework alignment",
    description:
      "Generate disclosure-ready reports aligned with TCFD, CSRD, SEC, and other major frameworks with audit trails.",
    metrics: ["12+ frameworks", "Audit-ready", "Auto-generation"],
    gradient: "from-rose-500/20 to-pink-500/10",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-2xl mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
          >
            Platform Capabilities
          </motion.div>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text">
            Core Infrastructure
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed text-balance">
            A complete suite of computational tools for climate risk,
            engineered for scale and precision.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5"
        >
          {capabilities.map((capability, index) => {
            // Create asymmetrical bento layout
            let colSpanClasses = "lg:col-span-4 md:col-span-3";
            if (index === 0) colSpanClasses = "lg:col-span-8 md:col-span-6";
            if (index === 4) colSpanClasses = "lg:col-span-4 md:col-span-6";

            return (
              <motion.div
                key={capability.title}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${colSpanClasses}`}
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Large icon watermark */}
                <div className="absolute top-0 right-0 p-6 opacity-0 transition-all duration-500 group-hover:opacity-10 group-hover:scale-110 group-hover:rotate-3">
                  <capability.icon className="h-32 w-32" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`mb-5 h-12 w-12 rounded-xl ${capability.iconBg} flex items-center justify-center border border-border/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    <capability.icon
                      className={`h-5 w-5 ${capability.iconColor} transition-transform group-hover:scale-110`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold tracking-tight">
                        {capability.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {capability.description}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/30">
                    {capability.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="inline-flex items-center rounded-full border border-border/50 bg-background/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all duration-300 group-hover:bg-background group-hover:border-border/80"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
