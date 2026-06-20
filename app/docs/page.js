import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DocsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Documentation</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Guides, references, and tutorials for the Iora Climate Intelligence platform.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your data sources, configure your account, and generate your first emissions report.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Carbon Metrics</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track Scope 1, 2, and 3 emissions across your operations and supply chain.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Risk Analysis</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Quantify physical and transition climate risks using NGFS scenarios.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Scenario Simulator</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Model financial impacts of decarbonization pathways and policy scenarios.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Compliance & Reporting</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate audit-ready reports aligned with TCFD, CSRD, SEC, and other frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
