import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">About Iora Technologies</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Iora Technologies provides enterprise-grade climate intelligence infrastructure.
            We help organizations measure, manage, and report on climate risk with institutional rigor.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make climate risk measurable, manageable, and actionable for every organization
                making strategic decisions in a carbon-constrained world.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">What We Build</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform combines automated emissions accounting, climate risk forecasting,
                and regulatory monitoring into a single intelligence layer. We serve corporations,
                investment funds, infrastructure operators, and public sector institutions
                across 190+ jurisdictions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Our Standards</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every calculation is traceable and reproducible. Our methodology is aligned with
                GHG Protocol, PCAF, and ISSB standards, and independently verified by leading
                assurance providers. We maintain SOC 2, GDPR, and ISO 27001 compliance.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
