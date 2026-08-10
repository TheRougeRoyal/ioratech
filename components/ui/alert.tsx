import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "border p-3 text-sm",
        variant === "destructive"
          ? "border-red-600 text-red-600"
          : "border-neutral-300 dark:border-neutral-700",
        className
      )}
      {...props}
    />
  )
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("leading-relaxed", className)} {...props} />
  )
)
AlertDescription.displayName = "AlertDescription"

const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("font-medium mb-1", className)} {...props} />
  )
)
AlertTitle.displayName = "AlertTitle"

export { Alert, AlertTitle, AlertDescription }
