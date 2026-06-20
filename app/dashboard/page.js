"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/lib/auth-context";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-6"><Skeleton className="h-[240px] w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Iora</h1>
        <p className="text-muted-foreground">Get started with your climate intelligence platform.</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto max-w-sm space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Set up your dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Add your organization's emissions data, risk assessments, and compliance
              frameworks to see your personalized overview.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button asChild size="sm">
                <Link href="/dashboard/carbon-metrics">
                  <Plus className="h-4 w-4 mr-1" />
                  Add data
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings?tab=profile">
                  Complete profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Track emissions", desc: "Monitor Scope 1, 2, and 3 across your org.", href: "/dashboard/carbon-metrics" },
          { title: "Assess risks", desc: "Identify climate-related business risks.", href: "/dashboard/risk-analysis" },
          { title: "Ensure compliance", desc: "Stay aligned with TCFD, CSRD, and more.", href: "/dashboard/compliance" },
        ].map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboardData();

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  const hasData = data && (data.emissions.length > 0 || data.risks.length > 0 || data.compliance.length > 0);
  if (!hasData) return <EmptyState />;

  const name = data?.profile?.name || user?.displayName || user?.email?.split("@")[0] || "there";

  const totalEmissions = data.emissions.reduce((s, e) => s + (e.value || 0), 0);
  const scope1 = data.emissions.filter((e) => e.scope === 1).reduce((s, e) => s + (e.value || 0), 0);
  const scope2 = data.emissions.filter((e) => e.scope === 2).reduce((s, e) => s + (e.value || 0), 0);
  const scope3 = data.emissions.filter((e) => e.scope === 3).reduce((s, e) => s + (e.value || 0), 0);

  const avgRisk = data.risks.length
    ? Math.round(data.risks.reduce((s, r) => s + (r.score || 0), 0) / data.risks.length)
    : 0;

  const aligned = data.compliance.filter((c) => c.status === "aligned").length;

  const scopeChartData = [
    { name: "Scope 1", value: scope1 },
    { name: "Scope 2", value: scope2 },
    { name: "Scope 3", value: scope3 },
  ].filter((d) => d.value > 0);

  const riskChartData = data.risks.slice(0, 5).map((r) => ({
    category: r.category || r.risk_type,
    score: r.score || 0,
  }));

  const emissionsByPeriod = data.emissions.reduce((acc, e) => {
    const key = e.period || "Unknown";
    const existing = acc.find((a) => a.period === key);
    if (existing) existing.emissions += e.value || 0;
    else acc.push({ period: key, emissions: e.value || 0 });
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {name}
          </h1>
          <p className="text-sm text-muted-foreground">Your climate performance overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total emissions"
          value={totalEmissions.toLocaleString()}
          unit="tCO2e"
          description="across all scopes"
          icon={Activity}
        />
        <MetricCard
          title="Risk score"
          value={String(avgRisk)}
          unit="/100"
          changeType={avgRisk > 50 ? "negative" : "positive"}
          description="average exposure"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Compliance"
          value={`${aligned}/${data.compliance.length}`}
          description="frameworks aligned"
          icon={CheckCircle}
        />
        <MetricCard
          title="Reports"
          value={String(data.reports.length)}
          description="generated"
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {emissionsByPeriod.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Emissions trend</CardTitle>
              <CardDescription>Periodic totals in tCO2e</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={emissionsByPeriod}>
                  <defs>
                    <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value) => [`${Number(value).toLocaleString()} tCO2e`, "Emissions"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="hsl(var(--primary))"
                    fill="url(#emGrad)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {scopeChartData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">By scope</CardTitle>
              <CardDescription>Distribution across Scope 1, 2, and 3</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={scopeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {scopeChartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${Number(value).toLocaleString()} tCO2e`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {scopeChartData.map((scope, i) => (
                    <div key={scope.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span>{scope.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{(scope.value / 1000).toFixed(1)}k</span>
                        <span className="text-muted-foreground ml-1.5 text-xs">
                          {totalEmissions > 0 ? Math.round((scope.value / totalEmissions) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {riskChartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk by category</CardTitle>
            <CardDescription>Climate risk exposure</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Add emissions", href: "/dashboard/carbon-metrics" },
              { label: "Risk analysis", href: "/dashboard/risk-analysis" },
              { label: "Compliance", href: "/dashboard/compliance" },
              { label: "Reports", href: "/dashboard/reports" },
            ].map((a) => (
              <Button key={a.label} variant="outline" size="sm" asChild>
                <Link href={a.href}>{a.label}</Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
