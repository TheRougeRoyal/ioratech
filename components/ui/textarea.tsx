import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
