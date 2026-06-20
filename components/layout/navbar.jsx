"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#capabilities", label: "Capabilities" },
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#industries", label: "Industries" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground dark:bg-primary transition-transform group-hover:scale-105">
            <span className="text-xs font-bold text-background dark:text-primary-foreground">I</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">Iora</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-md"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
          
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" size="sm" className="h-8 rounded-md font-medium text-xs">
              Sign In
            </Button>
          </Link>
          <Link href="/request-access" className="hidden md:block">
            <Button size="sm" className="h-8 rounded-md font-medium text-xs px-3 bg-foreground text-background hover:bg-foreground/90">
              Request Access
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 md:hidden border-b border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="p-4 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2 border-t border-border/40 mt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start rounded-md h-9 text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/request-access" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-md h-9 text-xs bg-foreground text-background hover:bg-foreground/90">
                  Request Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
