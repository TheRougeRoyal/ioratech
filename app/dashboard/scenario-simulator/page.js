"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  AreaChart, Area, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { RefreshCcw, Save } from "lucide-react";
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

const COLORS = ["#10b981", "#f59e0b", "#3b82f6"];

const TRANSITION = [
  { v: "slow", l: "Slow (Delayed)" },
  { v: "moderate", l: "Moderate" },
  { v: "fast", l: "Fast (Net Zero)" },
];
const PHYSICAL = [
  { v: "rcp26", l: "RCP 2.6 (+1.5°C)" },
  { v: "rcp45", l: "RCP 4.5 (+2.5°C)" },
  { v: "rcp85", l: "RCP 8.5 (+4.5°C)" },
];

const MOCK = [
  { id: "s1", category: "Base Case 2024", score: 55, description: JSON.stringify({ carbonPrice: 85, regulationIntensity: 60, transitionSpeed: "moderate", physicalRiskScenario: "rcp45" }) },
  { id: "s2", category: "High Carbon Price", score: 72, description: JSON.stringify({ carbonPrice: 150, regulationIntensity: 80, transitionSpeed: "fast", physicalRiskScenario: "rcp45" }) },
  { id: "s3", category: "Delayed Transition", score: 68, description: JSON.stringify({ carbonPrice: 45, regulationIntensity: 30, transitionSpeed: "slow", physicalRiskScenario: "rcp85" }) },
];

function Slider({ value, onChange, min, max, step }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onChange([Number(e.target.value)])}
      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 appearance-none cursor-pointer accent-emerald-600"
    />
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-4 text-center">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${tone || ""}`}>{value}</p>
    </div>
  );
}

