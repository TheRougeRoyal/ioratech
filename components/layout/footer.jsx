import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const footerLinks = {
    platform: [
      { label: "Carbon Analytics", href: "/dashboard" },
      { label: "Risk Forecasting", href: "/dashboard/risk-analysis" },
      { label: "Scenario Modeling", href: "/dashboard/scenario-simulator" },
      { label: "Compliance Monitor", href: "/dashboard/compliance" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-docs" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Status", href: "/status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "DPA", href: "/dpa" },
    ],
  };

  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight">IORATECH</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Operational climate intelligence for strategic decision-making. Built for enterprises.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <span className="text-[10px] font-medium text-muted-foreground px-2 py-1 rounded bg-muted">SOC 2</span>
              <span className="text-[10px] font-medium text-muted-foreground px-2 py-1 rounded bg-muted">GDPR</span>
              <span className="text-[10px] font-medium text-muted-foreground px-2 py-1 rounded bg-muted">ISO 27001</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Iora Technologies, Inc. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Ioratech is a subsidiary of Lysandra Group of Companies.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Climate intelligence infrastructure for the enterprise.
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground/70 max-w-4xl">
            The information provided on this platform is for general informational purposes only and does not constitute professional, financial, legal, or environmental advice. All data, analytics, forecasts, and reports generated through Ioratech are based on models, algorithms, and third-party data sources which may contain inaccuracies or omissions. Iora Technologies, Inc. makes no warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of any information, data, or outputs provided through this platform. Users are solely responsible for verifying any outputs and relying on them at their own risk. Iora Technologies, Inc., its parent company Lysandra Group of Companies, and their respective officers, directors, employees, agents, and affiliates shall not be held liable for any direct, indirect, incidental, consequential, special, or punitive damages, losses, or expenses arising from or in connection with the use of, or reliance on, any content, data, or services provided through this platform. Past performance of any model or forecast is not indicative of future results. Carbon metrics, risk assessments, and compliance indicators are provided as estimates and should be independently validated before use in regulatory filings, investment decisions, or corporate reporting. This platform may contain links to third-party websites or services; Iora Technologies, Inc. assumes no responsibility for the content, privacy practices, or policies of any third parties. By accessing or using this platform, you acknowledge and agree to these terms and disclaimers.
          </p>
        </div>
      </div>
    </footer>
  );
}
