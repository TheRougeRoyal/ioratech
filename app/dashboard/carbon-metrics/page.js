"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const scopeBreakdownData = [
  { name: "Scope 1", value: 15400, description: "Direct emissions" },
  { name: "Scope 2", value: 28600, description: "Indirect - Energy" },
  { name: "Scope 3", value: 56000, description: "Value chain" },
];

const scope1Details = [
  { category: "Stationary Combustion", emissions: 8200 },
  { category: "Mobile Combustion", emissions: 4100 },
  { category: "Fugitive Emissions", emissions: 2300 },
  { category: "Process Emissions", emissions: 800 },
];

const scope2Details = [
  { category: "Purchased Electricity", emissions: 22400 },
  { category: "Purchased Heat", emissions: 4200 },
  { category: "Purchased Cooling", emissions: 2000 },
];

const scope3Categories = [
  { category: "Purchased Goods", emissions: 18500 },
  { category: "Capital Goods", emissions: 8200 },
  { category: "Transportation", emissions: 7800 },
  { category: "Business Travel", emissions: 3200 },
  { category: "Employee Commute", emissions: 2800 },
  { category: "Waste Operations", emissions: 1500 },
  { category: "Use of Products", emissions: 9800 },
  { category: "End-of-Life", emissions: 4200 },
];

const sectorBenchmark = [
  { name: "Scope 1", yours: 15.4, industry: 22.1 },
  { name: "Scope 2", yours: 28.6, industry: 35.8 },
  { name: "Scope 3", yours: 56.0, industry: 78.4 },
];

const intensityTrend = [
  { year: "2020", intensity: 58.2, target: 55 },
  { year: "2021", intensity: 54.1, target: 52 },
  { year: "2022", intensity: 49.8, target: 49 },
  { year: "2023", intensity: 45.2, target: 46 },
  { year: "2024", intensity: 42.5, target: 43 },
  { year: "2025", intensity: null, target: 40 },
];

const monthlyEmissions = [
  { month: "Jan", scope1: 1350, scope2: 2520, scope3: 4850 },
  { month: "Feb", scope1: 1280, scope2: 2380, scope3: 4620 },
  { month: "Mar", scope1: 1320, scope2: 2450, scope3: 4780 },
  { month: "Apr", scope1: 1240, scope2: 2280, scope3: 4520 },
  { month: "May", scope1: 1180, scope2: 2150, scope3: 4380 },
  { month: "Jun", scope1: 1150, scope2: 2080, scope3: 4280 },
  { month: "Jul", scope1: 1120, scope2: 2020, scope3: 4150 },
  { month: "Aug", scope1: 1100, scope2: 1980, scope3: 4080 },
  { month: "Sep", scope1: 1080, scope2: 1920, scope3: 3980 },
  { month: "Oct", scope1: 1050, scope2: 1850, scope3: 3850 },
  { month: "Nov", scope1: 1020, scope2: 1780, scope3: 3720 },
  { month: "Dec", scope1: 1000, scope2: 1720, scope3: 3600 },
];

const tooltipStyle = {
  contentStyle: {
    fontSize: "12px",
  },
};

export default function CarbonMetricsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Carbon Metrics</h1>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of emissions across all scopes
          </p>
        </div>
        <Badge variant="secondary">FY 2024</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Scope 1"
          value="15,400"
          unit="tCO2e"
          change="-5.2%"
          changeType="positive"
          description="YoY"
          icon={Factory}
        />
        <MetricCard
          title="Scope 2"
          value="28,600"
          unit="tCO2e"
          change="-8.1%"
          changeType="positive"
          description="YoY"
          icon={Zap}
        />
        <MetricCard
          title="Scope 3"
          value="56,000"
          unit="tCO2e"
          change="-14.5%"
          changeType="positive"
          description="YoY"
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
            <CardDescription>Emissions by scope over the year</CardDescription>
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
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={scope1Details} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                  <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                  <Bar dataKey="emissions" fill={COLORS[0]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scope2Details} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                  <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                  <Bar dataKey="emissions" fill={COLORS[1]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={scope3Categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={140} />
                  <Tooltip {...tooltipStyle} formatter={(v) => [`${Number(v).toLocaleString()} tCO2e`, "Emissions"]} />
                  <Bar dataKey="emissions" fill={COLORS[2]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sector benchmarking</CardTitle>
            <CardDescription>Your emissions vs. industry average (ktCO2e)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectorBenchmark} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={72} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Bar dataKey="yours" name="Your company" fill={COLORS[0]} />
                <Bar dataKey="industry" name="Industry avg" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Intensity trend</CardTitle>
            <CardDescription>tCO2e per million USD revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={intensityTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  name="Actual"
                  stroke={COLORS[0]}
                  strokeWidth={1.5}
                  dot={{ r: 3 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
