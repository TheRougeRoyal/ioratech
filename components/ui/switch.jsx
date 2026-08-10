"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-teal-700 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-700",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb className="pointer-events-none block h-4 w-4 bg-white transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5" />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
