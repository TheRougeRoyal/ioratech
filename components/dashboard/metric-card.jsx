"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MetricCard({ title, value, unit, change, changeType, icon: Icon, description }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-900/50 dark:to-slate-900 hover:shadow-lg transition-all duration-200 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {title}
          </CardTitle>
          {Icon && (
            <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
            {unit && <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{unit}</span>}
          </div>
          <div className="flex items-center space-x-2">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                  changeType === "positive" && "text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300",
                  changeType === "negative" && "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300",
                  changeType === "neutral" && "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {changeType === "positive" && <TrendingDown className="h-3 w-3 mr-1" />}
                {changeType === "negative" && <TrendingUp className="h-3 w-3 mr-1" />}
                {changeType === "neutral" && <Minus className="h-3 w-3 mr-1" />}
                {change}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-600 dark:text-slate-400">{description}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
