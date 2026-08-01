"use client";

import { useState } from "react";
import { Factory, ShieldAlert, Dam, Landmark, Truck, Building } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sectors = [
  {
    id: "manufacturing",
    icon: Factory,
    title: "Industrial & Manufacturing",
    description:
      "Stack emissions compliance, Title V air permits, industrial effluent pretreatment, SWPPP, and RCRA hazardous waste management.",
    services: [
      "Title V & NSR Air Quality Permitting",
      "Industrial Wastewater Pretreatment Systems",
      "Hazardous Waste Manifest & RCRA Audits",
      "Chemical Spill Response & Containment",
    ],
    stats: { projects: "840+", complianceRate: "100%", avgLeadTime: "14 Days" },
  },
  {
    id: "energy",
    icon: ShieldAlert,
    title: "Energy & Utilities",
    description:
      "Environmental impact statements (EIS), FERC compliance, groundwater plume remediation, and habitat conservation around energy assets.",
    services: [
      "NEPA & FERC Environmental Assessments",
      "Coal Combustion Residuals (CCR) Remediation",
      "Substation Soil & PCB Testing",
      "Endangered Species Surveys",
    ],
    stats: { projects: "520+", complianceRate: "99.8%", avgLeadTime: "21 Days" },
  },
  {
    id: "realestate",
    icon: Building,
    title: "Commercial & Real Estate",
    description:
      "Rapid Phase I & Phase II Environmental Site Assessments (ESA), vapor intrusion testing, and brownfield redevelopment support.",
    services: [
      "ASTM E1527-21 Phase I Site Assessments",
      "Sub-slab Vapor Intrusion Mitigation",
      "Asbestos & Lead Paint Inspections",
      "Brownfield Cleanup & NFA Clearance",
    ],
    stats: { projects: "1,100+", complianceRate: "100%", avgLeadTime: "7 Days" },
  },
  {
    id: "infrastructure",
    icon: Dam,
    title: "Infrastructure & Civil Works",
    description:
      "Clean Water Act Section 404/401 wetland permitting, erosion control, and storm water pollution prevention plans for major civil builds.",
    services: [
      "USACE Wetland Delineation & Mitigation",
      "NPDES Construction Stormwater Permits",
      "Geotechnical & Environmental Drilling",
      "Noise & Soil Vibration Monitoring",
    ],
    stats: { projects: "450+", complianceRate: "99.9%", avgLeadTime: "10 Days" },
  },
  {
    id: "municipal",
    icon: Landmark,
    title: "Municipal & Public Sector",
    description:
      "Water treatment facility upgrades, municipal landfill closure monitoring, urban watershed restoration, and public health EHS audits.",
    services: [
      "PFAS & Drinking Water Monitoring",
      "Landfill Methane & Leachate Control",
      "Community Air Monitoring Networks",
      "EPA Consent Decree Guidance",
    ],
    stats: { projects: "380+", complianceRate: "100%", avgLeadTime: "15 Days" },
  },
];

export function IndustriesSection() {
  const [activeTab, setActiveTab] = useState("manufacturing");
  const activeSector = sectors.find((s) => s.id === activeTab);

  return (
    <section id="sectors" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Industry Specialization
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Sectors & Technical Field Expertise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
            Tailored environmental engineering solutions calibrated to the specific regulatory mandates and operational requirements of your industry.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted p-1 flex flex-wrap gap-1 border border-border rounded-lg max-w-max">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <TabsTrigger
                  key={sector.id}
                  value={sector.id}
                  className="data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {sector.title}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Details panel */}
            <div className="lg:col-span-8 flex flex-col justify-between p-6 sm:p-8 rounded-xl border border-border bg-card shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{activeSector.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {activeSector.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                    Core Technical Offerings
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSector.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center gap-2 text-xs font-medium text-foreground bg-muted/40 p-3 rounded-lg border border-border/50"
                      >
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border mt-8">
                <div>
                  <div className="text-2xl font-extrabold text-foreground font-sans">
                    {activeSector.stats.projects}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                    Completed Sector Engagements
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary font-sans">
                    {activeSector.stats.complianceRate}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                    First-Pass Audit Approval
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-foreground font-sans">
                    {activeSector.stats.avgLeadTime}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold mt-1">
                    Average Report Turnaround
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action / Regulatory Callout */}
            <div className="lg:col-span-4 bg-primary text-primary-foreground rounded-xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded bg-primary-foreground/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Sector Support Line
                </div>
                <h3 className="text-xl font-bold leading-snug">
                  Need Immediate Regulatory Compliance Audit?
                </h3>
                <p className="text-xs text-primary-foreground/90 leading-relaxed">
                  Our licensed environmental engineers and certified industrial hygienists are available to review your facility's permit status and conduct compliance gap assessments.
                </p>
              </div>

              <div className="pt-6 border-t border-primary-foreground/20 mt-6 space-y-3">
                <div className="text-xs font-semibold">● Fast-Track Emergency Dispatch</div>
                <div className="text-xs font-semibold">● Senior Professional Engineer Review</div>
                <a
                  href="#contact"
                  className="mt-4 block w-full text-center bg-background text-foreground hover:bg-background/90 font-bold text-xs py-3 px-4 rounded-md transition-colors shadow-sm"
                >
                  Contact Sector Lead Engineer
                </a>
              </div>
            </div>
          </div>
        </Tabs>

      </div>
    </section>
  );
}
