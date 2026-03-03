"use client";

import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const miniChartData = [45, 42, 48, 44, 38, 42, 35, 32, 38, 34, 30, 28];

export function DashboardPreview() {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValue((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/10 to-transparent rounded-2xl blur-2xl" />
      
      {/* Main Dashboard Card */}
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-muted-foreground font-medium">Iora Dashboard</div>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Total Emissions</span>
                <Activity className="h-3 w-3 text-blue-500" />
              </div>
              <div className="text-lg font-bold">124,500</div>
              <div className="flex items-center text-[10px] text-emerald-500">
                <TrendingDown className="h-2.5 w-2.5 mr-1" />
                -12.3% YoY
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Risk Score</span>
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-lg font-bold">Medium</div>
              <div className="text-[10px] text-muted-foreground">52/100 pts</div>
            </motion.div>
          </div>

          {/* Chart Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="p-3 rounded-lg bg-muted/30 border border-border/30"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium">Emissions Trend</span>
              <span className="text-[9px] text-muted-foreground">Last 12 months</span>
            </div>
            <div className="flex items-end justify-between h-16 gap-1">
              {miniChartData.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm opacity-80"
                />
              ))}
            </div>
          </motion.div>

          {/* Compliance Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium">Compliance Status</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">4/4 Aligned</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Cards */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -right-4 top-1/4 p-3 rounded-lg bg-card border border-border/50 shadow-xl"
      >
        <div className="text-[10px] text-muted-foreground mb-1">Carbon Price</div>
        <div className="text-sm font-bold">$85.40</div>
        <div className="text-[9px] text-emerald-500">+2.4%</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="absolute -left-4 bottom-1/4 p-3 rounded-lg bg-card border border-border/50 shadow-xl"
      >
        <div className="text-[10px] text-muted-foreground mb-1">TCFD Status</div>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium">Aligned</span>
        </div>
      </motion.div>
    </div>
  );
}
