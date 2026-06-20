"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Calendar,
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

function StatusIcon({ status }) {
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
}

function StatusBadge({ status }) {
  const styles = {
    aligned: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
    partial: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400",
    "at-risk": "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
  };
  const labels = { aligned: "Aligned", partial: "Partial", "at-risk": "At Risk" };
  return (
    <Badge variant="outline" className={styles[status]}>
      {labels[status]}
    </Badge>
  );
}

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Compliance</h1>
          <p className="text-sm text-muted-foreground">
            Track regulatory alignment and disclosure readiness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Overall status</p>
                <p className="text-xl font-bold">3/4</p>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average score</p>
              <p className="text-xl font-bold">88.5%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Risk flags</p>
              <p className="text-xl font-bold">3 active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Next deadline</p>
                <p className="text-xl font-bold">45 days</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frameworks.map((fw) => (
            <Card key={fw.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={fw.status} />
                    <div>
                      <CardTitle className="text-sm">{fw.name}</CardTitle>
                      <CardDescription className="text-xs">{fw.fullName}</CardDescription>
                    </div>
                  </div>
                  <StatusBadge status={fw.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-medium">{fw.score}%</span>
                  </div>
                  <Progress value={fw.score} className="h-1.5" />
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {fw.categories.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate">{cat.name}</span>
                      <StatusIcon status={cat.status} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Updated {fw.lastUpdated}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    Details
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">Risk flags</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {riskFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className={`mt-0.5 p-1.5 rounded ${
                    flag.severity === "high" ? "bg-red-100 dark:bg-red-950" :
                    flag.severity === "medium" ? "bg-amber-100 dark:bg-amber-950" :
                    "bg-blue-100 dark:bg-blue-950"
                  }`}>
                    <AlertCircle className={`h-3.5 w-3.5 ${
                      flag.severity === "high" ? "text-red-500" :
                      flag.severity === "medium" ? "text-amber-500" :
                      "text-blue-500"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{flag.title}</span>
                      <Badge variant="outline" className={`text-[10px] ${
                        flag.severity === "high" ? "text-red-600 border-red-200" :
                        flag.severity === "medium" ? "text-amber-600 border-amber-200" :
                        "text-blue-600 border-blue-200"
                      }`}>
                        {flag.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span>{flag.action}</span>
                      <span>Due {flag.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
