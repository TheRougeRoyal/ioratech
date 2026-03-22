"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { DashboardPreview } from "./dashboard-preview";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Custom easing curves
const smooth = [0.25, 0.1, 0.25, 1];
const snappy = [0.23, 1, 0.32, 1];
const drift = [0.4, 0, 0.2, 1];

export function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/30 via-background to-background" />

        {/* Floating gradient orbs */}
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-muted/20 via-muted/10 to-transparent rounded-full blur-3xl"
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <motion.div style={{ y, opacity, scale }} className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: snappy }}
            className="group relative inline-flex items-center justify-center rounded-full border border-border/30 bg-background/50 backdrop-blur-sm px-4 py-2 text-sm font-medium mb-10 cursor-pointer overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/50 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500">
                <motion.span
                  className="absolute inline-flex h-2 w-2 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </span>
              Iora Climate Intelligence 2.0
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
            </span>
          </motion.div>

          {/* Headline with character stagger */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: snappy }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium tracking-tighter text-balance leading-[1.05]"
            >
              <span className="block">
                Strategic Climate Intelligence.
              </span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-6">
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: snappy }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium tracking-tighter text-muted-foreground/40 block"
            >
              Engineered.
            </motion.span>
          </div>

          {/* Subtitle with word reveal */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: smooth }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed text-balance"
          >
            Enterprise-grade carbon analytics and regulatory foresight.
            <br className="hidden md:block" />
            We transform climate risk into a measurable, strategic advantage.
          </motion.p>

          {/* Buttons with magnetic effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: smooth }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/request-access" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="h-12 px-8 text-base w-full sm:w-auto rounded-full group relative overflow-hidden bg-foreground text-background"
                >
                  <span className="relative z-10 flex items-center">
                    Request Access
                    <motion.span
                      className="ml-2"
                      initial={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base w-full sm:w-auto rounded-full border-border/50 bg-background/30 backdrop-blur-sm hover:bg-background/60 transition-all duration-300"
                >
                  View Platform
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats with count-up animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7, ease: smooth }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-16 pt-12 border-t border-border/20 w-full"
          >
            {[
              { value: "500+", label: "Data Connectors" },
              { value: "98.5%", label: "Accuracy Rate" },
              { value: "190+", label: "Jurisdictions" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: smooth }}
                className="text-center group cursor-default"
              >
                <div className="text-3xl md:text-4xl font-semibold tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard preview with 3D perspective */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: snappy }}
          style={{ perspective: "1200px" }}
          className="mt-20 md:mt-28 relative mx-auto max-w-5xl"
        >
          <motion.div
            whileHover={{ rotateX: -2, y: -5 }}
            transition={{ duration: 0.4, ease: smooth }}
            className="relative rounded-2xl border border-border/30 bg-background/30 backdrop-blur-xl p-3 sm:p-4 shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl blur-2xl opacity-30" />

            <div className="relative rounded-xl overflow-hidden border border-border/40 bg-background shadow-sm">
              <DashboardPreview />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
