"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Globe, Heart, Users, Zap, Star } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl mb-6">
            Help us build the future of <br className="hidden sm:block" /> climate intelligence.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-8">
            We're a small, focused team of engineers, designers, and climate experts
            dedicated to making carbon reporting transparent and painless.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-primary/5 border border-primary/20 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-4">Why IORA?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Working at IORA means solving real-world data problems that have a
                direct impact on the planet. We value autonomy, rigor, and a
                shared obsession with quality.
              </p>
              <ul className="space-y-3">
                {["Remote-first culture", "High autonomy", "Equity in the company", "Climate-positive mission"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button type="button" variant="outline" asChild className="w-full">
              <Link href="/contact">Contact our team</Link>
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Open Roles</h2>
            <div className="space-y-4">
              {[
                {
                  role: "Full Stack Engineer",
                  dept: "Engineering",
                  desc: "Build the core carbon accounting engine and dashboard interfaces."
                },
                {
                  role: "Product Designer",
                  dept: "Design",
                  desc: "Craft intuitive workflows for complex emissions data management."
                },
                {
                  role: "Climate Data Specialist",
                  dept: "Product",
                  desc: "Curate and validate emission factors for global industrial sectors."
                },
              ].map((job, i) => (
                <Card key={i} className="p-6 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {job.dept}
                        </span>
                        <span className="text-xs text-muted-foreground">Full-time</span>
                      </div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{job.role}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{job.desc}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              ))}
              <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Don't see a role that fits? We're always looking for exceptional people.
                </p>
                <Button type="button" variant="ghost" asChild>
                  <Link href="/contact">Send a speculative application</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
