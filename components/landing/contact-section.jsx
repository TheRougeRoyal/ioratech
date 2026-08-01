"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ShieldCheck, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Office info & Direct lines */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Consultation & Site Evaluation
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Speak With an Environmental Engineer
              </h2>
              <p className="text-base text-muted-foreground mt-4 leading-relaxed">
                Whether you need a Phase I ESA, permit renewal guidance, or emergency spill response, our licensed engineering team is standing by.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">National Headquarters & Hotline</div>
                  <div className="text-base font-bold text-foreground mt-0.5">+1 (800) 555-IORA (4672)</div>
                  <div className="text-xs text-muted-foreground">Direct Engineering Desk: +1 (713) 555-0199</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Official Inquiries & Proposals</div>
                  <a href="mailto:aakashr@lysandragroup.com" className="text-base font-bold text-foreground hover:text-primary transition-colors mt-0.5 block">
                    aakashr@lysandragroup.com
                  </a>
                  <div className="text-xs text-muted-foreground">RFP & Bidding: compliance@ioratech.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Primary Field Operations HQ</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    IORATECH Environmental Solutions Center
                  </div>
                  <div className="text-xs text-muted-foreground leading-normal">
                    1200 Energy Corridor Blvd, Suite 800, Houston, TX 77079
                  </div>
                </div>
              </div>
            </div>

            {/* Response SLA badge */}
            <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3 shadow-sm">
              <Clock className="h-6 w-6 text-primary shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-foreground block">Guaranteed 2-Hour Response Time</span>
                <span className="text-muted-foreground">For urgent environmental compliance & spill incidents.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <Card className="border border-border bg-card shadow-md">
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Consultation Request Received</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Thank you for submitting your site evaluation details. A Senior Environmental Engineer will contact you shortly to review your scope.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" size="sm" className="mt-4">
                      Submit Another Consultation Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-foreground mb-4">Request Project Scope & Site Assessment</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Full Name *</label>
                        <Input required placeholder="Jane Doe" className="bg-background border-border text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Work Email *</label>
                        <Input required type="email" placeholder="jdoe@company.com" className="bg-background border-border text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Organization / Company</label>
                        <Input placeholder="Acme Energy Corp" className="bg-background border-border text-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Phone Number *</label>
                        <Input required placeholder="+1 (555) 000-0000" className="bg-background border-border text-sm" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Primary Service Needed</label>
                      <select className="w-full h-10 px-3 rounded-md bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Phase I / Phase II Environmental Site Assessment (ESA)</option>
                        <option>Water Quality & NPDES Permitting</option>
                        <option>Soil Remediation & Contaminant Cleanup</option>
                        <option>Air Quality Stack Testing & Permitting</option>
                        <option>Hazardous Waste & Spill Prevention (SPCC)</option>
                        <option>Wetland Delineation & NEPA Assessment</option>
                        <option>Other Environmental Consultation</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Project Details & Location</label>
                      <Textarea
                        required
                        rows={4}
                        placeholder="Please describe site location, timeline, and specific regulatory or environmental objectives..."
                        className="bg-background border-border text-sm"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm h-11 flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Submit Project Consultation Request
                    </Button>
                    
                    <p className="text-[11px] text-muted-foreground text-center">
                      Strict NDA & Confidentiality Guaranteed. Your site data is kept secure under ISO 27001 standard protocols.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
