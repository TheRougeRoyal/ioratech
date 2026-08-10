const frameworks = [
  { name: "TCFD", desc: "Task Force on Climate-related Financial Disclosures", status: "Aligned" },
  { name: "CSRD", desc: "Corporate Sustainability Reporting Directive", status: "Partial" },
  { name: "ISSB", desc: "International Sustainability Standards Board", status: "Not started" },
];

const statusColor = (s) =>
  s === "Aligned"
    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
    : s === "Partial"
    ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
    : "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800";

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Compliance</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Monitor alignment with climate frameworks.
        </p>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        {frameworks.map((f) => (
          <div key={f.name} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">{f.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{f.desc}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 border ${statusColor(f.status)}`}>{f.status}</span>
          </div>
        ))}
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-sm font-medium mb-1">Getting started</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          Select a framework above to begin your assessment.
        </p>
        <a
          href="/dashboard/settings"
          className="inline-flex items-center h-8 px-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          Configure frameworks
        </a>
      </div>
    </div>
  );
}
