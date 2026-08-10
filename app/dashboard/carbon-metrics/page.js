export default function CarbonMetricsPage() {
  const scopes = [
    { name: "Scope 1", note: "Direct emissions" },
    { name: "Scope 2", note: "Indirect emissions" },
    { name: "Scope 3", note: "Value chain emissions" },
    { name: "Total", note: "All scopes" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Carbon metrics</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Track your organization's emissions across all scopes.
        </p>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-neutral-200 dark:bg-neutral-800">
          {scopes.map((s) => (
            <div key={s.name} className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.name}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">— <span className="text-sm font-normal text-neutral-500">tCO2e</span></p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{s.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-sm font-medium mb-1">Recent activity</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No emissions data recorded yet. Add your first measurement to get started.
        </p>
        <a
          href="/dashboard/api-keys/create"
          className="inline-flex items-center h-8 px-3 mt-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          Get API access
        </a>
      </div>
    </div>
  );
}
