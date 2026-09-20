"use client";
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50",
          description: "text-neutral-500 dark:text-neutral-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
