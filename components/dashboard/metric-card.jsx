"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MetricCard({ title, value, unit, change, changeType, icon: Icon, description }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-200 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          <div className="flex items-center mt-2 space-x-2">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded",
                  changeType === "positive" && "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
                  changeType === "negative" && "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
                  changeType === "neutral" && "text-muted-foreground bg-muted"
                )}
              >
                {changeType === "positive" && <TrendingDown className="h-3 w-3 mr-1" />}
                {changeType === "negative" && <TrendingUp className="h-3 w-3 mr-1" />}
                {changeType === "neutral" && <Minus className="h-3 w-3 mr-1" />}
                {change}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
