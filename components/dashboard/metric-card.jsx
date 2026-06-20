import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MetricCard({ title, value, unit, change, changeType, icon: Icon, description }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {(change || description) && (
          <div className="mt-2 flex items-center gap-1.5">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium",
                  changeType === "positive" && "text-emerald-600 dark:text-emerald-400",
                  changeType === "negative" && "text-red-600 dark:text-red-400",
                  changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {changeType === "positive" && <TrendingDown className="h-3 w-3 mr-0.5" />}
                {changeType === "negative" && <TrendingUp className="h-3 w-3 mr-0.5" />}
                {changeType === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
                {change}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
