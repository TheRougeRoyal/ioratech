"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
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
    popular: false,
    variant: "outline",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Start with the right level of support</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most teams begin with a short discovery phase, then choose a plan based on reporting scope,
            data complexity, and team size.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card
                className={`h-full flex flex-col ${
                  plan.popular
                    ? "border-primary"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-2 text-sm">{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <Link href="/request-access" className="w-full">
                    <Button
                      className="w-full"
                      variant={plan.variant}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
