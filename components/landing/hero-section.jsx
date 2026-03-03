"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardPreview } from "./dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-l from-slate-500/10 to-transparent blur-3xl"
        />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/80 border border-border/50 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">Platform Active</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Operational{" "}
              <span className="relative">
                <span className="relative z-10">Climate</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute bottom-2 left-0 h-3 bg-blue-500/20 dark:bg-blue-400/20 -z-0"
                />
              </span>
              <br />
              Intelligence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Strategic carbon modeling, regulatory foresight, and enterprise-grade analytics.
              Built for organizations that take climate risk seriously.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link href="/request-access">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="h-12 px-8 text-base font-medium shadow-lg shadow-primary/20">
                    Request Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base font-medium">
                    <Play className="mr-2 h-4 w-4" />
                    View Platform
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex items-center space-x-8"
            >
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Enterprise clients</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">2.4B</div>
                <div className="text-sm text-muted-foreground">tCO2e tracked</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
