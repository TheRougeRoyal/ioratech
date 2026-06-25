"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCcw, Save, Loader2, History } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export default function ScenarioSimulatorPage() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const [carbonPrice, setCarbonPrice] = useState([85]);
  const [regulationIntensity, setRegulationIntensity] = useState([60]);
  const [transitionSpeed, setTransitionSpeed] = useState("moderate");
  const [physicalRiskScenario, setPhysicalRiskScenario] = useState("rcp45");
  const MOCK_SCENARIOS = [
    { id: "s1", category: "Base Case 2024", risk_type: "scenario", score: 55, description: JSON.stringify({ carbonPrice: 85, regulationIntensity: 60, transitionSpeed: "moderate", physicalRiskScenario: "rcp45" }) },
    { id: "s2", category: "High Carbon Price", risk_type: "scenario", score: 72, description: JSON.stringify({ carbonPrice: 150, regulationIntensity: 80, transitionSpeed: "fast", physicalRiskScenario: "rcp45" }) },
    { id: "s3", category: "Delayed Transition", risk_type: "scenario", score: 68, description: JSON.stringify({ carbonPrice: 45, regulationIntensity: 30, transitionSpeed: "slow", physicalRiskScenario: "rcp85" }) },
  ];

  const [savedScenarios, setSavedScenarios] = useState(MOCK_SCENARIOS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState("");

  const fetchScenarios = useCallback(async () => {
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
        if (json.success && json.data) {
          const scenarios = json.data.filter((r) => r.risk_type === "scenario");
          if (scenarios.length > 0) {
            setSavedScenarios(scenarios);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch scenarios:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const riskScore = useMemo(() => {
    const base = 50;
    const carbonImpact = (carbonPrice[0] - 50) * 0.15;
    const regulationImpact = (regulationIntensity[0] - 50) * 0.2;
    const transitionImpact = transitionSpeed === "fast" ? 10 : transitionSpeed === "slow" ? -5 : 0;
    const physicalImpact = physicalRiskScenario === "rcp85" ? 15 : physicalRiskScenario === "rcp26" ? -10 : 0;
    return Math.round(Math.max(0, Math.min(100, base + carbonImpact + regulationImpact + transitionImpact + physicalImpact)));
  }, [carbonPrice, regulationIntensity, transitionSpeed, physicalRiskScenario]);

  const financialImpact = useMemo(() => {
    const base = -15;
    const carbonCost = (carbonPrice[0] / 50) * -8;
    const regulationCost = (regulationIntensity[0] / 50) * -6;
    const transitionCost = transitionSpeed === "fast" ? -12 : transitionSpeed === "slow" ? -3 : -7;
    return (base + carbonCost + regulationCost + transitionCost).toFixed(1);
  }, [carbonPrice, regulationIntensity, transitionSpeed]);

  const projectionData = useMemo(() => {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const baseEmissions = 100000;
    const reductionRate = transitionSpeed === "fast" ? 0.12 : transitionSpeed === "slow" ? 0.04 : 0.08;
    const regulationMultiplier = regulationIntensity[0] / 100;

    return years.map((year, i) => {
      const emissions = baseEmissions * Math.pow(1 - reductionRate * regulationMultiplier, i);
      const carbonCost = (emissions / 1000) * carbonPrice[0];
      const target = baseEmissions * Math.pow(0.88, i);
      return { year, emissions: Math.round(emissions), carbonCost: Math.round(carbonCost), target: Math.round(target) };
    });
  }, [carbonPrice, regulationIntensity, transitionSpeed]);

  const impactByCategory = useMemo(() => {
    const base = [
      { category: "Operations", impact: -12 },
      { category: "Supply Chain", impact: -18 },
      { category: "Compliance", impact: -8 },
      { category: "Market Access", impact: -5 },
      { category: "Capital Cost", impact: -10 },
    ];
    return base.map((item) => ({
      ...item,
      impact: Math.round(item.impact * (carbonPrice[0] / 85) * (regulationIntensity[0] / 60)),
    }));
  }, [carbonPrice, regulationIntensity]);

  const reset = () => {
    setCarbonPrice([85]);
    setRegulationIntensity([60]);
    setTransitionSpeed("moderate");
    setPhysicalRiskScenario("rcp45");
  };

  const loadScenario = (scenario) => {
    if (scenario.description) {
      try {
        const params = JSON.parse(scenario.description);
        setCarbonPrice([params.carbonPrice || 85]);
        setRegulationIntensity([params.regulationIntensity || 60]);
        setTransitionSpeed(params.transitionSpeed || "moderate");
        setPhysicalRiskScenario(params.physicalRiskScenario || "rcp45");
        toast({ title: "Loaded", description: `Scenario "${scenario.category}" loaded` });
      } catch {
        toast({ title: "Error", description: "Failed to load scenario parameters", variant: "destructive" });
      }
    }
  };

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) {
      toast({ title: "Error", description: "Please enter a scenario name", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;

      const params = {
        carbonPrice: carbonPrice[0],
        regulationIntensity: regulationIntensity[0],
        transitionSpeed,
        physicalRiskScenario,
      };

      const res = await fetch("/api/dashboard/risks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: scenarioName,
          risk_type: "scenario",
          score: riskScore,
          trend: "stable",
          description: JSON.stringify(params),
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Scenario saved successfully" });
        setDialogOpen(false);
        setScenarioName("");
        fetchScenarios();
      } else {
        toast({ title: "Error", description: "Failed to save scenario", variant: "destructive" });
      }
    } catch (err) {
      console.error("Failed to save scenario:", err);
      toast({ title: "Error", description: "Failed to save scenario", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Scenario Simulator</h1>
          <p className="text-sm text-muted-foreground">
            Model financial impacts under different climate scenarios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Scenario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Scenario Name</Label>
                  <Input
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="e.g. High Carbon Price Scenario"
                  />
                </div>
                <div className="p-3 rounded-lg bg-muted text-sm">
                  <p className="font-medium">Current parameters:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Carbon price: ${carbonPrice[0]}/tCO2e | Regulation: {regulationIntensity[0]}% | Transition: {transitionSpeed} | Physical: {physicalRiskScenario.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Risk score: {riskScore}/100 | Financial impact: ${financialImpact}M
                  </p>
                </div>
                <Button onClick={handleSaveScenario} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Scenario
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {savedScenarios.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              Saved Scenarios
            </CardTitle>
            <CardDescription>Click to load a previously saved scenario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedScenarios.map((scenario) => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadScenario(scenario)}
                  className="text-xs"
                >
                  {scenario.category}
                  <Badge variant="secondary" className="ml-2 text-[10px]">{scenario.score}/100</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">${carbonPrice[0]}</span>
              <span className="text-xs text-muted-foreground">/tCO2e</span>
            </div>
            <Slider value={carbonPrice} onValueChange={setCarbonPrice} min={20} max={200} step={5} />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>$20</span>
              <span>$200</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Regulation intensity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{regulationIntensity[0]}%</span>
              <Badge variant={regulationIntensity[0] > 70 ? "destructive" : "secondary"} className="text-[10px]">
                {regulationIntensity[0] > 70 ? "High" : regulationIntensity[0] > 40 ? "Moderate" : "Low"}
              </Badge>
            </div>
            <Slider value={regulationIntensity} onValueChange={setRegulationIntensity} min={10} max={100} step={5} />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transition speed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={transitionSpeed} onValueChange={setTransitionSpeed}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow (Delayed)</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="fast">Fast (Net Zero)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {transitionSpeed === "fast" && "Aggressive decarbonization aligned with 1.5\u00b0C"}
              {transitionSpeed === "moderate" && "Current policies and stated commitments"}
              {transitionSpeed === "slow" && "Delayed action with higher long-term risks"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Physical risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={physicalRiskScenario} onValueChange={setPhysicalRiskScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rcp26">RCP 2.6 (+1.5\u00b0C)</SelectItem>
                <SelectItem value="rcp45">RCP 4.5 (+2.5\u00b0C)</SelectItem>
                <SelectItem value="rcp85">RCP 8.5 (+4.5\u00b0C)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {physicalRiskScenario === "rcp26" && "Paris-aligned with limited physical risks"}
              {physicalRiskScenario === "rcp45" && "Middle-of-road with moderate impacts"}
              {physicalRiskScenario === "rcp85" && "High emissions with severe impacts"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Risk score</p>
            <p className={`text-3xl font-bold ${
              riskScore > 70 ? "text-red-500" : riskScore > 50 ? "text-amber-500" : "text-emerald-500"
            }`}>
              {riskScore}
              <span className="text-sm font-normal text-muted-foreground">/100</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Financial impact (2030)</p>
            <p className="text-3xl font-bold text-red-500">${financialImpact}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Annual carbon cost</p>
            <p className="text-3xl font-bold">${(projectionData[0].carbonCost / 1000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emissions trajectory</CardTitle>
            <CardDescription>Projected vs. target pathway (tCO2e)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [Number(v).toLocaleString(), ""]} />
                <Legend />
                <Area type="monotone" dataKey="emissions" name="Projected" stroke={COLORS[0]} fill="url(#emGrad)" strokeWidth={1.5} />
                <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon cost projection</CardTitle>
            <CardDescription>Annual liability at current price ($K)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}K`, "Cost"]} />
                <Bar dataKey="carbonCost" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Impact by category</CardTitle>
          <CardDescription>Financial impact by business area ($M)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={impactByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip formatter={(v) => [`$${v}M`, "Impact"]} />
              <Bar dataKey="impact" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}