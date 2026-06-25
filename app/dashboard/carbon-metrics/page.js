"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Factory, Zap, Truck } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const scope1Categories = ["Stationary Combustion", "Mobile Combustion", "Fugitive Emissions", "Process Emissions"];
const scope2Categories = ["Purchased Electricity", "Purchased Heat", "Purchased Cooling"];
const scope3Categories = ["Purchased Goods", "Capital Goods", "Transportation", "Business Travel", "Employee Commute", "Waste Operations", "Use of Products", "End-of-Life"];

const tooltipStyle = {
  contentStyle: {
    fontSize: "12px",
  },
};

export default function CarbonMetricsPage() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const MOCK_EMISSIONS = [
    { id: "m1", scope: 1, category: "Stationary Combustion", value: 4200, unit: "tCO2e", period: "2024-01" },
    { id: "m2", scope: 1, category: "Mobile Combustion", value: 1800, unit: "tCO2e", period: "2024-01" },
    { id: "m3", scope: 1, category: "Fugitive Emissions", value: 650, unit: "tCO2e", period: "2024-02" },
    { id: "m4", scope: 1, category: "Process Emissions", value: 920, unit: "tCO2e", period: "2024-02" },
    { id: "m5", scope: 2, category: "Purchased Electricity", value: 3400, unit: "tCO2e", period: "2024-01" },
    { id: "m6", scope: 2, category: "Purchased Heat", value: 1100, unit: "tCO2e", period: "2024-01" },
    { id: "m7", scope: 2, category: "Purchased Electricity", value: 3100, unit: "tCO2e", period: "2024-02" },
    { id: "m8", scope: 2, category: "Purchased Cooling", value: 450, unit: "tCO2e", period: "2024-02" },
    { id: "m9", scope: 3, category: "Purchased Goods", value: 5200, unit: "tCO2e", period: "2024-01" },
    { id: "m10", scope: 3, category: "Transportation", value: 2800, unit: "tCO2e", period: "2024-01" },
    { id: "m11", scope: 3, category: "Business Travel", value: 950, unit: "tCO2e", period: "2024-02" },
    { id: "m12", scope: 3, category: "Employee Commute", value: 1400, unit: "tCO2e", period: "2024-02" },
    { id: "m13", scope: 3, category: "Waste Operations", value: 680, unit: "tCO2e", period: "2024-01" },
    { id: "m14", scope: 3, category: "Capital Goods", value: 3100, unit: "tCO2e", period: "2024-02" },
  ];

  const [emissions, setEmissions] = useState(MOCK_EMISSIONS);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newEmission, setNewEmission] = useState({
    scope: "1",
    category: "",
    value: "",
    unit: "tCO2e",
    period: new Date().toISOString().slice(0, 7),
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
        if (json.success && json.data && json.data.length > 0) {
          setEmissions(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch emissions:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchEmissions();
  }, [fetchEmissions]);

  const handleAddEmission = async () => {
    if (!newEmission.category || !newEmission.value) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/emissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: parseInt(newEmission.scope),
          category: newEmission.category,
          value: parseFloat(newEmission.value),
          unit: newEmission.unit,
          period: newEmission.period,
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Emission added successfully" });
        setDialogOpen(false);
        setNewEmission({
          scope: "1",
          category: "",
          value: "",
          unit: "tCO2e",
          period: new Date().toISOString().slice(0, 7),
        });
        fetchEmissions();
      } else {
        toast({ title: "Error", description: "Failed to add emission", variant: "destructive" });
      }
    } catch (err) {
      console.error("Failed to add emission:", err);
      toast({ title: "Error", description: "Failed to add emission", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getScopeCategories = (scope) => {
    switch (scope) {
      case "1": return scope1Categories;
      case "2": return scope2Categories;
      case "3": return scope3Categories;
      default: return [];
    }
  };

  const scope1Data = emissions.filter((e) => e.scope === 1);
  const scope2Data = emissions.filter((e) => e.scope === 2);
  const scope3Data = emissions.filter((e) => e.scope === 3);

  const scope1Total = scope1Data.reduce((sum, e) => sum + (e.value || 0), 0);
  const scope2Total = scope2Data.reduce((sum, e) => sum + (e.value || 0), 0);
  const scope3Total = scope3Data.reduce((sum, e) => sum + (e.value || 0), 0);

  const scopeBreakdownData = [
    { name: "Scope 1", value: scope1Total, description: "Direct emissions" },
    { name: "Scope 2", value: scope2Total, description: "Indirect - Energy" },
    { name: "Scope 3", value: scope3Total, description: "Value chain" },
  ];

  const groupByCategory = (data) => {
    const grouped = {};
    data.forEach((e) => {
      if (!grouped[e.category]) {
        grouped[e.category] = 0;
      }
      grouped[e.category] += e.value || 0;
    });
    return Object.entries(grouped).map(([category, emissions]) => ({ category, emissions }));
  };

  const scope1Details = groupByCategory(scope1Data);
  const scope2Details = groupByCategory(scope2Data);
  const scope3Details = groupByCategory(scope3Data);

  const monthlyData = {};
  emissions.forEach((e) => {
    const month = e.period || new Date().toISOString().slice(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { month: month.slice(5), scope1: 0, scope2: 0, scope3: 0 };
    }
    if (e.scope === 1) monthlyData[month].scope1 += e.value || 0;
    if (e.scope === 2) monthlyData[month].scope2 += e.value || 0;
    if (e.scope === 3) monthlyData[month].scope3 += e.value || 0;
  });
  const monthlyEmissions = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Carbon Metrics</h1>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of emissions across all scopes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">FY 2024</Badge>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Emission
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Emission</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Select value={newEmission.scope} onValueChange={(v) => setNewEmission({ ...newEmission, scope: v, category: "" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Scope 1 - Direct</SelectItem>
                      <SelectItem value="2">Scope 2 - Indirect Energy</SelectItem>
                      <SelectItem value="3">Scope 3 - Value Chain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newEmission.category} onValueChange={(v) => setNewEmission({ ...newEmission, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getScopeCategories(newEmission.scope).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value (tCO2e)</Label>
                    <Input
                      type="number"
                      value={newEmission.value}
                      onChange={(e) => setNewEmission({ ...newEmission, value: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Input
                      type="month"
                      value={newEmission.period}
                      onChange={(e) => setNewEmission({ ...newEmission, period: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEmission} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Emission
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Scope 1"
          value={scope1Total.toLocaleString()}
          unit="tCO2e"
          change={`${scope1Data.length} records`}
          changeType="neutral"
          icon={Factory}
        />
        <MetricCard
          title="Scope 2"
          value={scope2Total.toLocaleString()}
          unit="tCO2e"
          change={`${scope2Data.length} records`}
          changeType="neutral"
          icon={Zap}
        />
        <MetricCard
          title="Scope 3"
          value={scope3Total.toLocaleString()}
          unit="tCO2e"
          change={`${scope3Data.length} records`}
          changeType="neutral"
          icon={Truck}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
            <CardDescription>Breakdown by emission scope</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={scopeBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {scopeBreakdownData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value) => [`${Number(value).toLocaleString()} tCO2e`, ""]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly trend</CardTitle>
            <CardDescription>Emissions by scope over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyEmissions}>
                <defs>
                  {COLORS.slice(0, 3).map((color, i) => (
                    <linearGradient key={i} id={`s${i}Grad`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Area type="monotone" dataKey="scope1" name="Scope 1" stroke={COLORS[0]} fill="url(#s0Grad)" />
                <Area type="monotone" dataKey="scope2" name="Scope 2" stroke={COLORS[1]} fill="url(#s1Grad)" />
                <Area type="monotone" dataKey="scope3" name="Scope 3" stroke={COLORS[2]} fill="url(#s2Grad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scope1">
        <TabsList>
          <TabsTrigger value="scope1">Scope 1</TabsTrigger>
          <TabsTrigger value="scope2">Scope 2</TabsTrigger>
          <TabsTrigger value="scope3">Scope 3</TabsTrigger>
        </TabsList>

        <TabsContent value="scope1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scope 1 breakdown</CardTitle>
              <CardDescription>Direct emissions from owned or controlled sources</CardDescription>
            </CardHeader>
            <CardContent>
              {scope1Details.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={scope1Details} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                    <Bar dataKey="emissions" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No Scope 1 emissions recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scope 2 breakdown</CardTitle>
              <CardDescription>Indirect emissions from purchased energy</CardDescription>
            </CardHeader>
            <CardContent>
              {scope2Details.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scope2Details} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                    <Bar dataKey="emissions" fill={COLORS[1]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No Scope 2 emissions recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scope3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scope 3 breakdown</CardTitle>
              <CardDescription>Value chain emissions across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              {scope3Details.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={scope3Details} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                    <Bar dataKey="emissions" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No Scope 3 emissions recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}