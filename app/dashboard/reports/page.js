"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  Eye,
  Share2,
  MoreHorizontal,
  Filter,
  Inbox,
} from "lucide-react";

const reports = [
  {
    id: "1",
    name: "Annual ESG Report 2024",
    type: "ESG Report",
    status: "published",
    frameworks: ["TCFD", "GRI", "SASB"],
    date: "2024-01-15",
    pages: 84,
    downloads: 1247,
  },
  {
    id: "2",
    name: "Q4 2023 Emissions Report",
    type: "Quarterly Report",
    status: "published",
    frameworks: ["GHG Protocol"],
    date: "2024-01-10",
    pages: 32,
    downloads: 856,
  },
  {
    id: "3",
    name: "TCFD Climate Risk Assessment",
    type: "Risk Assessment",
    status: "draft",
    frameworks: ["TCFD"],
    date: "2024-01-20",
    pages: 56,
    downloads: 0,
  },
  {
    id: "4",
    name: "CSRD Readiness Report",
    type: "Compliance Report",
    status: "in-review",
    frameworks: ["CSRD", "ESRS"],
    date: "2024-01-18",
    pages: 48,
    downloads: 0,
  },
];

const templates = [
  {
    id: "tpl-1",
    name: "Board Climate Brief",
    description: "Executive summary of emissions, risk signals, and mitigation actions.",
    frameworks: ["TCFD", "ISSB"],
    time: "20 min",
  },
  {
    id: "tpl-2",
    name: "CSRD Climate Package",
    description: "Structured ESRS E1 disclosure pack with policy, metrics, and targets.",
    frameworks: ["CSRD", "ESRS"],
    time: "35 min",
  },
  {
    id: "tpl-3",
    name: "Supplier Scope 3 Digest",
    description: "Category-level Scope 3 trends, confidence bands, and data quality notes.",
    frameworks: ["GHG Protocol"],
    time: "25 min",
  },
];

function ReportSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-10 text-center">
        <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

const statusStyles = {
  published: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
  draft: "text-muted-foreground",
  "in-review": "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400",
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportItems, setReportItems] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setReportItems(reports);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const published = reportItems.filter((r) => r.status === "published");
  const drafts = reportItems.filter((r) => r.status !== "published");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and manage ESG disclosures and reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filter
          </Button>
          <Button size="sm">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Generate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <ReportSkeleton />
          ) : reportItems.length === 0 ? (
            <EmptyState title="No reports yet" description="Generate your first report to get started." />
          ) : (
            <div className="space-y-3">
              {reportItems.map((report) => (
                <Card key={report.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-md bg-muted shrink-0">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium truncate">{report.name}</h3>
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${statusStyles[report.status]}`}>
                              {report.status === "in-review" ? "In Review" : report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{report.type}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {report.pages} pages
                            </span>
                            {report.status === "published" && (
                              <span className="inline-flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {report.downloads}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            {report.frameworks.map((fw) => (
                              <Badge key={fw} variant="secondary" className="text-[10px]">
                                {fw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          {loading ? (
            <ReportSkeleton rows={2} />
          ) : published.length === 0 ? (
            <EmptyState title="No published reports" description="Finalize and publish a report." />
          ) : (
            <div className="space-y-3">
              {published.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-sm font-medium">{report.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {report.downloads}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {report.frameworks.map((fw) => (
                            <Badge key={fw} variant="secondary" className="text-[10px]">{fw}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          {loading ? (
            <ReportSkeleton rows={2} />
          ) : drafts.length === 0 ? (
            <EmptyState title="No drafts" description="Start a report draft to collaborate." />
          ) : (
            <div className="space-y-3">
              {drafts.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{report.name}</span>
                          <Badge variant="outline" className={`text-[10px] ${statusStyles[report.status]}`}>
                            {report.status === "draft" ? "Draft" : "In Review"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{report.type}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          {loading ? (
            <ReportSkeleton rows={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <Card key={tpl.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{tpl.name}</CardTitle>
                    <CardDescription className="text-xs">{tpl.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tpl.frameworks.map((fw) => (
                        <Badge key={fw} variant="outline" className="text-[10px]">{fw}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tpl.time}
                      </span>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
