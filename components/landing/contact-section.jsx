"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden bg-background border-b border-border/40">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-mono uppercase tracking-wider mb-6">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Contact Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-balance mb-12">
            Have questions about Iora Technology or want to discuss a partnership? We'd love to hear from you.
          </p>

          <Card className="inline-block border-border/50 bg-card/60">
            <CardContent className="px-8 py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center border border-border/50">
                  <Mail className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email us at</p>
                  <a
                    href="mailto:aakashr@lysandragroup.com"
                    className="text-lg font-semibold tracking-tight hover:underline"
                  >
                    aakashr@lysandragroup.com
                  </a>
                </div>
                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="mt-2 rounded-md w-full">
                    Send a Message
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
