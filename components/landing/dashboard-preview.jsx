"use client";

import { TrendingDown, AlertTriangle, Shield, Activity } from "lucide-react";

const miniChartData = [45, 42, 48, 44, 38, 42, 35, 32, 38, 34, 30, 28];

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="text-xs text-muted-foreground font-medium">Iora Dashboard</div>
          <div className="w-16" />
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Total Emissions</span>
                <Activity className="h-3 w-3 text-primary" />
              </div>
              <div className="text-lg font-bold">124,500</div>
              <div className="flex items-center text-[10px] text-emerald-500">
                <TrendingDown className="h-2.5 w-2.5 mr-1" />
                -12.3% YoY
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium text-muted-foreground">Risk Score</span>
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-lg font-bold">Medium</div>
              <div className="text-[10px] text-muted-foreground">52/100 pts</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-medium">Emissions Trend</span>
              <span className="text-[9px] text-muted-foreground">Last 12 months</span>
            </div>
            <div className="flex items-end justify-between h-16 gap-1">
              {miniChartData.map((value, i) => (
                <div
                  key={i}
                  style={{ height: `${value}%` }}
                  className="flex-1 bg-primary/30 rounded-sm"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium">Compliance Status</span>
            </div>
            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">4/4 Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
