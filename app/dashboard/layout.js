"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      <div className={cn("transition-all duration-200", "pl-0 lg:pl-64")}>
        <DashboardHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-4 sm:p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
