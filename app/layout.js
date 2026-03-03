import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Iora - Climate Intelligence for Strategic Decision-Making",
  description: "Enterprise-grade carbon analytics, climate risk forecasting, and regulatory foresight for corporations, investment funds, and policy institutions.",
  keywords: "carbon analytics, climate risk, ESG reporting, carbon footprint, regulatory compliance, TCFD, CSRD, sustainability",
  openGraph: {
    title: "Iora - Climate Intelligence Platform",
    description: "Enterprise-grade carbon analytics and regulatory foresight",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
