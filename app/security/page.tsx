import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Lock,
  ShieldCheck,
  Users,
  AlertTriangle,
  Globe,
  Sword,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    Icon: Lock,
    title: "Data Encryption",
    badge: "AES-256 · TLS 1.3",
    description:
      "All customer data stored on IORA's infrastructure is encrypted at rest using AES-256. Data in transit between your browser, our APIs, and our data stores is protected by TLS 1.3 — the most current and secure version of the protocol. We enforce HSTS with a multi-year max-age and preload entry, ensuring no unencrypted connections are ever accepted.",
    points: [
      "AES-256-GCM encryption for all data at rest",
      "TLS 1.3 enforced for all data in transit",
      "HSTS preloaded — no cleartext HTTP ever accepted",
      "Encryption keys managed via a hardware security module (HSM)",
      "Separate encryption contexts for each customer tenant",
    ],
  },
  {
    Icon: Users,
    title: "Access Control",
    badge: "RBAC · SSO",
    description:
      "IORA uses role-based access control (RBAC) to ensure every user sees only the data and actions appropriate for their role. Enterprise customers can enforce single sign-on via SAML 2.0 or OIDC, integrating with identity providers including Okta, Azure AD, and Google Workspace. Multi-factor authentication is available to all plans and required for administrative roles.",
    points: [
      "Granular RBAC with built-in roles: Viewer, Analyst, Editor, Admin",
      "SAML 2.0 and OIDC SSO for enterprise plans",
      "TOTP and hardware-key MFA enforced for admin roles",
      "Session expiry and idle timeout controls",
      "Audit log of every login, permission change, and data export",
    ],
  },
  {
    Icon: ShieldCheck,
    title: "Compliance Certifications",
    badge: "SOC 2 · GDPR · CCPA",
    description:
      "We hold ourselves to the same rigorous standards we help our customers meet. IORA's SOC 2 Type II audit is currently underway with an independent Big 4 auditor. Our GDPR and CCPA compliance programmes are certified and actively maintained. We publish a Data Processing Agreement (DPA) for all customers and a current sub-processor list.",
    points: [
      "SOC 2 Type II audit in progress (completion Q1 2027)",
      "GDPR Article 28 Data Processing Agreement available",
      "CCPA service provider addendum available on request",
      "Sub-processor inventory published and updated quarterly",
      "Annual third-party privacy audit",
    ],
  },
  {
    Icon: AlertTriangle,
    title: "Incident Response",
    badge: "24 h SLA",
    description:
      "In the event of a security incident, IORA's incident response team operates around the clock. We commit to acknowledging confirmed incidents within 4 hours, notifying affected customers within 24 hours, and providing a full post-incident report within 5 business days. Our incident response playbook is reviewed and rehearsed quarterly.",
    points: [
      "24 / 7 security operations monitoring",
      "4-hour acknowledgement SLA for confirmed incidents",
      "24-hour customer notification for data-affecting events",
      "5-business-day post-incident report",
      "Quarterly tabletop exercises and playbook reviews",
    ],
  },
  {
    Icon: Sword,
    title: "Penetration Testing",
    badge: "Annual · Third-party",
    description:
      "IORA commissions an independent penetration test from a CREST-certified security firm at least once per year, and additionally after any major infrastructure change. Internal security engineering runs automated vulnerability scans continuously. Findings are triaged, prioritised by CVSS score, and remediated within defined SLAs — critical findings within 24 hours.",
    points: [
      "Annual external penetration test by CREST-certified firm",
      "Continuous automated vulnerability scanning",
      "CVSS-based triage with defined remediation SLAs",
      "Critical vulnerabilities patched within 24 hours",
      "Test reports available to enterprise customers under NDA",
    ],
  },
  {
    Icon: Globe,
    title: "Data Residency",
    badge: "EU · US",
    description:
      "IORA offers customer-configurable data residency in the European Union (AWS eu-west-1, Frankfurt) or the United States (AWS us-east-1, Virginia). Choosing EU residency ensures all primary data storage, processing, and backups remain within the EEA — important for GDPR Article 44 cross-border transfer restrictions. Data residency is set at account creation and is immutable thereafter.",
    points: [
      "EU residency: AWS Frankfurt (eu-west-1) — GDPR Article 44 compliant",
      "US residency: AWS N. Virginia (us-east-1)",
      "Backups stored in the same jurisdiction as primary data",
      "No cross-region replication without explicit customer consent",
      "Residency documented in your DPA and architecture report",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="border-b border-border bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6">
              Security
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Security is a first principle, not an afterthought.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your emissions data is sensitive, your regulatory filings are
              consequential, and your auditors demand a full chain of evidence.
              Here is exactly how IORA protects the information you trust us
              with.
            </p>
          </div>
        </section>

        {/* ── Quick trust bar ── */}
        <section className="border-b border-border bg-muted/20 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                "AES-256 encryption at rest",
                "TLS 1.3 in transit",
                "RBAC & SSO",
                "SOC 2 Type II in progress",
                "GDPR & CCPA certified",
                "Annual pen test",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Security sections ── */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
            {sections.map((s) => (
              <div
                key={s.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-border pb-16 last:border-0 last:pb-0"
              >
                <div className="md:col-span-4 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <s.Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{s.title}</h2>
                  <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                    {s.badge}
                  </span>
                </div>
                <div className="md:col-span-8 space-y-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {s.description}
                  </p>
                  <ul className="space-y-2">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-border bg-muted/20 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
              Have a specific security question?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              Our security team is happy to answer detailed questions about our
              architecture, share penetration test executive summaries under NDA,
              and complete your vendor security questionnaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:security@ioratech.io"
                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:scale-105"
              >
                Email security team
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                General contact
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
