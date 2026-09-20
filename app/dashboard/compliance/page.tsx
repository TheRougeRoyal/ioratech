"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    id: "tcfd",
    name: "TCFD",
    fullName: "Task Force on Climate-related Financial Disclosures",
    description:
      "Voluntary framework developed by the FSB providing recommendations for consistent climate-related financial risk disclosures across four pillars: Governance, Strategy, Risk Management, and Metrics & Targets.",
    status: "Aligned",
    progress: 92,
    requirements: [
      { id: "tcfd-1", label: "Board oversight of climate risks documented", done: true },
      { id: "tcfd-2", label: "Management roles and responsibilities defined", done: true },
      { id: "tcfd-3", label: "Short-, medium-, and long-term climate risks identified", done: true },
      { id: "tcfd-4", label: "Climate scenario analysis (1.5°C and 4°C) completed", done: true },
      { id: "tcfd-5", label: "Risk management processes integrated into enterprise risk", done: true },
      { id: "tcfd-6", label: "Scope 1, 2, and 3 GHG emissions disclosed", done: true },
      { id: "tcfd-7", label: "Climate-related targets and performance tracked", done: false },
    ],
  },
  {
    id: "csrd",
    name: "CSRD",
    fullName: "Corporate Sustainability Reporting Directive",
    description:
      "EU directive mandating large companies to report on sustainability impacts, risks, and opportunities following European Sustainability Reporting Standards (ESRS), covering environment, social, and governance topics.",
    status: "In Progress",
    progress: 61,
    requirements: [
      { id: "csrd-1", label: "Double materiality assessment (DMA) conducted", done: true },
      { id: "csrd-2", label: "ESRS E1 (Climate Change) disclosures prepared", done: true },
      { id: "csrd-3", label: "Scope 1, 2, 3 emissions with intensity metrics", done: true },
      { id: "csrd-4", label: "ESRS E2–E5 (Pollution, Water, Biodiversity, Resources) assessed", done: false },
      { id: "csrd-5", label: "Social standards (ESRS S1–S4) data collected", done: false },
      { id: "csrd-6", label: "Governance disclosures (ESRS G1) documented", done: true },
      { id: "csrd-7", label: "Third-party limited assurance obtained", done: false },
      { id: "csrd-8", label: "Taxonomy alignment reported for eligible activities", done: false },
    ],
  },
  {
    id: "issb",
    name: "ISSB S1/S2",
    fullName: "International Sustainability Standards Board — IFRS S1 & S2",
    description:
      "IFRS Foundation standards establishing a global baseline for sustainability disclosures. S1 covers general sustainability-related financial information; S2 covers climate-related disclosures building on TCFD.",
    status: "In Progress",
    progress: 48,
    requirements: [
      { id: "issb-1", label: "IFRS S1 general sustainability risk and opportunity disclosures", done: true },
      { id: "issb-2", label: "IFRS S2 climate-related risks and opportunities identified", done: true },
      { id: "issb-3", label: "Industry-based metrics from SASB standards incorporated", done: false },
      { id: "issb-4", label: "Climate scenario analysis with quantitative impacts", done: false },
      { id: "issb-5", label: "Cross-industry metric categories (GHG, energy, water, waste)", done: true },
      { id: "issb-6", label: "Financed emissions (Scope 3 Cat 15) for financial institutions", done: false },
      { id: "issb-7", label: "Connectivity with IFRS financial statements demonstrated", done: false },
    ],
  },
  {
    id: "gri",
    name: "GRI Standards",
    fullName: "Global Reporting Initiative Standards",
    description:
      "Internationally recognised standards for sustainability reporting enabling organisations to communicate their impacts on the economy, environment, and people. Modular system with Universal, Sector, and Topic Standards.",
    status: "Aligned",
    progress: 85,
    requirements: [
      { id: "gri-1", label: "GRI 1 (Foundation) — reporting principles applied", done: true },
      { id: "gri-2", label: "GRI 2 (General Disclosures) — organisation profile complete", done: true },
      { id: "gri-3 ", label: "GRI 3 (Material Topics) — materiality process documented", done: true },
      { id: "gri-4", label: "GRI 302 (Energy) disclosures filed", done: true },
      { id: "gri-5", label: "GRI 305 (Emissions) Scope 1, 2, 3 data reported", done: true },
      { id: "gri-6", label: "GRI 303/306 (Water/Waste) disclosures complete", done: true },
      { id: "gri-7", label: "Sector standard disclosures applied (where applicable)", done: false },
    ],
  },
  {
    id: "sasb",
    name: "SASB",
    fullName: "Sustainability Accounting Standards Board",
    description:
      "Industry-specific standards identifying the minimal set of financially material sustainability topics and associated metrics for 77 industries, now maintained by the IFRS Foundation alongside ISSB.",
    status: "In Progress",
    progress: 54,
    requirements: [
      { id: "sasb-1", label: "Applicable SASB industry standard(s) identified", done: true },
      { id: "sasb-2", label: "Quantitative metrics mapped and collected", done: true },
      { id: "sasb-3", label: "Activity metrics (e.g. production volume, floor area) reported", done: true },
      { id: "sasb-4", label: "Qualitative discussion of management approach provided", done: false },
      { id: "sasb-5", label: "Data assurance or internal review completed", done: false },
      { id: "sasb-6", label: "Metrics embedded in investor-facing communications", done: false },
    ],
  },
  {
    id: "sec",
    name: "SEC Climate Rule",
    fullName: "SEC Climate-Related Disclosures Rule (17 CFR Parts 210, 229, 249)",
    description:
      "US Securities and Exchange Commission rule requiring domestic and foreign registrants to disclose material climate-related risks, greenhouse gas emissions, and targets in registration statements and annual reports.",
    status: "Not Started",
    progress: 12,
    requirements: [
      { id: "sec-1", label: "Material climate risk identification and description", done: false },
      { id: "sec-2", label: "Scope 1 & 2 GHG emissions (large accelerated filers)", done: false },
      { id: "sec-3", label: "Climate-related targets and transition plan disclosed", done: false },
      { id: "sec-4", label: "Severe weather events & natural conditions financial impacts", done: false },
      { id: "sec-5", label: "Carbon offsets and RECs usage explained", done: false },
      { id: "sec-6", label: "Board and management climate oversight disclosures", done: true },
      { id: "sec-7", label: "Third-party attestation of Scope 1 & 2 emissions", done: false },
    ],
  },
];

