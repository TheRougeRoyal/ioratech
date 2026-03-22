"use client";

import { TrendingDown, AlertTriangle, Shield, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

const miniChartData = [45, 42, 48, 44, 38, 42, 35, 32, 38, 34, 30, 28];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Iora Dashboard</span>
          </div>
          <div className="w-16" />
        </div>

        <div className="p-5 space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Emissions Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/30 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Total Emissions</span>
                <Activity className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-lg font-bold">124,500</div>
              <div className="flex items-center text-[10px] text-emerald-500">
                <TrendingDown className="h-2.5 w-2.5 mr-1" />
                -12.3% YoY
              </div>
            </motion.div>

            {/* Risk Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-3 rounded-lg bg-muted/50 border border-border/30 hover:border-amber-500/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Risk Score</span>
                <AlertTriangle className="h-3 w-3 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-lg font-bold">Medium</div>
              <div className="text-[10px] text-muted-foreground">52/100 pts</div>
            </motion.div>
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.05,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="flex-1 bg-gradient-to-t from-primary/40 to-primary/20 rounded-sm hover:from-primary/60 hover:to-primary/40 transition-all cursor-pointer group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
                    {value}%
                  </div>
                </motion.div>
              ))}
            </div>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-[8px] text-muted-foreground">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </motion.div>

          {/* Compliance Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors group cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-4 w-4 text-emerald-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/30 rounded-full blur-sm"
                />
              </div>
              <span className="text-xs font-medium">Compliance Status</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">4/4 Aligned</span>
              <Zap className="h-3 w-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Mini activity feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-2 border-t border-border/30"
          >
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Recent Activity</span>
              <span className="text-[9px]">Live</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { text: "Data sync completed", time: "2m ago", color: "bg-emerald-500" },
                { text: "New report generated", time: "15m ago", color: "bg-blue-500" },
                { text: "Alert threshold updated", time: "1h ago", color: "bg-amber-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center justify-between text-[9px]"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                  <span className="text-muted-foreground/60">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
