"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Sliders,
  FileText,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Carbon Metrics", href: "/dashboard/carbon-metrics", icon: Activity },
  { title: "Risk Analysis", href: "/dashboard/risk-analysis", icon: AlertTriangle },
  { title: "Scenario Simulator", href: "/dashboard/scenario-simulator", icon: Sliders },
  { title: "Compliance Monitor", href: "/dashboard/compliance", icon: Shield },
  { title: "Reports", href: "/dashboard/reports", icon: FileText },
];

export function DashboardSidebar({ mobileOpen = false, onMobileOpenChange = () => {} }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const renderNav = (isCollapsed, isMobile = false) => (
    <nav className="p-2 space-y-1">
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href;
        const NavButton = (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              if (isMobile) {
                onMobileOpenChange(false);
              }
            }}
          >
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full relative overflow-hidden",
                  isCollapsed ? "justify-center px-2" : "justify-start px-3",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId={isMobile ? "activeTabMobile" : "activeTabDesktop"}
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-sidebar-primary"
                  />
                )}
                <link.icon className={cn("h-4 w-4 flex-shrink-0", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && <span className="truncate">{link.title}</span>}
              </Button>
            </motion.div>
          </Link>
        );

        if (isCollapsed) {
          return (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {link.title}
              </TooltipContent>
            </Tooltip>
          );
        }
        return NavButton;
      })}
    </nav>
  );

  const renderContent = (isCollapsed, isMobile = false) => (
    <>
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2.5"
            >
              <Link
                href="/"
                className="flex items-center space-x-2.5"
                onClick={() => {
                  if (isMobile) {
                    onMobileOpenChange(false);
                  }
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-sidebar-primary-foreground">I</span>
                </div>
                <span className="text-lg font-semibold text-sidebar-foreground">Iora</span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto"
            >
              <Link href="/">
                <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-sidebar-primary-foreground">I</span>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">{renderNav(isCollapsed, isMobile)}</ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-sidebar-border bg-sidebar">
        <div className="space-y-1">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  onClick={() => {
                    if (isMobile) {
                      onMobileOpenChange(false);
                    }
                  }}
                >
                  <Button
                    variant={pathname.startsWith("/dashboard/settings") ? "secondary" : "ghost"}
                    className="w-full justify-center px-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/settings"
              onClick={() => {
                if (isMobile) {
                  onMobileOpenChange(false);
                }
              }}
            >
              <Button
                variant={pathname.startsWith("/dashboard/settings") ? "secondary" : "ghost"}
                className="w-full justify-start px-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </Link>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              className={cn(
                "w-full text-sidebar-foreground hover:bg-sidebar-accent/50",
                isCollapsed ? "justify-center px-2" : "justify-start px-3"
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-3" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-screen border-r border-sidebar-border bg-sidebar z-40 hidden lg:block"
      >
        {renderContent(collapsed)}
      </motion.aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-r border-sidebar-border z-50">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Dashboard navigation menu</SheetDescription>
          </SheetHeader>
          <div className="relative h-screen">{renderContent(false, true)}</div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
