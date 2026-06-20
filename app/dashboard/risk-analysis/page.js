"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Thermometer,
  DollarSign,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

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
  { quarter: "Q1 23", physical: 38, transition: 52 },
  { quarter: "Q2 23", physical: 40, transition: 54 },
  { quarter: "Q3 23", physical: 39, transition: 55 },
  { quarter: "Q4 23", physical: 41, transition: 56 },
  { quarter: "Q1 24", physical: 42, transition: 58 },
];

const assetRiskData = [
  { location: "Houston", physical: 75, transition: 62 },
  { location: "Rotterdam", physical: 68, transition: 55 },
  { location: "Shanghai", physical: 52, transition: 70 },
  { location: "Munich", physical: 35, transition: 48 },
  { location: "Singapore", physical: 45, transition: 42 },
];

const trendIcons = {
  increasing: <TrendingUp className="h-3 w-3 text-red-500" />,
  decreasing: <TrendingDown className="h-3 w-3 text-emerald-500" />,
  stable: null,
};

function RiskList({ data }) {
  return (
    <div className="space-y-3">
      {data.map((r) => (
        <div key={r.risk} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{r.risk}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{r.score}/100</span>
              {trendIcons[r.trend]}
            </div>
          </div>
          <Progress value={r.score} className="h-1.5" />
        </div>
      ))}
    </div>
  );
}

export default function RiskAnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Risk Analysis</h1>
          <p className="text-sm text-muted-foreground">
            Climate risk exposure assessment and monitoring
          </p>
        </div>
        <Badge variant="secondary">Q1 2024</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall risk"
          value="52/100"
          change="+3 pts"
          changeType="negative"
          description="vs last quarter"
        />
        <MetricCard
          title="Physical"
          value="42/100"
          change="+2 pts"
          changeType="negative"
          description="vs last quarter"
          icon={Thermometer}
        />
        <MetricCard
          title="Transition"
          value="58/100"
          change="+4 pts"
          changeType="negative"
          description="vs last quarter"
          icon={TrendingUp}
        />
        <MetricCard
          title="Value at risk"
          value="$28.4M"
          change="+$2.1M"
          changeType="negative"
          description="potential impact"
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribution</CardTitle>
            <CardDescription>Physical vs. transition risk</CardDescription>
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
            <CardTitle className="text-sm font-medium">Risk trend</CardTitle>
            <CardDescription>Quarterly score evolution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="physical" name="Physical" stroke={COLORS[0]} strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="transition" name="Transition" stroke={COLORS[1]} strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
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
            <RiskList data={physicalRiskData} />
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
            <RiskList data={transitionRiskData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Asset-level risk
          </CardTitle>
          <CardDescription>Risk scores by location</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={assetRiskData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="location" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Legend />
              <Bar dataKey="physical" name="Physical" fill={COLORS[0]} />
              <Bar dataKey="transition" name="Transition" fill={COLORS[1]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
