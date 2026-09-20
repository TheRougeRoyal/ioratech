import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const base = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 [&_svg]:shrink-0"
    const variants = {
      default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200",
      outline: "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900",
      ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-900",
    }
    const sizes = {
      default: "h-9 px-4 text-sm [&_svg]:size-4",
      sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
      lg: "h-11 px-6 text-base [&_svg]:size-5",
    }
    // Only pass type prop to actual button elements, not to Slot
    const buttonProps = asChild ? {} : { type };
    return <Comp ref={ref} {...buttonProps} className={cn(base, variants[variant], sizes[size], className)} {...props} />;
  }
)
Button.displayName = "Button"

export { Button }
