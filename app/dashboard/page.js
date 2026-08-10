export default function DashboardPage() {
  const metrics = [
    { label: "Carbon footprint", value: "—" },
    { label: "Reports generated", value: "—" },
    { label: "Compliance score", value: "—" },
    { label: "Active alerts", value: "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Overview</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your climate metrics at a glance.
        </p>
      </div>

      <div className="grid gap-px bg-neutral-200 dark:bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4 border border-neutral-200 dark:border-neutral-800">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white dark:bg-neutral-950 p-4">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{m.label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
