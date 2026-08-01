"use client";

import { Search, FlaskConical, Wrench, ShieldCheck } from "lucide-react";

const workflowSteps = [
  {
    step: "01",
    icon: Search,
    title: "Site Assessment & Regulatory Discovery",
    description:
      "Historical land use research, Phase I ESA audits, aerial GIS mapping, and initial environmental hazard profiling.",
  },
  {
    step: "02",
    icon: FlaskConical,
    title: "Field Sampling & Laboratory Analysis",
    description:
      "Certified field technicians extract soil, groundwater, and air samples analyzed under NELAP/EPA certified protocols.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Engineering & Remediation Execution",
    description:
      "Custom design and deployment of containment systems, in-situ chemical oxidation, filtration units, or habitat buffers.",
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Permitting & Regulatory Sign-Off",
    description:
      "Submitting complete compliance dossiers to federal, state, and local regulatory bodies to achieve 'No Further Action' (NFA) status.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="methodology" className="py-20 md:py-28 bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Proven Engineering Protocol
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Our 4-Phase Delivery Framework
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
            From initial site investigation to final regulatory clearance, we enforce strict quality controls and scientific precision at every stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {workflowSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold text-primary/40 font-mono">
                      {item.step}
                    </span>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Phase {idx + 1} Deliverable
                </div>
              </div>
            );
          })}
        </div>

        {/* Quality Assurance Statement Box */}
        <div className="mt-16 bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-foreground">ISO 9001 & ISO 14001 Quality Management Certified</h4>
            <p className="text-sm text-muted-foreground">Every field sample and engineering report undergoes multi-tier Senior Professional Engineer (PE) review.</p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-md border border-primary/20">
              Zero Non-Compliance Guarantee
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
