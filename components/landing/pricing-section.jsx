"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Explore",
    description: "For teams evaluating climate intelligence needs",
    price: "Free",
    period: "",
    features: [
      "Scope 1 & 2 calculator",
      "Basic emissions dashboard",
      "TCFD overview report",
      "2 user seats",
      "Community support",
    ],
    cta: "Get Started",
    href: "/request-access",
    popular: false,
    variant: "outline",
  },
  {
    name: "Professional",
    description: "For mid-market companies with active programs",
    price: "Request Pricing",
    period: "",
    features: [
      "Full Scope 1, 2, & 3 tracking",
      "Scenario analysis (3 scenarios)",
      "TCFD, CDP, GRI reporting",
      "10 user seats",
      "Dedicated support",
      "API access",
      "Quarterly reviews",
    ],
    cta: "Request Pricing",
    href: "/contact",
    popular: true,
    variant: "default",
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex operations",
    price: "Talk to Sales",
    period: "",
    features: [
      "Everything in Professional",
      "Unlimited scenarios",
      "All regulatory frameworks",
      "Unlimited users",
      "Custom integrations",
      "Dedicated success manager",
      "SLA with 99.9% uptime",
      "On-premise option",
    ],
    cta: "Talk to Sales",
    href: "/contact",
    popular: false,
    variant: "outline",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden bg-background border-b border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Start with the right level of support</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Most teams begin with a short discovery phase, then choose a plan based on reporting scope,
            data complexity, and team size.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="relative h-full">
              <Card
                className={`h-full flex flex-col justify-between rounded-xl border ${
                  plan.popular
                    ? "border-foreground shadow-sm bg-card"
                    : "border-border/50 bg-card/60"
                }`}
              >
                <div>
                  <CardHeader className="pt-8">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl tracking-tight">{plan.name}</CardTitle>
                      {plan.popular && (
                        <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wider bg-foreground text-background">Most Popular</Badge>
                      )}
                    </div>
                    <CardDescription className="min-h-[40px] text-sm mt-1">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-2 text-xs font-mono">{plan.period}</span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-foreground mt-0.5 mr-3 shrink-0" />
                          <span className="leading-normal">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
                <CardFooter className="pt-6 pb-8">
                  <Link href={plan.href} className="w-full">
                    <Button
                      className="w-full rounded-md h-10 text-xs font-medium"
                      variant={plan.variant}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
