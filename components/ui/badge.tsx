import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
  primary: "border-teal-700 text-teal-700 dark:border-teal-400 dark:text-teal-400",
  destructive: "border-red-600 text-red-600",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center border px-2 py-0.5 text-xs font-medium", badgeVariants[variant], className)}
      {...props}
    />
  )
}

export { Badge }