export default function ScenarioSimulatorPage() {
  const { user, getIdToken } = useAuth();
  const [carbonPrice, setCarbonPrice] = useState([85]);
  const [regulation, setRegulation] = useState([60]);
  const [transitionSpeed, setTransitionSpeed] = useState("moderate");
  const [physicalScenario, setPhysicalScenario] = useState("rcp45");
  const [saved, setSaved] = useState(MOCK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/risks", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const scenarios = json.data.filter((r) => r.risk_type === "scenario");
          if (scenarios.length > 0) setSaved(scenarios);
        }
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [user, getIdToken]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const riskScore = useMemo(() => {
    const base = 50;
    const c = (carbonPrice[0] - 50) * 0.15;
    const r = (regulation[0] - 50) * 0.2;
    const t = transitionSpeed === "fast" ? 10 : transitionSpeed === "slow" ? -5 : 0;
    const p = physicalScenario === "rcp85" ? 15 : physicalScenario === "rcp26" ? -10 : 0;
    return Math.round(Math.max(0, Math.min(100, base + c + r + t + p)));
  }, [carbonPrice, regulation, transitionSpeed, physicalScenario]);

  const financialImpact = useMemo(() => {
    const base = -15;
    const c = (carbonPrice[0] / 50) * -8;
    const r = (regulation[0] / 50) * -6;
    const t = transitionSpeed === "fast" ? -12 : transitionSpeed === "slow" ? -3 : -7;
    return (base + c + r + t).toFixed(1);
  }, [carbonPrice, regulation, transitionSpeed]);

  const projection = useMemo(() => {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const base = 100000;
    const reduction = transitionSpeed === "fast" ? 0.12 : transitionSpeed === "slow" ? 0.04 : 0.08;
    const regMult = regulation[0] / 100;
    return years.map((year, i) => {
      const emissions = base * Math.pow(1 - reduction * regMult, i);
      const carbonCost = (emissions / 1000) * carbonPrice[0];
      const target = base * Math.pow(0.88, i);
      return { year, emissions: Math.round(emissions), carbonCost: Math.round(carbonCost), target: Math.round(target) };
    });
  }, [carbonPrice, regulation, transitionSpeed]);

  const impactByCategory = useMemo(() => {
    const base = [
      { category: "Operations", impact: -12 },
      { category: "Supply Chain", impact: -18 },
      { category: "Compliance", impact: -8 },
      { category: "Market Access", impact: -5 },
      { category: "Capital Cost", impact: -10 },
    ];
    const mult = (carbonPrice[0] / 85) * (regulation[0] / 60);
    return base.map((b) => ({ ...b, impact: Math.round(b.impact * mult) }));
  }, [carbonPrice, regulation]);

  const reset = () => {
    setCarbonPrice([85]);
    setRegulation([60]);
    setTransitionSpeed("moderate");
    setPhysicalScenario("rcp45");
  };

  const loadScenario = (s) => {
    if (!s.description) return;
    try {
      const p = JSON.parse(s.description);
      setCarbonPrice([p.carbonPrice || 85]);
      setRegulation([p.regulationIntensity || 60]);
      setTransitionSpeed(p.transitionSpeed || "moderate");
      setPhysicalScenario(p.physicalRiskScenario || "rcp45");
      toast.success(`Loaded "${s.category}"`);
    } catch { toast.error("Failed to load scenario"); }
  };

  const handleSave = async () => {
    if (!scenarioName.trim()) { toast.error("Enter a name"); return; }
    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;
      const params = { carbonPrice: carbonPrice[0], regulationIntensity: regulation[0], transitionSpeed, physicalRiskScenario: physicalScenario };
      const res = await fetch("/api/dashboard/risks", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          category: scenarioName, risk_type: "scenario", score: riskScore, trend: "stable",
          description: JSON.stringify(params),
        }),
      });
      if (res.ok) {
        toast.success("Scenario saved");
        setDialogOpen(false);
        setScenarioName("");
        fetchSaved();
      } else toast.error("Failed to save");
    } catch (e) { console.error(e); toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const riskTone = riskScore > 70 ? "text-red-600" : riskScore > 50 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Scenario simulator</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Model financial impacts under climate scenarios.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />Reset
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Save className="h-3.5 w-3.5 mr-1" />Save</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Save scenario</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-3">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} placeholder="e.g. High Carbon Price" />
                </div>
                <div className="border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-600 dark:text-neutral-400">
                  Carbon price: ${carbonPrice[0]}/tCO2e · Regulation: {regulation[0]}% · Transition: {transitionSpeed} · Physical: {physicalScenario.toUpperCase()}
                  <br />Risk: {riskScore}/100 · Financial impact: ${financialImpact}M
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Save scenario"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 p-4">
          <p className="text-sm font-medium mb-2">Saved scenarios</p>
          <div className="flex flex-wrap gap-2">
            {saved.map((s) => (
              <button key={s.id} onClick={() => loadScenario(s)}
                className="text-xs px-2 py-1 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                {s.category} <span className="text-neutral-500">· {s.score}/100</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Carbon price</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">${carbonPrice[0]} <span className="text-xs text-neutral-500">/tCO2e</span></p>
          <div className="mt-3"><Slider value={carbonPrice} onChange={setCarbonPrice} min={20} max={200} step={5} /></div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1"><span>$20</span><span>$200</span></div>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Regulation</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{regulation[0]}%</p>
          <div className="mt-3"><Slider value={regulation} onChange={setRegulation} min={10} max={100} step={5} /></div>
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1"><span>Low</span><span>High</span></div>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Transition speed</p>
          <div className="mt-2">
            <Select value={transitionSpeed} onValueChange={setTransitionSpeed}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TRANSITION.map((t) => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-xs text-neutral-500">Physical risk</p>
          <div className="mt-2">
            <Select value={physicalScenario} onValueChange={setPhysicalScenario}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PHYSICAL.map((p) => <SelectItem key={p.v} value={p.v}>{p.l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-950"><Metric label="Risk score" value={<>{riskScore}<span className="text-sm text-neutral-500 font-normal">/100</span></>} tone={riskTone} /></div>
        <div className="bg-white dark:bg-neutral-950"><Metric label="Financial impact (2030)" value={`$${financialImpact}M`} tone="text-red-600" /></div>
        <div className="bg-white dark:bg-neutral-950"><Metric label="Annual carbon cost" value={`$${(projection[0].carbonCost / 1000).toFixed(1)}M`} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-sm font-medium mb-3">Emissions trajectory</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [Number(v).toLocaleString(), ""]} />
              <Legend />
              <Area type="monotone" dataKey="emissions" name="Projected" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.15} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#737373" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-neutral-950 p-4">
          <p className="text-sm font-medium mb-3">Carbon cost projection</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={projection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}K`, "Cost"]} />
              <Bar dataKey="carbonCost" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 p-4">
        <p className="text-sm font-medium mb-3">Impact by category ($M)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={impactByCategory} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={100} />
            <Tooltip formatter={(v) => [`$${v}M`, "Impact"]} />
            <Bar dataKey="impact" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
