"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Moon, Sun, Search, Settings, LogOut, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function DashboardHeader({ onOpenMobileSidebar = () => {} }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenMobileSidebar}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative w-full max-w-md min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search metrics, reports, settings..."
              className="pl-10 bg-muted/50 border-border/50 h-9"
            />
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    JS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">john@acmecorp.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
