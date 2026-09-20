import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">API Reference</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Integrate Iora Climate Intelligence into your applications and workflows.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Authentication</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                API key authentication. Generate keys from your dashboard settings.
              </p>
              <div className="mt-3 p-3 rounded-lg bg-muted/50 font-mono text-xs">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Endpoints</h2>
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">GET</span>
                  <code className="text-xs font-mono">/api/v1/emissions</code>
                  <span className="text-xs text-muted-foreground">List emissions data</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">GET</span>
                  <code className="text-xs font-mono">/api/v1/risk-scores</code>
                  <span className="text-xs text-muted-foreground">Get risk assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500">POST</span>
                  <code className="text-xs font-mono">/api/v1/scenarios</code>
                  <span className="text-xs text-muted-foreground">Run scenario simulation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">GET</span>
                  <code className="text-xs font-mono">/api/v1/reports</code>
                  <span className="text-xs text-muted-foreground">Generate compliance report</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Rate Limits</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional plan: 1,000 requests/hour. Enterprise: unlimited.
                Contact sales for higher limits.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
