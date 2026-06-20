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

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function EmissionsChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Emissions trend</CardTitle>
        <CardDescription>Total emissions over time (tCO2e)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.15} />
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="emissions" stroke={COLORS[0]} fill="url(#emGrad)" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ScopeBreakdownChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Emissions by scope</CardTitle>
        <CardDescription>Distribution across Scope 1, 2, and 3</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SectorBenchmarkChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sector benchmarking</CardTitle>
        <CardDescription>Your emissions vs industry average</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="yours" name="Your company" fill={COLORS[0]} />
            <Bar dataKey="industry" name="Industry avg" fill="hsl(var(--muted))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function IntensityTrendChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Emissions intensity</CardTitle>
        <CardDescription>tCO2e per million USD revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="intensity" name="Intensity" stroke={COLORS[0]} strokeWidth={1.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskScoreChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Risk score by category</CardTitle>
        <CardDescription>Climate risk exposure assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
