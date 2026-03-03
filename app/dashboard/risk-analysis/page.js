"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Factory,
  DollarSign,
} from "lucide-react";
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

const COLORS = [
  "hsl(221, 83%, 53%)",
  "hsl(212, 95%, 68%)",
  "hsl(199, 89%, 48%)",
  "hsl(215, 20%, 65%)",
];

const physicalRiskData = [
  { risk: "Heat Stress", score: 72, trend: "increasing" },
  { risk: "Flooding", score: 58, trend: "stable" },
  { risk: "Water Scarcity", score: 45, trend: "increasing" },
  { risk: "Sea Level Rise", score: 32, trend: "increasing" },
  { risk: "Wildfire", score: 28, trend: "stable" },
];

const transitionRiskData = [
  { risk: "Carbon Pricing", score: 68, trend: "increasing" },
  { risk: "Policy & Legal", score: 62, trend: "increasing" },
  { risk: "Technology", score: 55, trend: "stable" },
  { risk: "Market Shift", score: 48, trend: "stable" },
  { risk: "Reputation", score: 35, trend: "decreasing" },
];

const riskDistribution = [
  { name: "Physical", value: 42 },
  { name: "Transition", value: 58 },
];

const riskTrend = [
  { quarter: "Q1 2023", physical: 38, transition: 52 },
  { quarter: "Q2 2023", physical: 40, transition: 54 },
  { quarter: "Q3 2023", physical: 39, transition: 55 },
  { quarter: "Q4 2023", physical: 41, transition: 56 },
  { quarter: "Q1 2024", physical: 42, transition: 58 },
];

const assetRiskData = [
  { location: "Houston Facility", physicalRisk: 75, transitionRisk: 62, value: 45 },
  { location: "Rotterdam Port", physicalRisk: 68, transitionRisk: 55, value: 38 },
  { location: "Shanghai Office", physicalRisk: 52, transitionRisk: 70, value: 28 },
  { location: "Munich HQ", physicalRisk: 35, transitionRisk: 48, value: 52 },
  { location: "Singapore Hub", physicalRisk: 45, transitionRisk: 42, value: 32 },
];

export default function RiskAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Risk Analysis</h1>
          <p className="text-muted-foreground">Climate risk exposure assessment and monitoring</p>
        </div>
        <Badge variant="secondary">Updated: Q1 2024</Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Risk Score"
          value="52/100"
          change="+3 pts"
          changeType="negative"
          description="vs last quarter"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Physical Risk"
          value="42/100"
          change="+2 pts"
          changeType="negative"
          description="vs last quarter"
          icon={Thermometer}
        />
        <MetricCard
          title="Transition Risk"
          value="58/100"
          change="+4 pts"
          changeType="negative"
          description="vs last quarter"
          icon={TrendingUp}
        />
        <MetricCard
          title="Value at Risk"
          value="$28.4M"
          change="+$2.1M"
          changeType="negative"
          description="potential impact"
          icon={DollarSign}
        />
      </div>

      {/* Risk Distribution & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Physical vs. transition risk exposure</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Risk Score Trend</CardTitle>
            <CardDescription>Quarterly risk score evolution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="quarter" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="physical" name="Physical" stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0] }} />
                <Line type="monotone" dataKey="transition" name="Transition" stroke={COLORS[1]} strokeWidth={2} dot={{ fill: COLORS[1] }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Risk Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2" />
              Physical Risks
            </CardTitle>
            <CardDescription>Direct climate hazard exposure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {physicalRiskData.map((risk) => (
              <div key={risk.risk} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{risk.risk}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{risk.score}/100</span>
                    {risk.trend === "increasing" && <TrendingUp className="h-3 w-3 text-red-500" />}
                    {risk.trend === "decreasing" && <TrendingDown className="h-3 w-3 text-green-500" />}
                  </div>
                </div>
                <Progress value={risk.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Factory className="h-5 w-5 mr-2" />
              Transition Risks
            </CardTitle>
            <CardDescription>Low-carbon transition exposure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {transitionRiskData.map((risk) => (
              <div key={risk.risk} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{risk.risk}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{risk.score}/100</span>
                    {risk.trend === "increasing" && <TrendingUp className="h-3 w-3 text-red-500" />}
                    {risk.trend === "decreasing" && <TrendingDown className="h-3 w-3 text-green-500" />}
                  </div>
                </div>
                <Progress value={risk.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Asset-Level Risk */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Asset-Level Risk Exposure
          </CardTitle>
          <CardDescription>Risk scores by location and asset value ($M)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assetRiskData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="location" type="category" tick={{ fill: "hsl(var(--muted-foreground))" }} width={120} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="physicalRisk" name="Physical Risk" fill={COLORS[0]} />
              <Bar dataKey="transitionRisk" name="Transition Risk" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
