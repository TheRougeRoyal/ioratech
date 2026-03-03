"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ExternalLink,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";

const frameworks = [
  {
    id: "tcfd",
    name: "TCFD",
    fullName: "Task Force on Climate-related Financial Disclosures",
    status: "aligned",
    score: 92,
    lastUpdated: "2024-01-15",
    categories: [
      { name: "Governance", status: "aligned", score: 95 },
      { name: "Strategy", status: "aligned", score: 90 },
      { name: "Risk Management", status: "aligned", score: 92 },
      { name: "Metrics & Targets", status: "partial", score: 88 },
    ],
  },
  {
    id: "csrd",
    name: "CSRD",
    fullName: "Corporate Sustainability Reporting Directive",
    status: "partial",
    score: 78,
    lastUpdated: "2024-01-10",
    deadline: "2025-01-01",
    categories: [
      { name: "Double Materiality", status: "aligned", score: 85 },
      { name: "Climate Standards", status: "partial", score: 75 },
      { name: "Value Chain", status: "partial", score: 70 },
      { name: "Digital Tagging", status: "at-risk", score: 65 },
    ],
  },
  {
    id: "sec",
    name: "SEC Climate",
    fullName: "SEC Climate Disclosure Rules",
    status: "aligned",
    score: 88,
    lastUpdated: "2024-01-12",
    categories: [
      { name: "Scope 1 & 2", status: "aligned", score: 95 },
      { name: "Scope 3", status: "partial", score: 80 },
      { name: "Climate Risk", status: "aligned", score: 90 },
      { name: "Governance", status: "aligned", score: 92 },
    ],
  },
  {
    id: "ghg",
    name: "GHG Protocol",
    fullName: "Greenhouse Gas Protocol Standards",
    status: "aligned",
    score: 96,
    lastUpdated: "2024-01-14",
    categories: [
      { name: "Scope 1", status: "aligned", score: 98 },
      { name: "Scope 2", status: "aligned", score: 97 },
      { name: "Scope 3", status: "aligned", score: 94 },
      { name: "Verification", status: "aligned", score: 95 },
    ],
  },
];

const riskFlags = [
  {
    id: 1,
    severity: "high",
    title: "CSRD Digital Tagging Gap",
    description: "XBRL taxonomy mapping incomplete for ESRS E1 climate disclosures",
    action: "Review taxonomy requirements",
    deadline: "2024-03-15",
  },
  {
    id: 2,
    severity: "medium",
    title: "Scope 3 Category 11 Data",
    description: "Use of sold products emissions estimates below confidence threshold",
    action: "Improve supplier data collection",
    deadline: "2024-04-01",
  },
  {
    id: 3,
    severity: "low",
    title: "Board Climate Competency",
    description: "Climate expertise documentation needs update for annual report",
    action: "Update board skills matrix",
    deadline: "2024-06-30",
  },
];

const getStatusIcon = (status) => {
  switch (status) {
    case "aligned":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "partial":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "at-risk":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "aligned":
      return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400";
    case "partial":
      return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400";
    case "at-risk":
      return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400";
    default:
      return "";
  }
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CompliancePage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance Monitor</h1>
          <p className="text-muted-foreground">Track regulatory alignment and disclosure readiness</p>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className="text-2xl font-bold">3/4 Aligned</p>
              </div>
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">88.5%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">A-</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Flags</p>
                <p className="text-2xl font-bold">3 Active</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Deadline</p>
                <p className="text-2xl font-bold">45 days</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Frameworks Grid */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold mb-4">Regulatory Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(framework.status)}
                      <div>
                        <CardTitle className="text-base">{framework.name}</CardTitle>
                        <CardDescription className="text-xs">{framework.fullName}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(framework.status)}>
                      {framework.status === "aligned" && "Aligned"}
                      {framework.status === "partial" && "Partial"}
                      {framework.status === "at-risk" && "At Risk"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Score</span>
                      <span className="font-semibold">{framework.score}%</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    {framework.categories.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate">{cat.name}</span>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(cat.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">Updated {framework.lastUpdated}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Risk Flags */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Active Risk Flags</CardTitle>
                <CardDescription>Items requiring attention for compliance</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskFlags.map((flag, index) => (
                <motion.div
                  key={flag.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-border transition-all cursor-pointer"
                >
                  <div className={`p-2 rounded-lg ${
                    flag.severity === "high" ? "bg-red-100 dark:bg-red-950" :
                    flag.severity === "medium" ? "bg-amber-100 dark:bg-amber-950" :
                    "bg-blue-100 dark:bg-blue-950"
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      flag.severity === "high" ? "text-red-500" :
                      flag.severity === "medium" ? "text-amber-500" :
                      "text-blue-500"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium">{flag.title}</h4>
                      <Badge variant="outline" className={`text-[10px] ${
                        flag.severity === "high" ? "text-red-600 border-red-200 bg-red-50 dark:bg-red-950" :
                        flag.severity === "medium" ? "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950" :
                        "text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950"
                      }`}>
                        {flag.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-muted-foreground">Action: {flag.action}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">Due: {flag.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
