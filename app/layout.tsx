import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth-context";
import { MonitoringProvider } from "@/components/monitoring-provider";
import type { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Iora - Climate Intelligence",
  description: "Enterprise-grade carbon analytics and climate risk analysis",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <AuthProvider>
            <MonitoringProvider>
              {children}
            </MonitoringProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
