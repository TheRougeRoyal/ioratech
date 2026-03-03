"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingDown, AlertTriangle, CheckCircle, Globe, Building, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";

const COLORS = ["hsl(221, 83%, 53%)", "hsl(199, 89%, 48%)", "hsl(215, 20%, 65%)"];

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
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Monitor your climate performance and risk exposure</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Updated 5 min ago
          </Badge>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Emissions Trend</CardTitle>
                  <CardDescription>Monthly total emissions (tCO2e)</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -32% YTD
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={emissionsData}>
                  <defs>
                    <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    formatter={(value) => [`${value.toLocaleString()} tCO2e`, "Emissions"]}
                  />
                  <Area type="monotone" dataKey="emissions" stroke="hsl(221, 83%, 53%)" fill="url(#emissionsGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Emissions by Scope</CardTitle>
              <CardDescription>Distribution across Scope 1, 2, and 3</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={280}>
                  <PieChart>
                    <Pie data={scopeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                      {scopeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value) => [`${value.toLocaleString()} tCO2e`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-4">
                  {scopeData.map((scope, index) => (
                    <div key={scope.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm font-medium">{scope.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{(scope.value / 1000).toFixed(1)}k</div>
                        <div className="text-xs text-muted-foreground">{((scope.value / 100000) * 100).toFixed(0)}%</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Risk Score by Category</CardTitle>
              <CardDescription>Climate risk exposure assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="category" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="score" fill="hsl(221, 83%, 53%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Geographic Distribution</CardTitle>
              <CardDescription>Asset locations and regional exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] bg-muted/30 rounded-lg flex items-center justify-center border border-dashed border-border/50">
                <div className="text-center">
                  <Globe className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm font-medium">Interactive Risk Map</p>
                  <p className="text-xs text-muted-foreground">12 facilities · 8 regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Scenario Summary</CardTitle>
              <CardDescription>Financial impact projections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Net Zero 2050", impact: "-$12.4M", type: "transition", color: "text-blue-500" },
                { name: "Delayed Transition", impact: "-$28.7M", type: "stranded", color: "text-amber-500" },
                { name: "Current Policies", impact: "-$45.2M", type: "physical", color: "text-red-500" },
              ].map((scenario) => (
                <motion.div
                  key={scenario.name}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/30 cursor-pointer hover:border-border transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium">{scenario.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{scenario.type} risk</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${scenario.color}`}>{scenario.impact}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
