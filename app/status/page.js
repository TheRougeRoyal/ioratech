import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function StatusPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">System Status</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Current operational status of all Iora platform services.
          </p>

          <div className="space-y-3">
            {[
              { name: "Platform", status: "Operational", color: "bg-emerald-500" },
              { name: "API", status: "Operational", color: "bg-emerald-500" },
              { name: "Carbon Metrics Engine", status: "Operational", color: "bg-emerald-500" },
              { name: "Risk Analysis Engine", status: "Operational", color: "bg-emerald-500" },
              { name: "Scenario Simulator", status: "Operational", color: "bg-emerald-500" },
              { name: "Report Generation", status: "Operational", color: "bg-emerald-500" },
              { name: "Data Ingestion", status: "Operational", color: "bg-emerald-500" },
              { name: "Authentication", status: "Operational", color: "bg-emerald-500" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card"
              >
                <span className="text-sm font-medium">{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${service.color}`} />
                  <span className="text-xs text-muted-foreground">{service.status}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            For real-time updates, check back here or subscribe to our status page notifications.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
