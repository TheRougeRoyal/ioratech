"use client";

import { TrendingDown, AlertTriangle, Shield, Activity, Zap } from "lucide-react";

const miniChartData = [45, 42, 48, 44, 38, 42, 35, 32, 38, 34, 30, 28];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="relative bg-card rounded-xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center space-x-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Iora Dashboard</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="p-4 space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Emissions Card */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/80 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total Emissions</span>
                <Activity className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold tracking-tight">124,500 <span className="text-xs font-normal text-muted-foreground font-mono">tCO2e</span></div>
              <div className="flex items-center text-[10px] text-emerald-500 font-mono mt-1">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                -12.3% YOY
              </div>
            </div>

            {/* Risk Score Card */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/80 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Risk Score</span>
                <AlertTriangle className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-xl font-bold tracking-tight">Medium</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-1">52 / 100 points</div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Emissions Trend</span>
              <span className="text-[9px] text-muted-foreground font-mono">Last 12 months</span>
            </div>
            <div className="flex items-end justify-between h-16 gap-1">
              {miniChartData.map((value, i) => (
                <div
                  key={i}
                  style={{ height: `${value}%` }}
                  className="flex-1 bg-muted-foreground/20 rounded-sm hover:bg-muted-foreground/45 transition-colors cursor-pointer group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none font-mono">
                    {value}%
                  </div>
                </div>
              ))}
            </div>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-[8px] text-muted-foreground font-mono uppercase tracking-wider">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-border/80 transition-colors group cursor-pointer">
            <div className="flex items-center space-x-2">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Compliance Status</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500">4 / 4 Aligned</span>
            </div>
          </div>

          {/* Mini activity feed */}
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
              <span>Recent Activity</span>
              <span className="text-[9px] text-emerald-500">Live</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { text: "Data sync completed", time: "2m ago", color: "bg-emerald-500" },
                { text: "New report generated", time: "15m ago", color: "bg-muted-foreground" },
                { text: "Alert threshold updated", time: "1h ago", color: "bg-muted-foreground" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[9px] font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                  <span className="text-muted-foreground/60">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
