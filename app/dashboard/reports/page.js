"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, FileText, Inbox } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const TYPES = ["ESG Report", "Quarterly Report", "Risk Assessment", "Compliance Report", "Annual Report", "Custom"];
const FRAMEWORKS = ["TCFD", "GRI", "SASB", "GHG Protocol", "CSRD", "ESRS", "ISSB", "CDP"];

const MOCK = [
  { id: "rp1", name: "Annual ESG Report 2024", type: "ESG Report", status: "published", date: "2024-03-15", frameworks: ["TCFD", "GRI", "SASB"] },
  { id: "rp2", name: "Q1 2024 Climate Risk Assessment", type: "Risk Assessment", status: "published", date: "2024-04-01", frameworks: ["TCFD", "CDP"] },
  { id: "rp3", name: "CSRD Readiness Report", type: "Compliance Report", status: "in-review", date: "2024-05-10", frameworks: ["CSRD", "ESRS"] },
  { id: "rp4", name: "Scope 3 Deep Dive", type: "Quarterly Report", status: "draft", date: "2024-06-01", frameworks: ["GHG Protocol"] },
  { id: "rp5", name: "Sustainability Report 2025", type: "Annual Report", status: "draft", date: null, frameworks: ["TCFD", "GRI", "SASB", "CDP"] },
];

function Skeleton() {
  return <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />;
}

function statusClasses(s) {
  if (s === "published") return "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
  if (s === "in-review") return "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
  return "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800";
}

export default function ReportsPage() {
  const { user, getIdToken } = useAuth();
  const [reports, setReports] = useState(MOCK);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ name: "", type: "", frameworks: [] });

  const fetchReports = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/reports", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) setReports(json.data);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [user, getIdToken]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleAdd = async () => {
    if (!draft.name || !draft.type) { toast.error("Fill in all required fields"); return; }
    try {
      setSaving(true);
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch("/api/dashboard/reports", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name, type: draft.type, status: "draft",
          frameworks: draft.frameworks, date: new Date().toISOString().slice(0, 10),
        }),
      });
      if (res.ok) {
        toast.success("Report created");
        setDialogOpen(false);
        setDraft({ name: "", type: "", frameworks: [] });
        fetchReports();
      } else toast.error("Failed to create report");
    } catch (e) { console.error(e); toast.error("Failed to create report"); }
    finally { setSaving(false); }
  };

  const toggleFw = (fw) => setDraft((p) => ({
    ...p, frameworks: p.frameworks.includes(fw) ? p.frameworks.filter((f) => f !== fw) : [...p.frameworks, fw],
  }));

  const published = reports.filter((r) => r.status === "published");
  const drafts = reports.filter((r) => r.status !== "published");
  const list = tab === "published" ? published : tab === "draft" ? drafts : reports;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Reports</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Generate and manage ESG disclosures.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create report</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create report</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Annual ESG 2024" />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Frameworks</Label>
                <div className="flex flex-wrap gap-1.5">
                  {FRAMEWORKS.map((fw) => (
                    <button key={fw} type="button" onClick={() => toggleFw(fw)}
                      className={`text-xs px-2 py-0.5 border ${draft.frameworks.includes(fw) ? "border-neutral-900 dark:border-neutral-50 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900" : "border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"}`}>
                      {fw}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAdd} disabled={saving} className="w-full">
                {saving ? "Creating..." : "Create report"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
        {[["all", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-3 py-1.5 text-sm -mb-px border-b ${tab === k ? "border-neutral-900 dark:border-neutral-50 text-neutral-900 dark:text-neutral-50" : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 space-y-2"><Skeleton /><div className="h-2 w-20 bg-neutral-200 dark:bg-neutral-800 animate-pulse" /></div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-10 text-center">
          <Inbox className="h-6 w-6 mx-auto text-neutral-400 mb-2" />
          <p className="text-sm font-medium">No reports here</p>
          <p className="text-xs text-neutral-500 mt-0.5">Create one to get started.</p>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
          {list.map((r) => (
            <div key={r.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <FileText className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{r.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 border ${statusClasses(r.status)}`}>
                      {r.status === "in-review" ? "In Review" : r.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{r.type} · {r.date || "No date"}</p>
                  {r.frameworks?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.frameworks.map((fw) => <span key={fw} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">{fw}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
