import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            Insights on climate intelligence, regulatory developments, and strategic sustainability.
          </p>

          <div className="space-y-8">
            {[
              {
                title: "Coming Soon",
                date: "TBD",
                excerpt: "Our blog is launching soon. Stay tuned for deep dives on climate risk modeling, ESG reporting frameworks, and enterprise sustainability strategy.",
              },
            ].map((post) => (
              <article
                key={post.title}
                className="p-6 rounded-xl border border-border/50 bg-card"
              >
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  {post.date}
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
