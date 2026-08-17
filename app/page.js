"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Leaf, Sun, Moon, Play, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="h-9 w-9 inline-flex items-center justify-center border border-border bg-card hover:bg-muted transition-colors"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-teal-400" />
    </button>
  );
}

export default function HomePage() {
  const { startDemo } = useAuth();
  const router = useRouter();

  const enterDemo = () => {
    startDemo();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">IORA</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
                Climate Intelligence
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Public preview · Built on GHG Protocol
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
            Climate intelligence,{" "}
            <span className="text-primary">ready in minutes.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Track emissions, model physical and transition risk, and produce
            audit-ready reports. Walk through the live demo, or sign in to
            load your account.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <button
              onClick={enterDemo}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-colors group"
            >
              <Play className="h-4 w-4 fill-current" />
              Try the live demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-semibold rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              <Lock className="h-4 w-4" />
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-3.5 w-3.5" />
            <span>© {new Date().getFullYear()} Iora Climate Technologies, Inc.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/product" className="hover:text-primary transition-colors">Product</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