const GAP_ANALYSIS = [
  {
    id: "gap-1",
    priority: "High",
    framework: "CSRD",
    gap: "ESRS E2–E5 environmental standards not yet assessed",
    action:
      "Engage EHS team to collect pollution, water stress, biodiversity, and resource-use data for the current reporting year.",
    effort: "3–4 months",
  },
  {
    id: "gap-2",
    priority: "High",
    framework: "SEC Climate Rule",
    gap: "No formal Scope 1 & 2 quantification process for SEC filing",
    action:
      "Establish audit-ready GHG inventory methodology aligned with SEC requirements and engage assurance provider.",
    effort: "4–6 months",
  },
  {
    id: "gap-3",
    priority: "Medium",
    framework: "ISSB S1/S2",
    gap: "Quantitative climate scenario analysis not completed",
    action:
      "Commission financial modelling of physical and transition risk scenarios under 1.5°C and 3°C pathways.",
    effort: "2–3 months",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusStyles(status: string) {
  switch (status) {
    case "Aligned":
      return {
        badge:
          "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700",
        bar: "bg-emerald-500",
        dot: "bg-emerald-500",
      };
    case "In Progress":
      return {
        badge:
          "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700",
        bar: "bg-amber-400",
        dot: "bg-amber-400",
      };
    default:
      return {
        badge:
          "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",
        bar: "bg-neutral-400 dark:bg-neutral-600",
        dot: "bg-neutral-400",
      };
  }
}

function priorityStyles(priority: string) {
  switch (priority) {
    case "High":
      return "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800";
    case "Medium":
      return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800";
    default:
      return "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700";
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryBar({ frameworks }: { frameworks: any[] }) {
  const aligned = frameworks.filter((f) => f.status === "Aligned").length;
  const inProgress = frameworks.filter((f) => f.status === "In Progress").length;
  const notStarted = frameworks.filter((f) => f.status === "Not Started").length;
  const avgProgress = Math.round(
    frameworks.reduce((sum, f) => sum + f.progress, 0) / frameworks.length
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800">
      <div className="p-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          Frameworks Tracked
        </p>
        <p className="mt-1 text-2xl font-semibold">{frameworks.length}</p>
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          Aligned
        </p>
        <p className="mt-1 text-2xl font-semibold text-emerald-600">{aligned}</p>
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          In Progress
        </p>
        <p className="mt-1 text-2xl font-semibold text-amber-500">{inProgress}</p>
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
          Avg. Completion
        </p>
        <p className="mt-1 text-2xl font-semibold">{avgProgress}%</p>
      </div>
    </div>
  );
}

function RequirementItem({ req }: { req: any }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {req.done ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600" />
      )}
      <span
        className={`text-sm ${
          req.done
            ? "text-neutral-700 dark:text-neutral-300"
            : "text-neutral-500 dark:text-neutral-500"
        }`}
      >
        {req.label}
      </span>
    </div>
  );
}

function FrameworkCard({ framework }: { framework: any }) {
  const [open, setOpen] = useState(false);
  const styles = statusStyles(framework.status);
  const doneCount = framework.requirements.filter((r: any) => r.done).length;
  const totalCount = framework.requirements.length;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800">
      {/* Header row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: name + description */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold">{framework.name}</span>
              <span className={`text-xs px-2 py-0.5 font-medium rounded ${styles.badge}`}>
                {framework.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {framework.fullName}
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {framework.description}
            </p>
          </div>

          {/* Right: progress ring / percent */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-xl font-semibold tabular-nums">
              {framework.progress}
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">%</span>
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {doneCount}/{totalCount} items
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-neutral-100 dark:bg-neutral-900">
          <div
            className={`h-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${framework.progress}%` }}
          />
        </div>

        {/* Expand button */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Requirements checklist
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {open ? (
              <>
                Collapse <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Expand <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable requirements */}
      {open && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 sm:px-5 divide-y divide-neutral-100 dark:divide-neutral-800/70">
          {framework.requirements.map((req: any) => (
            <RequirementItem key={req.id} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}

function GapCard({ gap, index }: { gap: any; index: number }) {
  return (
    <div className="p-4 sm:p-5 flex gap-4">
      {/* Index circle */}
      <div className="shrink-0 flex h-7 w-7 items-center justify-center border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        {index + 1}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 font-medium rounded ${priorityStyles(gap.priority)}`}>
            {gap.priority} Priority
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5">
            {gap.framework}
          </span>
        </div>
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{gap.gap}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{gap.action}</p>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Estimated effort: {gap.effort}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [expandAll, setExpandAll] = useState(false);
  const aligned = FRAMEWORKS.filter((f) => f.status === "Aligned").length;
  const inProgress = FRAMEWORKS.filter((f) => f.status === "In Progress").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Compliance Tracker</h1>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-400">
            Monitor alignment across climate disclosure frameworks and track outstanding requirements.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <SummaryBar frameworks={FRAMEWORKS} />

      {/* Status legend */}
      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Aligned ({aligned})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          In Progress ({inProgress})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          Not Started ({FRAMEWORKS.length - aligned - inProgress})
        </div>
      </div>

      {/* Framework cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
            Frameworks
          </h2>
          <button
            type="button"
            onClick={() => setExpandAll((v) => !v)}
            className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {expandAll ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <FrameworkGrid frameworks={FRAMEWORKS} expandAll={expandAll} />
      </div>

      {/* Gap Analysis */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
            Gap Analysis — Top Priorities
          </h2>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
          {GAP_ANALYSIS.map((gap, i) => (
            <GapCard key={gap.id} gap={gap} index={i} />
          ))}
        </div>
      </div>

      {/* CTA footer */}
      <div className="border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Need help closing gaps?</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Our framework advisors can assist with data collection, assurance readiness, and disclosure drafting.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex items-center h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Learn more
          </button>
          <button
            type="button"
            className="inline-flex items-center h-9 px-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Book a review
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper to support expand-all toggle via key reset trick
function FrameworkGrid({ frameworks, expandAll }: { frameworks: any[]; expandAll: boolean }) {
  return (
    <div className="space-y-3">
      {frameworks.map((fw) => (
        <FrameworkCardControlled key={fw.id} framework={fw} forceOpen={expandAll} />
      ))}
    </div>
  );
}

function FrameworkCardControlled({ framework, forceOpen }: { framework: any; forceOpen: boolean }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = forceOpen || localOpen;
  const styles = statusStyles(framework.status);
  const doneCount = framework.requirements.filter((r: any) => r.done).length;
  const totalCount = framework.requirements.length;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800">
      {/* Header row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold">{framework.name}</span>
              <span className={`text-xs px-2 py-0.5 font-medium rounded ${styles.badge}`}>
                {framework.status}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {framework.fullName}
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {framework.description}
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-xl font-semibold tabular-nums">
              {framework.progress}
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">%</span>
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {doneCount}/{totalCount} items
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-neutral-100 dark:bg-neutral-900">
          <div
            className={`h-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${framework.progress}%` }}
          />
        </div>

        {/* Expand toggle */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Requirements checklist —{" "}
            <span className={doneCount === totalCount ? "text-emerald-600" : "text-neutral-600 dark:text-neutral-400"}>
              {doneCount} of {totalCount} complete
            </span>
          </span>
          <button
            type="button"
            onClick={() => setLocalOpen((v) => !v)}
            disabled={forceOpen}
            className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {open ? (
              <>
                Collapse <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Expand <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Requirements list */}
      {open && (
        <div className="border-t border-neutral-200 dark:border-neutral-800 px-4 sm:px-5 divide-y divide-neutral-100 dark:divide-neutral-800/70">
          {framework.requirements.map((req: any) => (
            <RequirementItem key={req.id} req={req} />
          ))}
        </div>
      )}
    </div>
  );
}
