import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SecurityPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Security</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            How we protect your data and ensure the integrity of our platform.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Compliance</h2>
              <div className="flex flex-wrap gap-3">
                {["SOC 2 Type II", "GDPR", "ISO 27001"].map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 rounded-lg border border-border/50 bg-card text-xs font-mono"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Data Protection</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  AES-256 encryption at rest
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  TLS 1.3 encryption in transit
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Regular penetration testing
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Automated vulnerability scanning
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Infrastructure</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA.
                All data is backed up daily with 30-day retention.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Report a Vulnerability</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you discover a security issue, please email{" "}
                <a href="mailto:aakashr@lysandragroup.com" className="hover:underline">
                  aakashr@lysandragroup.com
                </a>{" "}
                with details. We take all reports seriously and will respond within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
