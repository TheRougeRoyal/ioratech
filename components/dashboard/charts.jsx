"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = [
  "#2563eb", // blue-600
  "#0ea5e9", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
];

export function EmissionsChart({ data }) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Emissions Trend</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Total emissions over time (tCO2e)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="emissions"
              stroke="hsl(221, 83%, 53%)"
              fill="url(#emissionsGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ScopeBreakdownChart({ data }) {
  return (
    <Card className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">Emissions by Scope</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">Distribution across Scope 1, 2, and 3</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
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
  );
}

export function SectorBenchmarkChart({ data }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Sector Benchmarking</CardTitle>
        <CardDescription>Your emissions vs industry average</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="yours" name="Your Company" fill="hsl(221, 83%, 53%)" />
            <Bar dataKey="industry" name="Industry Avg" fill="hsl(215, 20%, 65%)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IntensityTrendChart({ data }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Emissions Intensity</CardTitle>
        <CardDescription>tCO2e per million USD revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="year"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="intensity"
              name="Intensity"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={{ fill: "hsl(221, 83%, 53%)" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="hsl(199, 89%, 48%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskScoreChart({ data }) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Risk Score by Category</CardTitle>
        <CardDescription>Climate risk exposure assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="category"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="score" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
