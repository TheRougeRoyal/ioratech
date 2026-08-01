"use client";

import {
  Droplets,
  Sprout,
  ShieldCheck,
  Wind,
  Trash2,
  FileCheck2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Water Resources & Hydrogeology",
    category: "Air & Water Testing",
    image: "/water_quality.jpg",
    description:
      "Advanced water quality monitoring, NPDES discharge permitting, storm water pollution prevention plans (SWPPP), and groundwater contaminant tracking.",
    capabilities: [
      "Effluent & Surface Water Testing",
      "Hydrogeologic Aquifer Modeling",
      "PFAS & Heavy Metals Detection",
      "Industrial Wastewater Pretreatment",
    ],
  },
  {
    icon: Sprout,
    title: "Soil Remediation & Site Restoration",
    category: "Site Cleanup",
    image: "/soil_remediation.jpg",
    description:
      "Turnkey site assessment, brownfield redevelopment, in-situ bioremediation, and soil decontamination for industrial and commercial real estate.",
    capabilities: [
      "Phase I & II Environmental Site Assessments (ESA)",
      "Vapor Intrusion Mitigation",
      "Excavation & Excavated Material Management",
      "Brownfield Tax Credit Documentation",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Environmental Compliance & Auditing",
    category: "Regulatory Governance",
    description:
      "End-to-end compliance management across EPA, OSHA, state regulatory bodies, and international ISO 14001 audit standards.",
    capabilities: [
      "Title V Air & Resource Permitting",
      "SPCC & Facility Response Plans",
      "EHS Compliance Management",
      "Annual Regulatory Audit Reports",
    ],
  },
  {
    icon: Wind,
    title: "Air Quality & Emission Controls",
    category: "Atmospheric Services",
    description:
      "Stack testing, continuous emissions monitoring (CEMS), odor dispersion modeling, and ambient air sampling for industrial facilities.",
    capabilities: [
      "VOC & Hazardous Air Pollutant Testing",
      "AERMOD Dispersion Modeling",
      "GHG Inventory Validation",
      "Fugitive Dust Containment",
    ],
  },
  {
    icon: Trash2,
    title: "Hazardous Materials & Waste Solutions",
    category: "Waste Infrastructure",
    description:
      "Full lifecycle hazardous waste classification, transportation compliance, asbestos/lead abatement oversight, and spill prevention.",
    capabilities: [
      "RCRA Hazardous Waste Compliance",
      "24/7 Chemical Emergency Response",
      "Industrial Tank Integrity Testing",
      "Universal & Special Waste Audits",
    ],
  },
  {
    icon: FileCheck2,
    title: "Ecological & Wetlands Consulting",
    category: "Natural Resources",
    description:
      "Wetland delineation, Section 404/401 permitting, endangered species habitat evaluation, and ecological impact mitigation design.",
    capabilities: [
      "Biological & Botanical Surveys",
      "Wetland Mitigation Banking",
      "NEPA Environmental Impact Statements",
      "Habitat Conservation Planning",
    ],
  },
];

export function CapabilitiesSection() {
  return (
    <section id="services" className="py-20 md:py-28 relative bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Comprehensive Engineering & Field Solutions
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Core Environmental Disciplines
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
              Delivering field-verified science, rigorous regulatory compliance, and sustainable engineering to safeguard air, land, and water resources.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Request Custom Project Scope <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50"
              >
                <div>
                  {/* Category Tag & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded">
                      {service.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Image showcase if available */}
                  {service.image && (
                    <div className="mb-6 rounded-lg overflow-hidden border border-border h-40">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Key Deliverables / Capabilities List */}
                  <div className="space-y-2.5 pt-4 border-t border-border/60">
                    <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                      Key Services & Deliverables
                    </div>
                    {service.capabilities.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Learn Detailed Capabilities</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
