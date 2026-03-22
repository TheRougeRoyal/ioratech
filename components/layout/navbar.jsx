"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center w-full px-4"
    >
      <nav className={`flex items-center justify-between w-full max-w-5xl px-4 md:px-6 h-14 rounded-full border transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          : "bg-background/40 backdrop-blur-md border-border/20 shadow-sm"
      }`}>
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground dark:bg-primary transition-transform group-hover:scale-105">
            <span className="text-sm font-bold text-background dark:text-primary-foreground">I</span>
          </div>
          <span className="text-base font-medium tracking-tight">Iora</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-[1.1rem] left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-full"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          )}
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" size="sm" className="h-8 rounded-full font-medium text-sm">
              Sign In
            </Button>
          </Link>
          <Link href="/request-access" className="hidden md:block">
            <Button size="sm" className="h-8 rounded-full font-medium text-sm px-4">
              Access
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-20 left-4 right-4 md:hidden border border-border/60 bg-background/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2 mt-2 border-t border-border/50">
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start rounded-lg h-10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/request-access">
                  <Button className="w-full rounded-lg h-10">Request Access</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
