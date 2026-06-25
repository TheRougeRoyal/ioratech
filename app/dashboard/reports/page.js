"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Plus,
  Loader2,
  Inbox,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const reportTypes = ["ESG Report", "Quarterly Report", "Risk Assessment", "Compliance Report", "Annual Report", "Custom"];
const frameworkOptions = ["TCFD", "GRI", "SASB", "GHG Protocol", "CSRD", "ESRS", "ISSB", "CDP"];

const statusStyles = {
  published: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
  draft: "text-muted-foreground",
  "in-review": "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400",
};

export default function ReportsPage() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reportItems, setReportItems] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    type: "",
    status: "draft",
    frameworks: [],
  });

  const fetchReports = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReportItems(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAddReport = async () => {
    if (!newReport.name || !newReport.type) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newReport.name,
          type: newReport.type,
          status: newReport.status,
          frameworks: newReport.frameworks,
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Report created successfully" });
        setDialogOpen(false);
        setNewReport({ name: "", type: "", status: "draft", frameworks: [] });
        fetchReports();
      } else {
        toast({ title: "Error", description: "Failed to create report", variant: "destructive" });
      }
    } catch (err) {
      console.error("Failed to create report:", err);
      toast({ title: "Error", description: "Failed to create report", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleFramework = (fw) => {
    setNewReport((prev) => ({
      ...prev,
      frameworks: prev.frameworks.includes(fw)
        ? prev.frameworks.filter((f) => f !== fw)
        : [...prev.frameworks, fw],
    }));
  };

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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Report Name</Label>
                <Input
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g. Annual ESG Report 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={newReport.type} onValueChange={(v) => setNewReport({ ...newReport, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frameworks</Label>
                <div className="flex flex-wrap gap-2">
                  {frameworkOptions.map((fw) => (
                    <Badge
                      key={fw}
                      variant={newReport.frameworks.includes(fw) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleFramework(fw)}
                    >
                      {fw}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddReport} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
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
          ) : reportItems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                <h3 className="text-sm font-medium">No reports yet</h3>
                <p className="text-xs text-muted-foreground mt-1">Generate your first report to get started.</p>
              </CardContent>
            </Card>
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
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${statusStyles[report.status] || ""}`}>
                              {report.status === "in-review" ? "In Review" : report.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{report.type}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {report.date || "No date"}
                            </span>
                          </div>
                          {report.frameworks && report.frameworks.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                              {report.frameworks.map((fw) => (
                                <Badge key={fw} variant="secondary" className="text-[10px]">
                                  {fw}
                                </Badge>
                              ))}
                            </div>
                          )}
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
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : published.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                <h3 className="text-sm font-medium">No published reports</h3>
                <p className="text-xs text-muted-foreground mt-1">Finalize and publish a report.</p>
              </CardContent>
            </Card>
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
                            {report.date || "No date"}
                          </span>
                        </div>
                        {report.frameworks && report.frameworks.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {report.frameworks.map((fw) => (
                              <Badge key={fw} variant="secondary" className="text-[10px]">{fw}</Badge>
                            ))}
                          </div>
                        )}
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
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : drafts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <Inbox className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                <h3 className="text-sm font-medium">No drafts</h3>
                <p className="text-xs text-muted-foreground mt-1">Start a report draft to collaborate.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {drafts.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{report.name}</span>
                          <Badge variant="outline" className={`text-[10px] ${statusStyles[report.status] || ""}`}>
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
      </Tabs>
    </div>
  );
}