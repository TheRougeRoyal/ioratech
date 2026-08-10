import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
