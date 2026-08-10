"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Plus, Trash2, Cloud, Factory, Flame, Leaf, Inbox } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const SCOPES = ["Scope 1", "Scope 2", "Scope 3"];
const CATEGORIES = {
  "Scope 1": ["Stationary Combustion", "Mobile Combustion", "Fugitive Emissions", "Process Emissions"],
  "Scope 2": ["Purchased Electricity", "Purchased Steam", "Purchased Heat", "Purchased Cooling"],
  "Scope 3": ["Purchased Goods", "Capital Goods", "Fuel & Energy", "Upstream Transport", "Waste", "Business Travel", "Employee Commute", "Downstream Transport"],
};
const UNITS = ["tCO2e", "kgCO2e", "MtCO2e"];
const PERIODS = ["2026-Q1", "2026-Q2", "2025-Q4", "2025-Q3", "2025-Q2", "2025-Q1", "2024-Q4", "2024-Q3"];

const MOCK = [
  { id: "e1", scope: "Scope 1", category: "Stationary Combustion", value: 142.5, unit: "tCO2e", period: "2025-Q4" },
  { id: "e2", scope: "Scope 1", category: "Mobile Combustion", value: 68.3, unit: "tCO2e", period: "2025-Q4" },
  { id: "e3", scope: "Scope 1", category: "Fugitive Emissions", value: 12.1, unit: "tCO2e", period: "2025-Q3" },
  { id: "e4", scope: "Scope 2", category: "Purchased Electricity", value: 389.7, unit: "tCO2e", period: "2025-Q4" },
  { id: "e5", scope: "Scope 2", category: "Purchased Steam", value: 54.2, unit: "tCO2e", period: "2025-Q3" },
  { id: "e6", scope: "Scope 3", category: "Business Travel", value: 218.4, unit: "tCO2e", period: "2025-Q4" },
  { id: "e7", scope: "Scope 3", category: "Purchased Goods", value: 1240.6, unit: "tCO2e", period: "2025-Q4" },
  { id: "e8", scope: "Scope 3", category: "Employee Commute", value: 96.8, unit: "tCO2e", period: "2025-Q3" },
  { id: "e9", scope: "Scope 3", category: "Upstream Transport", value: 312.0, unit: "tCO2e", period: "2025-Q3" },
];

function ScopeIcon({ scope, className = "h-3.5 w-3.5" }) {
  if (scope === "Scope 1") return <Flame className={className} />;
  if (scope === "Scope 2") return <Factory className={className} />;
  if (scope === "Scope 3") return <Cloud className={className} />;
  return <Leaf className={className} />;
}

function Skeleton() {
  return <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />;
}

export default function CarbonMetricsPage() {
  const { user, getIdToken } = useAuth();
  const [emissions, setEmissions] = useState(MOCK);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    scope: "Scope 1", category: "", value: "", unit: "tCO2e", period: PERIODS[0],
  });

  const fetchEmissions = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/emissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) setEmissions(json.data);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [user, getIdToken]);

  useEffect(() => { fetchEmissions(); }, [fetchEmissions]);

  const handleAdd = async () => {
    if (!draft.category || !draft.value) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/emissions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: draft.scope,
          category: draft.category,
          value: parseFloat(draft.value),
          unit: draft.unit,
          period: draft.period,
        }),
      });
      if (res.ok) {
        toast.success("Emission recorded");
        setDialogOpen(false);
        setDraft({ scope: "Scope 1", category: "", value: "", unit: "tCO2e", period: PERIODS[0] });
        fetchEmissions();
      } else toast.error("Failed to record emission");
    } catch (e) { console.error(e); toast.error("Failed to record emission"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this emission record?")) return;
    try {
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch(`/api/dashboard/emissions?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Deleted");
        fetchEmissions();
      } else toast.error("Failed to delete");
    } catch (e) { console.error(e); toast.error("Failed to delete"); }
  };

  const sum = (arr) => arr.reduce((s, e) => s + (Number(e.value) || 0), 0);
  const byScope = (s) => emissions.filter((e) => e.scope === s);
  const total = sum(emissions);
  const s1 = sum(byScope("Scope 1"));
  const s2 = sum(byScope("Scope 2"));
  const s3 = sum(byScope("Scope 3"));

  const scopeData = [
    { name: "Scope 1", value: Math.round(s1) },
    { name: "Scope 2", value: Math.round(s2) },
    { name: "Scope 3", value: Math.round(s3) },
  ];

  const categoryTotals = emissions.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (Number(e.value) || 0);
    return acc;
  }, {});
  const topCategories = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const recent = [...emissions].reverse().slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Carbon metrics</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Track your organization's emissions across all scopes.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Record emission</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record emission</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-3">
              <div className="space-y-1">
                <Label>Scope</Label>
                <Select value={draft.scope} onValueChange={(v) => setDraft({ ...draft, scope: v, category: "" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SCOPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CATEGORIES[draft.scope].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Value</Label>
                  <Input type="number" min="0" step="0.01" value={draft.value}
                    onChange={(e) => setDraft({ ...draft, value: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-1">
                  <Label>Unit</Label>
                  <Select value={draft.unit} onValueChange={(v) => setDraft({ ...draft, unit: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Period</Label>
                <Select value={draft.period} onValueChange={(v) => setDraft({ ...draft, period: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Record emission"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Scope 1</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{s1.toFixed(1)} <span className="text-sm font-normal text-neutral-500">tCO2e</span></p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1"><Flame className="h-3 w-3" />Direct emissions</p>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Scope 2</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{s2.toFixed(1)} <span className="text-sm font-normal text-neutral-500">tCO2e</span></p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1"><Factory className="h-3 w-3" />Indirect emissions</p>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Scope 3</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{s3.toFixed(1)} <span className="text-sm font-normal text-neutral-500">tCO2e</span></p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1"><Cloud className="h-3 w-3" />Value chain</p>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Total</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{total.toFixed(1)} <span className="text-sm font-normal text-neutral-500">tCO2e</span></p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{emissions.length} records</p>
        </div>
      </div>

      {loading ? (
        <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 space-y-2"><Skeleton /><div className="h-2 w-20 bg-neutral-200 dark:bg-neutral-800 animate-pulse" /></div>
          ))}
        </div>
      ) : emissions.length === 0 ? (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
          <Inbox className="h-6 w-6 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm font-medium">No emissions recorded</p>
          <p className="text-xs text-neutral-500 mt-0.5">Add your first measurement to get started.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3">By scope</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={scopeData} dataKey="value" innerRadius={50} outerRadius={78} paddingAngle={2}>
                    {scopeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v} tCO2e`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3">Top categories</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topCategories} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip formatter={(v) => `${v} tCO2e`} />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-medium">Recent emissions</h2>
              <span className="text-xs text-neutral-500">{recent.length} of {emissions.length}</span>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recent.map((e) => (
                <div key={e.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <ScopeIcon scope={e.scope} className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{e.category}</span>
                        <span className="text-[10px] px-1.5 py-0.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {e.scope}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{e.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold tabular-nums">
                      {Number(e.value).toFixed(1)} <span className="text-xs font-normal text-neutral-500">{e.unit}</span>
                    </span>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                      aria-label="Delete emission"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
