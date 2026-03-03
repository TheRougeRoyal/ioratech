import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Iora — Operational Climate Intelligence Platform",
  description: "Enterprise-grade carbon analytics, climate risk forecasting, and regulatory foresight for corporations, investment funds, and policy institutions.",
  keywords: "carbon analytics, climate risk, ESG reporting, carbon footprint, regulatory compliance, TCFD, CSRD, sustainability",
  openGraph: {
    title: "Iora — Operational Climate Intelligence Platform",
    description: "Enterprise-grade carbon analytics, climate risk forecasting, and regulatory foresight.",
    type: "website",
    siteName: "Iora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iora — Operational Climate Intelligence Platform",
    description: "Enterprise-grade carbon analytics, climate risk forecasting, and regulatory foresight.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
