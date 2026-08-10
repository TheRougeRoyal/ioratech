"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar,
} from "recharts";
import {
  ArrowRight, TrendingDown, Leaf, FileText, Shield, AlertTriangle,
  Activity, Cloud, Flame, Factory, Sparkles, Plus, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
const SCOPE_COLORS = ["#ef4444", "#f59e0b", "#3b82f6"];

// ponytail: aggregate-by-period on the client; 12-month window covers the seeded mock and most real accounts. Move to API aggregation when emissions exceed ~500 rows.
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const PERIOD_KEYS = ["2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08"];

const MOCK_EMISSIONS = [
  { id: "e1", scope: "Scope 1", category: "Stationary Combustion", value: 142.5, period: "2025-08" },
  { id: "e2", scope: "Scope 1", category: "Mobile Combustion", value: 68.3, period: "2025-07" },
  { id: "e3", scope: "Scope 1", category: "Fugitive Emissions", value: 12.1, period: "2025-05" },
  { id: "e4", scope: "Scope 2", category: "Purchased Electricity", value: 389.7, period: "2025-08" },
  { id: "e5", scope: "Scope 2", category: "Purchased Steam", value: 54.2, period: "2025-05" },
  { id: "e6", scope: "Scope 3", category: "Business Travel", value: 218.4, period: "2025-08" },
  { id: "e7", scope: "Scope 3", category: "Purchased Goods", value: 1240.6, period: "2025-08" },
  { id: "e8", scope: "Scope 3", category: "Employee Commute", value: 96.8, period: "2025-05" },
  { id: "e9", scope: "Scope 3", category: "Upstream Transport", value: 312.0, period: "2025-05" },
  { id: "e10", scope: "Scope 1", category: "Stationary Combustion", value: 128.4, period: "2025-03" },
  { id: "e11", scope: "Scope 2", category: "Purchased Electricity", value: 401.2, period: "2025-03" },
  { id: "e12", scope: "Scope 3", category: "Purchased Goods", value: 1198.0, period: "2025-03" },
  { id: "e13", scope: "Scope 1", category: "Mobile Combustion", value: 71.0, period: "2024-12" },
  { id: "e14", scope: "Scope 2", category: "Purchased Electricity", value: 412.5, period: "2024-12" },
];

const MOCK_REPORTS = [
  { id: "rp1", name: "Annual ESG Report 2024", type: "ESG Report", status: "published", date: "2024-03-15" },
  { id: "rp2", name: "Q1 2024 Climate Risk Assessment", type: "Risk Assessment", status: "published", date: "2024-04-01" },
  { id: "rp3", name: "CSRD Readiness Report", type: "Compliance Report", status: "in-review", date: "2024-05-10" },
  { id: "rp4", name: "Scope 3 Deep Dive", type: "Quarterly Report", status: "draft", date: "2024-06-01" },
];

const MOCK_RISKS = [
  { id: "r1", category: "Heat Stress", risk_type: "Physical", score: 72, trend: "increasing" },
  { id: "r2", category: "Flooding", risk_type: "Physical", score: 65, trend: "stable" },
  { id: "r3", category: "Water Scarcity", risk_type: "Physical", score: 58, trend: "increasing" },
  { id: "r4", category: "Wildfire", risk_type: "Physical", score: 41, trend: "stable" },
  { id: "r5", category: "Carbon Pricing", risk_type: "Transition", score: 83, trend: "increasing" },
  { id: "r6", category: "Policy & Legal", risk_type: "Transition", score: 67, trend: "increasing" },
  { id: "r7", category: "Technology", risk_type: "Transition", score: 54, trend: "stable" },
  { id: "r8", category: "Market Shift", risk_type: "Transition", score: 48, trend: "decreasing" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function statusClasses(s) {
  if (s === "published") return "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (s === "in-review") return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800";
}

function Sparkline({ data, color = "#10b981" }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#g-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function Skeleton() {
  return <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />;
}

export default function DashboardPage() {
  const { user, getIdToken } = useAuth();
  const [emissions, setEmissions] = useState(MOCK_EMISSIONS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [risks, setRisks] = useState(MOCK_RISKS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;
      const [e, r, k] = await Promise.all([
        fetch("/api/dashboard/emissions", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/dashboard/reports", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/dashboard/risks", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (e.ok) { const j = await e.json(); if (j.success && j.data?.length) setEmissions(j.data); }
      if (r.ok) { const j = await r.json(); if (j.success && j.data?.length) setReports(j.data); }
      if (k.ok) { const j = await k.json(); if (j.success && j.data?.length) setRisks(j.data); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [user, getIdToken]);

  useEffect(() => { load(); }, [load]);

  const sum = (arr) => arr.reduce((s, e) => s + (Number(e.value) || 0), 0);
  const totalEmissions = sum(emissions);
  const ytd = emissions.filter((e) => (e.period || "").startsWith("2025-")).reduce((s, e) => s + (Number(e.value) || 0), 0);
  const lastMonth = emissions.filter((e) => e.period === "2025-08").reduce((s, e) => s + (Number(e.value) || 0), 0);
  const prevMonth = emissions.filter((e) => e.period === "2025-07").reduce((s, e) => s + (Number(e.value) || 0), 0);
  const mom = prevMonth ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;

  const publishedReports = reports.filter((r) => r.status === "published").length;
  const draftReports = reports.filter((r) => r.status !== "published").length;
  const complianceScore = Math.max(40, 100 - Math.round(risks.reduce((s, r) => s + r.score, 0) / Math.max(risks.length, 1) * 0.7));
  const activeAlerts = risks.filter((r) => r.trend === "increasing" && r.score >= 60).length;

  // Build 12-month trend from emissions
  const trend = PERIOD_KEYS.map((k, i) => {
    const monthEm = emissions.filter((e) => e.period === k);
    return {
      m: MONTHS[i],
      v: Math.round(monthEm.reduce((s, e) => s + (Number(e.value) || 0), 0)),
    };
  });

  const scopeData = [
    { name: "Scope 1", value: Math.round(sum(emissions.filter((e) => e.scope === "Scope 1"))) },
    { name: "Scope 2", value: Math.round(sum(emissions.filter((e) => e.scope === "Scope 2"))) },
    { name: "Scope 3", value: Math.round(sum(emissions.filter((e) => e.scope === "Scope 3"))) },
  ];

  const riskByType = [
    { name: "Physical", score: Math.round(avg(risks.filter((r) => r.risk_type === "Physical").map((r) => r.score))) },
    { name: "Transition", score: Math.round(avg(risks.filter((r) => r.risk_type === "Transition").map((r) => r.score))) },
  ];
  function avg(a) { return a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0; }

  const gaugeData = [{ name: "score", value: complianceScore, fill: complianceScore >= 80 ? "#10b981" : complianceScore >= 60 ? "#f59e0b" : "#ef4444" }];

  const displayName = user?.displayName || user?.email?.split("@")[0] || "there";
  const recentActivity = [
    ...emissions.slice(-3).reverse().map((e) => ({
      kind: "emission", icon: Leaf, color: "emerald",
      text: `${Number(e.value).toFixed(1)} tCO2e · ${e.category}`,
      sub: `${e.scope} · ${e.period}`,
    })),
    ...reports.slice(-2).reverse().map((r) => ({
      kind: "report", icon: FileText, color: "blue",
      text: r.name,
      sub: `${r.type} · ${r.status === "in-review" ? "In Review" : r.status}`,
    })),
    ...risks.filter((r) => r.trend === "increasing").slice(0, 2).map((r) => ({
      kind: "risk", icon: AlertTriangle, color: "amber",
      text: `${r.category} risk increasing`,
      sub: `${r.risk_type} · score ${r.score}/100`,
    })),
  ].slice(0, 6);

  const colorMap = {
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 via-white to-emerald-50/60 dark:from-neutral-900 dark:via-neutral-950 dark:to-emerald-950/30">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-40 w-40 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="h-3 w-3" />Live dashboard
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {greeting()}, {displayName}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
                Your climate program at a glance — {emissions.length} emissions, {reports.length} reports, {risks.length} risks tracked across your organization.
              </p>
            </div>
            <Link
              href="/dashboard/carbon-metrics"
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              <Plus className="h-4 w-4" />Record emission
            </Link>
          </div>

          {/* KPI strip inside hero */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200/60 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
            <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Total emissions</p>
                <Leaf className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{totalEmissions.toFixed(0)} <span className="text-xs font-normal text-neutral-500">tCO2e</span></p>
              <p className="text-[10px] text-neutral-500 mt-0.5">YTD {ytd.toFixed(0)} tCO2e</p>
            </div>
            <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">MoM change</p>
                {mom < 0 ? <TrendingDown className="h-3.5 w-3.5 text-emerald-600" /> : <Activity className="h-3.5 w-3.5 text-amber-600" />}
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">
                {mom === 0 ? "—" : `${mom > 0 ? "+" : ""}${mom.toFixed(1)}%`}
              </p>
              <p className="text-[10px] text-neutral-500 mt-0.5">vs Jul 2025</p>
            </div>
            <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Reports</p>
                <FileText className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{reports.length}</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{publishedReports} published · {draftReports} draft</p>
            </div>
            <div className="bg-white/80 dark:bg-neutral-950/80 backdrop-blur p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Compliance</p>
                <Shield className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <p className="mt-1.5 text-xl font-semibold tabular-nums">{complianceScore}<span className="text-xs font-normal text-neutral-500">/100</span></p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{activeAlerts} active alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Trend chart — 2 cols */}
        <div className="xl:col-span-2 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-medium">Emissions trend</h2>
              <p className="text-xs text-neutral-500">Trailing 12 months · tCO2e</p>
            </div>
            <span className="text-xs text-neutral-500">Sep 2024 — Aug 2025</span>
          </div>
          <div className="p-4">
            {loading ? <Skeleton /> : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trend} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a3a3a3" />
                  <Tooltip formatter={(v) => `${v} tCO2e`} />
                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#trendFill)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Compliance gauge */}
        <div className="border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-medium">Compliance score</h2>
              <p className="text-xs text-neutral-500">Risk-weighted</p>
            </div>
            <Shield className="h-4 w-4 text-violet-600" />
          </div>
          <div className="p-4">
            {loading ? <Skeleton /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" barSize={14} data={gaugeData} startAngle={210} endAngle={-30}>
                    <RadialBar background dataKey="value" cornerRadius={6} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="text-center -mt-32 pointer-events-none">
                  <p className="text-3xl font-semibold tabular-nums">{complianceScore}</p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">out of 100</p>
                </div>
                <div className="pt-16 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Physical risk</span>
                    <span className="font-medium tabular-nums">{riskByType[0].score}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Transition risk</span>
                    <span className="font-medium tabular-nums">{riskByType[1].score}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Active alerts</span>
                    <span className="font-medium tabular-nums">{activeAlerts}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scope breakdown */}
        <div className="border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-medium">By scope</h2>
              <p className="text-xs text-neutral-500">GHG Protocol</p>
            </div>
          </div>
          <div className="p-4">
            {loading ? <Skeleton /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={scopeData} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={2}>
                      {scopeData.map((_, i) => <Cell key={i} fill={SCOPE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => `${v} tCO2e`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {[
                    { name: "Scope 1", icon: Flame, color: "text-red-600" },
                    { name: "Scope 2", icon: Factory, color: "text-amber-600" },
                    { name: "Scope 3", icon: Cloud, color: "text-blue-600" },
                  ].map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <s.icon className={`h-3 w-3 ${s.color}`} />
                        {s.name}
                      </span>
                      <span className="font-medium tabular-nums">{scopeData[i].value} tCO2e</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-medium">Quick actions</h2>
              <p className="text-xs text-neutral-500">Jump into a workflow</p>
            </div>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="p-2">
            {[
              { href: "/dashboard/carbon-metrics", icon: Leaf, title: "Record emissions", desc: "Log a measurement across any scope" },
              { href: "/dashboard/reports", icon: FileText, title: "Generate report", desc: "TCFD, GRI, SASB, CSRD & more" },
              { href: "/dashboard/risk-analysis", icon: AlertTriangle, title: "Assess risks", desc: "Score physical & transition risks" },
              { href: "/dashboard/scenario-simulator", icon: Activity, title: "Run scenario", desc: "Model 1.5°C & net-zero pathways" },
              { href: "/dashboard/api-keys", icon: Shield, title: "API access", desc: "Wire emissions data into your stack" },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center gap-3 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 group">
                <div className="h-8 w-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30">
                  <a.icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-neutral-500 truncate">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-medium">Recent activity</h2>
              <p className="text-xs text-neutral-500">Latest across your account</p>
            </div>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="p-3 space-y-2"><Skeleton /><div className="h-2 w-20 bg-neutral-200 dark:bg-neutral-800 animate-pulse" /></div>
            ) : recentActivity.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">No activity yet</div>
            ) : (
              recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3">
                  <div className={`h-7 w-7 flex items-center justify-center border ${colorMap[a.color]}`}>
                    <a.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{a.text}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{a.sub}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Third row: scope strip with sparklines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        {[
          { name: "Scope 1", icon: Flame, color: "#ef4444", sub: "Direct emissions" },
          { name: "Scope 2", icon: Factory, color: "#f59e0b", sub: "Indirect (energy)" },
          { name: "Scope 3", icon: Cloud, color: "#3b82f6", sub: "Value chain" },
        ].map((s, i) => {
          const v = scopeData[i].value;
          const months = trend.map((t) => ({ v: t.v / 3 }));
          return (
            <div key={s.name} className="bg-white dark:bg-neutral-950 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <s.icon className="h-3.5 w-3.5" style={{ color: s.color }} />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.name}</p>
                </div>
                <Link href="/dashboard/carbon-metrics" className="text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50 inline-flex items-center gap-0.5">
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums">{v} <span className="text-xs font-normal text-neutral-500">tCO2e</span></p>
              <p className="text-[10px] text-neutral-500 mt-0.5">{s.sub}</p>
              <div className="mt-3 -mx-1">
                <Sparkline data={months} color={s.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Health checklist */}
      <div className="border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-sm font-medium">Setup checklist</h2>
            <p className="text-xs text-neutral-500">Get to a complete climate program</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800">
          {[
            { done: emissions.length > 0, label: "Record first emission", href: "/dashboard/carbon-metrics" },
            { done: risks.length > 0, label: "Assess climate risks", href: "/dashboard/risk-analysis" },
            { done: reports.length > 0, label: "Generate a report", href: "/dashboard/reports" },
            { done: false, label: "Connect an API key", href: "/dashboard/api-keys" },
          ].map((c, i) => (
            <Link key={i} href={c.href} className="flex items-center gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 group">
              <div className={`h-6 w-6 flex items-center justify-center border ${c.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-neutral-300 dark:border-neutral-700 text-neutral-400"}`}>
                {c.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <p className={`text-sm ${c.done ? "text-neutral-500 line-through" : "font-medium"}`}>{c.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
