"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Leaf, Sun, Moon, Lock } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border bg-card hover:bg-muted transition-colors relative"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
    </button>
  );
}

export function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight">IORA</span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground mt-0.5">
              Climate Intelligence
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <Link href="/product" className="hover:text-foreground transition-colors">Product</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <Lock className="h-4 w-4" />
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center h-9 px-4 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:scale-105"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
