"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Layers, ShieldCheck, Zap, FileText, Globe } from "lucide-react";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl mb-6">
            The Operating System for <br className="hidden sm:block" /> Climate Reporting.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-8">
            IORA replaces the fragmented landscape of spreadsheets and emails with a
            single source of truth for your organization's emissions and risks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          <Card className="p-8 bg-card border-border">
            <BarChart3 className="h-10 w-10 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-3">Emissions Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automate the collection of Scope 1, 2, and 3 data. We handle the factors
              and calculations, while you focus on the reductions.
            </p>
          </Card>
          <Card className="p-8 bg-card border-border">
            <ShieldCheck className="h-10 w-10 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-3">Compliance Engine</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stay ahead of CSRD, SEC, and ISO standards. IORA maps your data
              to regulatory requirements automatically.
            </p>
          </Card>
          <Card className="p-8 bg-card border-border">
            <Layers className="h-10 w-10 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-3">Risk Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Identify physical and transitional climate risks across your
              facility portfolio using high-resolution geospatial data.
            </p>
          </Card>
        </div>

        <section className="mb-24">
          <h2 className="text-3xl font-semibold text-center mb-12">Built for Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Attached Evidence</h4>
                  <p className="text-sm text-muted-foreground">Every number is linked to a source document—an invoice, a utility bill, or a supplier declaration.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Transparent Calculation</h4>
                  <p className="text-sm text-muted-foreground">No black boxes. See exactly which emission factor was used and why.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Collaborative Review</h4>
                  <p className="text-sm text-muted-foreground">Review and approve data in-app before it ever hits a final report.</p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-8 border border-border text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Audit-Ready Reports</h3>
              <p className="text-muted-foreground mb-6">
                Export professional, compliant reports that your finance team
                and external auditors can sign off on with confidence.
              </p>
              <Button type="button" variant="outline" asChild>
                <Link href="/contact">Request a demo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="text-center border-t border-border pt-20">
          <h2 className="text-3xl font-semibold mb-6">Ready to modernize your reporting?</h2>
          <Button type="button" size="lg" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
