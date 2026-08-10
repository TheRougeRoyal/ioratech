"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Plus, TrendingUp, TrendingDown, Thermometer } from "lucide-react";
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

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const RISK_TYPES = ["Physical", "Transition"];
const CATEGORIES = [
  "Heat Stress", "Flooding", "Water Scarcity", "Wildfire",
  "Carbon Pricing", "Policy & Legal", "Technology", "Market Shift",
];
const TRENDS = ["increasing", "stable", "decreasing"];

const MOCK = [
  { id: "r1", category: "Heat Stress", risk_type: "Physical", score: 72, trend: "increasing", description: "Extreme heat events increasing" },
  { id: "r2", category: "Flooding", risk_type: "Physical", score: 65, trend: "stable", description: "Coastal and riverine flood risk" },
  { id: "r3", category: "Water Scarcity", risk_type: "Physical", score: 58, trend: "increasing", description: "Declining water availability" },
  { id: "r4", category: "Wildfire", risk_type: "Physical", score: 41, trend: "stable", description: "Seasonal wildfire exposure" },
  { id: "r5", category: "Carbon Pricing", risk_type: "Transition", score: 83, trend: "increasing", description: "Rising carbon tax trajectory" },
  { id: "r6", category: "Policy & Legal", risk_type: "Transition", score: 67, trend: "increasing", description: "Evolving disclosure mandates" },
  { id: "r7", category: "Technology", risk_type: "Transition", score: 54, trend: "stable", description: "Clean tech disruption" },
  { id: "r8", category: "Market Shift", risk_type: "Transition", score: 48, trend: "decreasing", description: "Demand shift to low-carbon products" },
];

function Metric({ label, value, sub }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 p-3">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function RiskRow({ r }) {
  const TrendIcon = r.trend === "increasing" ? TrendingUp : r.trend === "decreasing" ? TrendingDown : null;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{r.category}</span>
        <span className="flex items-center gap-1.5 text-neutral-500">
          {r.score}/100
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
        </span>
      </div>
      <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800">
        <div className="h-full bg-emerald-500" style={{ width: `${r.score}%` }} />
      </div>
    </div>
  );
}

export default function RiskAnalysisPage() {
  const { user, getIdToken } = useAuth();
  const [risks, setRisks] = useState(MOCK);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRisk, setNewRisk] = useState({
    category: "", risk_type: "Physical", score: "", trend: "stable", description: "",
  });

  const fetchRisks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/risks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) setRisks(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch risks:", e);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => { fetchRisks(); }, [fetchRisks]);

  const handleAdd = async () => {
    if (!newRisk.category || !newRisk.score) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/risks", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newRisk.category,
          risk_type: newRisk.risk_type,
          score: parseInt(newRisk.score),
          trend: newRisk.trend,
          description: newRisk.description,
        }),
      });
      if (res.ok) {
        toast.success("Risk added");
        setDialogOpen(false);
        setNewRisk({ category: "", risk_type: "Physical", score: "", trend: "stable", description: "" });
        fetchRisks();
      } else toast.error("Failed to add risk");
    } catch (e) {
      console.error(e);
      toast.error("Failed to add risk");
    } finally {
      setSaving(false);
    }
  };

  const physical = risks.filter((r) => r.risk_type === "Physical");
  const transition = risks.filter((r) => r.risk_type === "Transition");
  const avg = (arr) => (arr.length ? Math.round(arr.reduce((s, r) => s + r.score, 0) / arr.length) : 0);
  const overall = avg(risks);
  const dist = [
    { name: "Physical", value: physical.length || 0 },
    { name: "Transition", value: transition.length || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Risk analysis</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Climate risk exposure assessment.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add risk</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add risk</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-3">
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={newRisk.risk_type} onValueChange={(v) => setNewRisk({ ...newRisk, risk_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{RISK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={newRisk.category} onValueChange={(v) => setNewRisk({ ...newRisk, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Score (0–100)</Label>
                  <Input type="number" min="0" max="100" value={newRisk.score}
                    onChange={(e) => setNewRisk({ ...newRisk, score: e.target.value })} placeholder="50" />
                </div>
                <div className="space-y-1">
                  <Label>Trend</Label>
                  <Select value={newRisk.trend} onValueChange={(v) => setNewRisk({ ...newRisk, trend: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TRENDS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={newRisk.description}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })} placeholder="Optional" />
              </div>
              <Button onClick={handleAdd} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Add risk"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <div className="bg-white dark:bg-neutral-950"><Metric label="Overall" value={`${overall}/100`} sub={`${risks.length} risks`} /></div>
        <div className="bg-white dark:bg-neutral-950"><Metric label="Physical" value={`${avg(physical)}/100`} sub={`${physical.length} risks`} /></div>
        <div className="bg-white dark:bg-neutral-950"><Metric label="Transition" value={`${avg(transition)}/100`} sub={`${transition.length} risks`} /></div>
        <div className="bg-white dark:bg-neutral-950"><Metric label="Total" value={risks.length.toString()} sub="tracked" /></div>
      </div>

      {loading ? (
        <div className="h-32 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3">Distribution</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={dist} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2}>
                    {dist.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3">Average score</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{ name: "Physical", score: avg(physical) }, { name: "Transition", score: avg(transition) }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Thermometer className="h-3.5 w-3.5" />Physical
              </p>
              <div className="space-y-3">
                {physical.length === 0 ? <p className="text-xs text-neutral-500">No data.</p> : physical.map((r) => <RiskRow key={r.id} r={r} />)}
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-4">
              <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />Transition
              </p>
              <div className="space-y-3">
                {transition.length === 0 ? <p className="text-xs text-neutral-500">No data.</p> : transition.map((r) => <RiskRow key={r.id} r={r} />)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
