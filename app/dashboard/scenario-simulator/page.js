"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { AlertTriangle, TrendingUp, DollarSign, RefreshCcw, Info } from "lucide-react";

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(212, 95%, 68%)",
  "hsl(199, 89%, 48%)",
];

export default function ScenarioSimulatorPage() {
  const [carbonPrice, setCarbonPrice] = useState([85]);
  const [regulationIntensity, setRegulationIntensity] = useState([60]);
  const [transitionSpeed, setTransitionSpeed] = useState("moderate");
  const [physicalRiskScenario, setPhysicalRiskScenario] = useState("rcp45");

  // Calculate dynamic values based on inputs
  const riskScore = useMemo(() => {
    const base = 50;
    const carbonImpact = (carbonPrice[0] - 50) * 0.15;
    const regulationImpact = (regulationIntensity[0] - 50) * 0.2;
    const transitionImpact = transitionSpeed === "fast" ? 10 : transitionSpeed === "slow" ? -5 : 0;
    const physicalImpact = physicalRiskScenario === "rcp85" ? 15 : physicalRiskScenario === "rcp26" ? -10 : 0;
    return Math.round(Math.max(0, Math.min(100, base + carbonImpact + regulationImpact + transitionImpact + physicalImpact)));
  }, [carbonPrice, regulationIntensity, transitionSpeed, physicalRiskScenario]);

  const financialImpact = useMemo(() => {
    const baseImpact = -15;
    const carbonCost = (carbonPrice[0] / 50) * -8;
    const regulationCost = (regulationIntensity[0] / 50) * -6;
    const transitionCost = transitionSpeed === "fast" ? -12 : transitionSpeed === "slow" ? -3 : -7;
    return (baseImpact + carbonCost + regulationCost + transitionCost).toFixed(1);
  }, [carbonPrice, regulationIntensity, transitionSpeed]);

  const projectionData = useMemo(() => {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const baseEmissions = 100000;
    const reductionRate = transitionSpeed === "fast" ? 0.12 : transitionSpeed === "slow" ? 0.04 : 0.08;
    const regulationMultiplier = regulationIntensity[0] / 100;
    
    return years.map((year, index) => {
      const yearIndex = index;
      const emissions = baseEmissions * Math.pow(1 - (reductionRate * regulationMultiplier), yearIndex);
      const carbonCost = (emissions / 1000) * carbonPrice[0];
      const target = baseEmissions * Math.pow(0.88, yearIndex);
      return {
        year,
        emissions: Math.round(emissions),
        carbonCost: Math.round(carbonCost),
        target: Math.round(target),
      };
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

  const resetToDefaults = () => {
    setCarbonPrice([85]);
    setRegulationIntensity([60]);
    setTransitionSpeed("moderate");
    setPhysicalRiskScenario("rcp45");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scenario Simulator</h1>
          <p className="text-muted-foreground">Model financial impacts under different climate scenarios</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset Defaults
        </Button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Carbon Price
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${carbonPrice[0]}</span>
              <span className="text-sm text-muted-foreground">/tCO2e</span>
            </div>
            <Slider
              value={carbonPrice}
              onValueChange={setCarbonPrice}
              min={20}
              max={200}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$20</span>
              <span>$200</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Regulation Intensity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{regulationIntensity[0]}%</span>
              <Badge variant={regulationIntensity[0] > 70 ? "destructive" : "secondary"} className="text-xs">
                {regulationIntensity[0] > 70 ? "High" : regulationIntensity[0] > 40 ? "Moderate" : "Low"}
              </Badge>
            </div>
            <Slider
              value={regulationIntensity}
              onValueChange={setRegulationIntensity}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Transition Speed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={transitionSpeed} onValueChange={setTransitionSpeed}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow">Slow (Delayed)</SelectItem>
                <SelectItem value="moderate">Moderate (Current)</SelectItem>
                <SelectItem value="fast">Fast (Net Zero)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {transitionSpeed === "fast" && "Aggressive decarbonization aligned with 1.5°C pathway"}
              {transitionSpeed === "moderate" && "Current policies and stated commitments"}
              {transitionSpeed === "slow" && "Delayed action with higher long-term risks"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Physical Risk Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={physicalRiskScenario} onValueChange={setPhysicalRiskScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rcp26">RCP 2.6 (+1.5°C)</SelectItem>
                <SelectItem value="rcp45">RCP 4.5 (+2.5°C)</SelectItem>
                <SelectItem value="rcp85">RCP 8.5 (+4.5°C)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {physicalRiskScenario === "rcp26" && "Paris-aligned scenario with limited physical risks"}
              {physicalRiskScenario === "rcp45" && "Middle-of-road scenario with moderate impacts"}
              {physicalRiskScenario === "rcp85" && "High emissions scenario with severe impacts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Composite Risk Score</p>
              <p className={`text-4xl font-bold ${
                riskScore > 70 ? "text-red-500" : riskScore > 50 ? "text-amber-500" : "text-green-500"
              }`}>
                {riskScore}/100
              </p>
              <Badge variant={riskScore > 70 ? "destructive" : riskScore > 50 ? "secondary" : "default"} className="mt-2">
                {riskScore > 70 ? "High Risk" : riskScore > 50 ? "Medium Risk" : "Low Risk"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Financial Impact (2030)</p>
              <p className="text-4xl font-bold text-red-500">
                ${financialImpact}M
              </p>
              <p className="text-xs text-muted-foreground mt-2">Estimated cumulative cost</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Carbon Cost (Annual)</p>
              <p className="text-4xl font-bold">
                ${(projectionData[0].carbonCost / 1000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-2">At current emissions levels</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Emissions Trajectory</CardTitle>
            <CardDescription>Projected emissions vs. target pathway (tCO2e)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [value.toLocaleString(), ""]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  name="Projected"
                  stroke={COLORS[0]}
                  fill="url(#emissionsGradient)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke={COLORS[2]}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Carbon Cost Projection</CardTitle>
            <CardDescription>Annual carbon liability based on current price ($K)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}K`, "Carbon Cost"]}
                />
                <Bar dataKey="carbonCost" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Impact Breakdown */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Impact by Category</CardTitle>
          <CardDescription>Financial impact breakdown by business area ($M)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={impactByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="category" type="category" tick={{ fill: "hsl(var(--muted-foreground))" }} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`$${value}M`, "Impact"]}
              />
              <Bar dataKey="impact" fill="hsl(0, 62%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
