"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, TrendingUp, TrendingDown, MapPin, Thermometer, DollarSign } from "lucide-react";
import {
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
import { MetricCard } from "@/components/dashboard/metric-card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const riskTypes = ["Physical", "Transition"];
const categories = ["Heat Stress", "Flooding", "Water Scarcity", "Sea Level Rise", "Wildfire", "Carbon Pricing", "Policy & Legal", "Technology", "Market Shift", "Reputation"];

const trendIcons = {
  increasing: <TrendingUp className="h-3 w-3 text-red-500" />,
  decreasing: <TrendingDown className="h-3 w-3 text-emerald-500" />,
  stable: null,
};

function RiskList({ data }) {
  return (
    <div className="space-y-3">
      {data.length > 0 ? data.map((r) => (
        <div key={r.id || r.risk} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{r.category || r.risk}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{r.score}/100</span>
              {trendIcons[r.trend]}
            </div>
          </div>
          <Progress value={r.score} className="h-1.5" />
        </div>
      )) : (
        <p className="text-sm text-muted-foreground text-center py-4">No risks recorded yet.</p>
      )}
    </div>
  );
}

export default function RiskAnalysisPage() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const MOCK_RISKS = [
    { id: "r1", category: "Heat Stress", risk_type: "Physical", score: 72, trend: "increasing", description: "Extreme heat events increasing" },
    { id: "r2", category: "Flooding", risk_type: "Physical", score: 65, trend: "stable", description: "Coastal and riverine flood risk" },
    { id: "r3", category: "Water Scarcity", risk_type: "Physical", score: 58, trend: "increasing", description: "Declining water availability" },
    { id: "r4", category: "Wildfire", risk_type: "Physical", score: 41, trend: "stable", description: "Seasonal wildfire exposure" },
    { id: "r5", category: "Carbon Pricing", risk_type: "Transition", score: 83, trend: "increasing", description: "Rising carbon tax trajectory" },
    { id: "r6", category: "Policy & Legal", risk_type: "Transition", score: 67, trend: "increasing", description: "Evolving disclosure mandates" },
    { id: "r7", category: "Technology", risk_type: "Transition", score: 54, trend: "stable", description: "Clean tech disruption" },
    { id: "r8", category: "Market Shift", risk_type: "Transition", score: 48, trend: "decreasing", description: "Demand shift to low-carbon products" },
  ];

  const [risks, setRisks] = useState(MOCK_RISKS);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newRisk, setNewRisk] = useState({
    category: "",
    risk_type: "Physical",
    score: "",
    trend: "stable",
    description: "",
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
        if (json.success && json.data && json.data.length > 0) {
          setRisks(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch risks:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchRisks();
  }, [fetchRisks]);

  const handleAddRisk = async () => {
    if (!newRisk.category || !newRisk.score) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/risks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newRisk.category,
          risk_type: newRisk.risk_type,
          score: parseInt(newRisk.score),
          trend: newRisk.trend,
          description: newRisk.description,
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Risk added successfully" });
        setDialogOpen(false);
        setNewRisk({ category: "", risk_type: "Physical", score: "", trend: "stable", description: "" });
        fetchRisks();
      } else {
        toast({ title: "Error", description: "Failed to add risk", variant: "destructive" });
      }
    } catch (err) {
      console.error("Failed to add risk:", err);
      toast({ title: "Error", description: "Failed to add risk", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const physicalRisks = risks.filter((r) => r.risk_type === "Physical");
  const transitionRisks = risks.filter((r) => r.risk_type === "Transition");

  const physicalScore = physicalRisks.length > 0
    ? Math.round(physicalRisks.reduce((sum, r) => sum + r.score, 0) / physicalRisks.length)
    : 0;
  const transitionScore = transitionRisks.length > 0
    ? Math.round(transitionRisks.reduce((sum, r) => sum + r.score, 0) / transitionRisks.length)
    : 0;
  const overallScore = risks.length > 0
    ? Math.round(risks.reduce((sum, r) => sum + r.score, 0) / risks.length)
    : 0;

  const riskDistribution = [
    { name: "Physical", value: physicalRisks.length || 0 },
    { name: "Transition", value: transitionRisks.length || 0 },
  ];

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
          <h1 className="text-2xl font-bold tracking-tight">Risk Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Climate risk exposure assessment and monitoring
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Risk
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Risk</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Risk Type</Label>
                <Select value={newRisk.risk_type} onValueChange={(v) => setNewRisk({ ...newRisk, risk_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newRisk.category} onValueChange={(v) => setNewRisk({ ...newRisk, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Score (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newRisk.score}
                    onChange={(e) => setNewRisk({ ...newRisk, score: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trend</Label>
                  <Select value={newRisk.trend} onValueChange={(v) => setNewRisk({ ...newRisk, trend: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increasing">Increasing</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="decreasing">Decreasing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Input
                  value={newRisk.description}
                  onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <Button onClick={handleAddRisk} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Risk
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall risk"
          value={`${overallScore}/100`}
          change={`${risks.length} risks`}
          changeType="neutral"
          description="tracked"
        />
        <MetricCard
          title="Physical"
          value={`${physicalScore}/100`}
          change={`${physicalRisks.length} risks`}
          changeType="neutral"
          icon={Thermometer}
        />
        <MetricCard
          title="Transition"
          value={`${transitionScore}/100`}
          change={`${transitionRisks.length} risks`}
          changeType="neutral"
          icon={TrendingUp}
        />
        <MetricCard
          title="Total risks"
          value={risks.length.toString()}
          change="tracked"
          changeType="neutral"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
            <CardDescription>Physical vs. transition risk count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk scores</CardTitle>
            <CardDescription>Average score by risk type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[{ name: "Physical", score: physicalScore }, { name: "Transition", score: transitionScore }]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Physical risks
            </CardTitle>
            <CardDescription>Direct climate hazard exposure</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskList data={physicalRisks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Transition risks
            </CardTitle>
            <CardDescription>Low-carbon transition exposure</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskList data={transitionRisks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}