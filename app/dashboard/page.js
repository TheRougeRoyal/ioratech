"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingDown, AlertTriangle, CheckCircle, Globe, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
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

const COLORS = ["#2563eb", "#0ea5e9", "#10b981"];

const emissionsData = [
  { month: "Jan", emissions: 12500 },
  { month: "Feb", emissions: 11800 },
  { month: "Mar", emissions: 12200 },
  { month: "Apr", emissions: 11500 },
  { month: "May", emissions: 10900 },
  { month: "Jun", emissions: 10200 },
  { month: "Jul", emissions: 9800 },
  { month: "Aug", emissions: 9500 },
  { month: "Sep", emissions: 9200 },
  { month: "Oct", emissions: 8900 },
  { month: "Nov", emissions: 8600 },
  { month: "Dec", emissions: 8400 },
];

const scopeData = [
  { name: "Scope 1", value: 15400 },
  { name: "Scope 2", value: 28600 },
  { name: "Scope 3", value: 56000 },
];

const riskData = [
  { category: "Physical", score: 42 },
  { category: "Transition", score: 68 },
  { category: "Regulatory", score: 55 },
  { category: "Market", score: 38 },
  { category: "Reputation", score: 25 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page heading */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Climate performance and risk exposure</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-muted-foreground">Live &middot; Updated 5 min ago</span>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Emissions"
          value="100,000"
          unit="tCO2e"
          change="-12.3%"
          changeType="positive"
          description="vs last year"
          icon={Activity}
        />
        <MetricCard
          title="Emissions Intensity"
          value="42.5"
          unit="tCO2e/$M"
          change="-8.7%"
          changeType="positive"
          description="vs last year"
          icon={TrendingDown}
        />
        <MetricCard
          title="Risk Exposure"
          value="Medium"
          unit="52/100"
          change="+3 pts"
          changeType="negative"
          description="vs last quarter"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Compliance"
          value="On Track"
          unit="4/4 aligned"
          change=""
          changeType="neutral"
          description="frameworks"
          icon={CheckCircle}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Emissions Trend</CardTitle>
                  <CardDescription className="text-xs">Monthly total (tCO2e)</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs font-normal">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -32% YTD
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-4 pb-4">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={emissionsData}>
                  <defs>
                    <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value.toLocaleString()} tCO2e`, "Emissions"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stroke="hsl(221, 83%, 53%)"
                    fill="url(#emissionsGradient)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-sm font-medium">Emissions by Scope</CardTitle>
              <CardDescription className="text-xs">Distribution across Scope 1, 2, and 3</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={200} className="sm:max-w-[200px]">
                  <PieChart>
                    <Pie
                      data={scopeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {scopeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [`${value.toLocaleString()} tCO2e`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 w-full">
                  {scopeData.map((scope, index) => (
                    <div key={scope.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm">{scope.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{(scope.value / 1000).toFixed(1)}k</span>
                        <span className="text-xs text-muted-foreground ml-1.5">
                          {((scope.value / 100000) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div variants={item}>
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-sm font-medium">Risk by Category</CardTitle>
              <CardDescription className="text-xs">Climate risk exposure</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-4 pb-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={riskData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    width={72}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-sm font-medium">Geographic Distribution</CardTitle>
              <CardDescription className="text-xs">Asset locations &amp; regional exposure</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4">
              <div className="h-[180px] rounded-lg bg-muted/30 border border-dashed border-border/60 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Interactive Risk Map</p>
                  <p className="text-xs text-muted-foreground/70">12 facilities &middot; 8 regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
          <Card className="border-border/60 h-full">
            <CardHeader className="pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-sm font-medium">Scenario Summary</CardTitle>
              <CardDescription className="text-xs">Financial impact projections</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 space-y-2">
              {[
                { name: "Net Zero 2050", impact: "-$12.4M", type: "transition", color: "text-blue-600 dark:text-blue-400" },
                { name: "Delayed Transition", impact: "-$28.7M", type: "stranded", color: "text-amber-600 dark:text-amber-400" },
                { name: "Current Policies", impact: "-$45.2M", type: "physical", color: "text-red-600 dark:text-red-400" },
              ].map((scenario) => (
                <div
                  key={scenario.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-medium">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{scenario.type} risk</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-base font-semibold ${scenario.color}`}>{scenario.impact}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
