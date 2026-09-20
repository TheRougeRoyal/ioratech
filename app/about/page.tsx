"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, Zap, ShieldCheck, Leaf, BarChart3 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl mb-6">
            Climate reporting for the people <br className="hidden sm:block" /> doing the actual work.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-8">
            We believe that climate action starts with trust. IORA was built to remove
            the friction from emissions management, allowing sustainability teams
            to move from spreadsheets to strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              For too long, carbon accounting has been a black box of complex spreadsheets
              and disconnected data sources. We are changing that by bringing
              emissions data, climate risk, and reporting evidence into one calm workspace.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our goal is to make the "audit trail" a natural part of the process, not
              a quarterly crisis. When evidence travels with the number, trust follows.
            </p>
            <Button type="button" variant="outline" asChild>
              <Link href="/contact">Work with us</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-muted/30 border-none">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Planet First</h3>
              <p className="text-sm text-muted-foreground">Driven by the urgent need for accurate, transparent climate data.</p>
            </Card>
            <Card className="p-6 bg-muted/30 border-none mt-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Audit Ready</h3>
              <p className="text-sm text-muted-foreground">Built for compliance standards like CSRD, SEC, and ISO.</p>
            </Card>
            <Card className="p-6 bg-muted/30 border-none">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Team Focused</h3>
              <p className="text-sm text-muted-foreground">Designed for the analysts and facility managers on the ground.</p>
            </Card>
            <Card className="p-6 bg-muted/30 border-none mt-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Setup</h3>
              <p className="text-sm text-muted-foreground">Connect your data and see your first baseline in days, not months.</p>
            </Card>
          </div>
        </div>

        <section className="border-t border-border pt-20 text-center">
          <h2 className="text-3xl font-semibold mb-8">Ready to simplify your reporting?</h2>
          <Button type="button" size="lg" asChild>
            <Link href="/contact">Start a conversation</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
