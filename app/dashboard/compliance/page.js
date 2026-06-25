"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, CheckCircle2, AlertCircle, XCircle, ChevronRight, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const frameworkOptions = ["TCFD", "CSRD", "SEC Climate", "GHG Protocol", "GRI", "SASB", "ISSB", "CDP"];
const statusOptions = ["aligned", "partial", "at-risk"];

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
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFramework, setNewFramework] = useState({
    framework: "",
    status: "aligned",
    score: "",
  });

  const fetchCompliance = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/compliance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setFrameworks(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch compliance:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  const handleAddFramework = async () => {
    if (!newFramework.framework || !newFramework.score) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;

      const res = await fetch("/api/dashboard/compliance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          framework: newFramework.framework,
          status: newFramework.status,
          score: parseInt(newFramework.score),
          categories: [],
        }),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Framework added successfully" });
        setDialogOpen(false);
        setNewFramework({ framework: "", status: "aligned", score: "" });
        fetchCompliance();
      } else {
        toast({ title: "Error", description: "Failed to add framework", variant: "destructive" });
      }
    } catch (err) {
      console.error("Failed to add framework:", err);
      toast({ title: "Error", description: "Failed to add framework", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const alignedCount = frameworks.filter((f) => f.status === "aligned").length;
  const avgScore = frameworks.length > 0
    ? Math.round(frameworks.reduce((sum, f) => sum + f.score, 0) / frameworks.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Compliance</h1>
          <p className="text-sm text-muted-foreground">
            Track regulatory alignment and disclosure readiness
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Framework
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Framework</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Framework</Label>
                <Select value={newFramework.framework} onValueChange={(v) => setNewFramework({ ...newFramework, framework: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworkOptions.map((fw) => (
                      <SelectItem key={fw} value={fw}>{fw}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={newFramework.status} onValueChange={(v) => setNewFramework({ ...newFramework, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Score (0-100)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newFramework.score}
                    onChange={(e) => setNewFramework({ ...newFramework, score: e.target.value })}
                    placeholder="85"
                  />
                </div>
              </div>
              <Button onClick={handleAddFramework} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Framework
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Overall status</p>
                <p className="text-xl font-bold">{alignedCount}/{frameworks.length}</p>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average score</p>
              <p className="text-xl font-bold">{avgScore}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total frameworks</p>
              <p className="text-xl font-bold">{frameworks.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Aligned</p>
                <p className="text-xl font-bold">{alignedCount}</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">Frameworks</h2>
        {frameworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {frameworks.map((fw) => (
              <Card key={fw.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={fw.status} />
                      <div>
                        <CardTitle className="text-sm">{fw.framework}</CardTitle>
                        <CardDescription className="text-xs">{fw.framework} Standards</CardDescription>
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
                  {fw.categories && fw.categories.length > 0 && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {fw.categories.map((cat, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate">{cat.name}</span>
                            <StatusIcon status={cat.status} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center">
              <Shield className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
              <h3 className="text-sm font-medium">No frameworks yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Add a compliance framework to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}