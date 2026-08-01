"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, ShieldCheck, PhoneCall, Leaf } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/#services", label: "Services & Capabilities" },
    { href: "/#methodology", label: "Our Approach" },
    { href: "/#sectors", label: "Sectors Served" },
    { href: "/#compliance", label: "Compliance & Safety" },
    { href: "/#contact", label: "Contact Us" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-all duration-300">
      {/* Top emergency / quick contact bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-sans">
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO 14001 & ISO 45001 Certified Environmental Engineering
            </span>
            <span className="text-primary-foreground/70">|</span>
            <span className="text-primary-foreground/90">24/7 Emergency Spill Response: 1-800-555-IORA</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-primary-foreground/90">HQ: Houston, TX • Operates Nationwide</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="h-9 w-9 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground font-sans leading-none">
              IORATECH
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
              Environmental Services
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-md border-border"
              title="Toggle Theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
            </Button>
          )}
          
          <Link href="/#contact" className="hidden sm:block">
            <Button size="sm" className="h-9 rounded-md font-semibold text-xs px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              Request Consultation
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden h-9 w-9 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 lg:hidden border-b border-border bg-background/98 backdrop-blur-xl shadow-lg">
          <div className="p-5 space-y-3 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold uppercase tracking-wider text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border mt-2">
              <Link href="/#contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-md h-10 text-xs font-semibold bg-primary text-primary-foreground">
                  Request Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
