import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Have questions about Iora Technology or want to discuss a partnership?
            We'd love to hear from you.
          </p>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">General Inquiries</h2>
              <p className="text-sm text-muted-foreground mb-3">
                For general questions about our platform and services.
              </p>
              <a
                href="mailto:aakashr@lysandragroup.com"
                className="text-sm font-medium hover:underline"
              >
                aakashr@lysandragroup.com
              </a>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Sales</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Interested in enterprise plans or custom integrations?
              </p>
              <a
                href="mailto:aakashr@lysandragroup.com"
                className="text-sm font-medium hover:underline"
              >
                aakashr@lysandragroup.com
              </a>
            </div>

            <div className="p-6 rounded-xl border border-border/50 bg-card">
              <h2 className="text-lg font-semibold mb-2">Support</h2>
              <p className="text-sm text-muted-foreground mb-3">
                Need help with your account or the platform?
              </p>
              <a
                href="mailto:aakashr@lysandragroup.com"
                className="text-sm font-medium hover:underline"
              >
                aakashr@lysandragroup.com
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
