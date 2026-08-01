import { Building2, TrendingUp, Landmark, Factory } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Corporations",
    description:
      "Track and reduce emissions across operations and supply chains. Meet disclosure requirements and stakeholder expectations.",
    features: ["Supply chain emissions", "Net-zero pathway planning", "Board-ready reporting"],
  },
  {
    icon: TrendingUp,
    title: "Investment Funds",
    description:
      "Assess climate risk exposure across portfolios. Integrate ESG factors into investment decisions with quantitative rigor.",
    features: ["Portfolio carbon footprint", "Climate VaR analysis", "Engagement tracking"],
  },
  {
    icon: Landmark,
    title: "Policy Institutions",
    description:
      "Model policy impacts and track regulatory effectiveness. Support evidence-based climate policy development.",
    features: ["Policy impact modeling", "Cross-jurisdiction analysis", "Scenario comparisons"],
  },
  {
    icon: Factory,
    title: "Infrastructure Operators",
    description:
      "Manage physical climate risks to assets and operations. Plan resilient infrastructure investments.",
    features: ["Asset-level risk mapping", "Adaptation planning", "Insurance optimization"],
  },
];

export function AudienceSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Decision Makers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by organizations that require institutional-grade climate data
            and analytics for strategic planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className="group p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 hover:border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <audience.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{audience.title}</h3>
                  <p className="text-muted-foreground mb-4">{audience.description}</p>
                  <ul className="space-y-2">
                    {audience.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
