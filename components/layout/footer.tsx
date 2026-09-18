import Link from "next/link";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Leaf className="h-3 w-3" />
          </div>
          <span className="font-medium">© {new Date().getFullYear()} Iora Climate Technologies, Inc.</span>
        </div>
        <div className="flex items-center gap-8 flex-wrap justify-center font-medium">
          <Link href="/product" className="hover:text-primary transition-colors">Product</Link>
          <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/login" className="hover:text-primary transition-colors">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
