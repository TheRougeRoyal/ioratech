"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className={cn("transition-all duration-200 ease-in-out", "lg:pl-64")}>
        <DashboardHeader onMenuToggle={() => setSidebarOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="p-4 sm:p-6 lg:p-8 max-w-[1400px]"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
