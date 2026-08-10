import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const base = "inline-flex items-center justify-center h-9 px-4 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"
    const variants = {
      default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200",
      outline: "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900",
      ghost: "px-2 hover:bg-neutral-100 dark:hover:bg-neutral-900",
    }
    return <Comp ref={ref} className={cn(base, variants[variant], className)} {...props} />
  }
)
Button.displayName = "Button"

export { Button }
