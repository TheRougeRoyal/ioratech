import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Leaf, ShieldCheck } from "lucide-react";

export function Footer() {
  const footerLinks = {
    services: [
      { label: "Water Quality & Hydrogeology", href: "/#services" },
      { label: "Soil & Aquifer Remediation", href: "/#services" },
      { label: "Air Quality Permitting", href: "/#services" },
      { label: "Hazardous Waste Management", href: "/#services" },
      { label: "Phase I & II Site Assessments", href: "/#services" },
    ],
    sectors: [
      { label: "Industrial & Manufacturing", href: "/#sectors" },
      { label: "Energy & Utilities", href: "/#sectors" },
      { label: "Commercial Real Estate", href: "/#sectors" },
      { label: "Civil Infrastructure", href: "/#sectors" },
      { label: "Municipalities", href: "/#sectors" },
    ],
    company: [
      { label: "About Ioratech", href: "/about" },
      { label: "Engineering Careers", href: "/careers" },
      { label: "Contact Field Offices", href: "/#contact" },
      { label: "Technical Blog", href: "/blog" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Environmental Health & Safety", href: "/security" },
      { label: "Data Protection Agreement", href: "/dpa" },
    ],
  };

  return (
    <footer className="border-t border-border bg-muted/40 text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight">IORATECH</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Full-service environmental engineering, compliance auditing, and field remediation firm. Trusted by Fortune 500 industrial leaders and public agencies.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] font-semibold text-muted-foreground px-2 py-1 rounded bg-muted border border-border">ISO 14001</span>
              <span className="text-[10px] font-semibold text-muted-foreground px-2 py-1 rounded bg-muted border border-border">ISO 45001</span>
              <span className="text-[10px] font-semibold text-muted-foreground px-2 py-1 rounded bg-muted border border-border">NELAP LAB</span>
              <span className="text-[10px] font-semibold text-muted-foreground px-2 py-1 rounded bg-muted border border-border">ASTM E1527-21</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-foreground">Core Services</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-foreground">Sectors</h4>
            <ul className="space-y-2.5">
              {footerLinks.sectors.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-foreground">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-4 text-foreground">Governance & Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Iora Environmental Technologies, Inc. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Ioratech is a subsidiary of Lysandra Group of Companies.
              </p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Licensed Engineering Firm • EPA Region 6 HQ
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground/70 max-w-5xl">
            Disclaimer: Information provided on this website is intended for general informational and preliminary engineering evaluation purposes. Formal environmental site assessments, regulatory permit applications, and remediation design reports require site-specific sampling and direct execution under the supervision of a Licensed Professional Engineer (PE) or Professional Geologist (PG). Iora Environmental Technologies, Inc. and its parent Lysandra Group disclaim liability for decisions made prior to formal engineering engagement.
          </p>
        </div>
      </div>
    </footer>
  );
}
