"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Building,
  CreditCard,
  Key,
  Users,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  Loader2,
  User,
} from "lucide-react";

const apiKeys = [
  { id: "1", name: "Production API Key", key: "iora_live_sk_12345...abcde", created: "2024-01-10", lastUsed: "2 hours ago" },
  { id: "2", name: "Development Key", key: "iora_test_sk_67890...fghij", created: "2024-01-05", lastUsed: "5 days ago" },
];

const teamMembers = [
  { id: "1", name: "John Smith", email: "john@acmecorp.com", role: "Admin", status: "active" },
  { id: "2", name: "Sarah Johnson", email: "sarah@acmecorp.com", role: "Editor", status: "active" },
  { id: "3", name: "Mike Chen", email: "mike@acmecorp.com", role: "Viewer", status: "pending" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const NOTIFICATION_ITEMS = [
  { key: "email_reports", title: "Email Reports", desc: "Receive weekly summary reports" },
  { key: "risk_alerts", title: "Risk Alerts", desc: "Get notified of risk score changes" },
  { key: "compliance_updates", title: "Compliance Updates", desc: "Regulatory deadline reminders" },
  { key: "product_updates", title: "Product Updates", desc: "New features and improvements" },
];

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState(null);

  // Support ?tab=profile|organization|billing|api-keys|team
  const defaultTab = searchParams.get("tab") || "profile";

  // Profile state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    job_title: "",
    bio: "",
    timezone: "UTC",
    notification_preferences: {
      email_reports: true,
      risk_alerts: true,
      compliance_updates: true,
      product_updates: true,
    },
  });

  // Fetch profile on mount
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile", { headers: getAuthHeaders() });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;
        setProfile({
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          company: d.company || "",
          industry: d.industry || "",
          job_title: d.job_title || "",
          bio: d.bio || "",
          timezone: d.timezone || "UTC",
          notification_preferences: {
            email_reports: d.notification_preferences?.email_reports ?? true,
            risk_alerts: d.notification_preferences?.risk_alerts ?? true,
            compliance_updates: d.notification_preferences?.compliance_updates ?? true,
            product_updates: d.notification_preferences?.product_updates ?? true,
          },
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      toast({ title: "Error", description: "Could not load profile settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          company: profile.company,
          industry: profile.industry,
          job_title: profile.job_title,
          bio: profile.bio,
          timezone: profile.timezone,
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = await res.json();

      if (json.success) {
        toast({ title: "Saved", description: "Profile settings updated successfully." });
      } else {
        toast({ title: "Error", description: json.error?.message || "Failed to save.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast({ title: "Error", description: "Failed to save profile settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Save notification preferences
  const handleToggleNotification = async (key) => {
    const updated = {
      ...profile.notification_preferences,
      [key]: !profile.notification_preferences[key],
    };

    // Optimistic UI update
    setProfile((prev) => ({ ...prev, notification_preferences: updated }));

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ notification_preferences: updated }),
      });

      if (!res.ok) {
        // Revert on failure
        setProfile((prev) => ({
          ...prev,
          notification_preferences: {
            ...prev.notification_preferences,
            [key]: !updated[key],
          },
        }));
        toast({ title: "Error", description: "Failed to update notification setting.", variant: "destructive" });
      }
    } catch {
      setProfile((prev) => ({
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [key]: !updated[key],
        },
      }));
    }
  };

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </motion.div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="data-[state=active]:bg-background">
            <Building className="h-4 w-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-background">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="data-[state=active]:bg-background">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-background">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Personal Information</CardTitle>
                <CardDescription>Your account details linked to this login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profile.name} onChange={handleChange("name")} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled className="bg-muted/40 cursor-not-allowed" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={profile.phone} onChange={handleChange("phone")} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input id="job_title" value={profile.job_title} onChange={handleChange("job_title")} placeholder="e.g. Sustainability Manager" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={profile.bio} onChange={handleChange("bio")} placeholder="A short description about yourself" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value={profile.timezone} onChange={handleChange("timezone")} placeholder="e.g. America/New_York" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Configure how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {NOTIFICATION_ITEMS.map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.desc}</div>
                    </div>
                    <Switch
                      checked={profile.notification_preferences[n.key]}
                      onCheckedChange={() => handleToggleNotification(n.key)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Organization Tab ── */}
        <TabsContent value="organization" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Organization Profile</CardTitle>
                <CardDescription>Your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" value={profile.company} onChange={handleChange("company")} placeholder="Your company" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" value={profile.industry} onChange={handleChange("industry")} placeholder="e.g. Manufacturing" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Billing Tab (unchanged) ── */}
        <TabsContent value="billing" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Current Plan</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Enterprise Plan</span>
                      <Badge>Current</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Unlimited users, all features, dedicated support</p>
                  </div>
                  <Button variant="outline">Manage Plan</Button>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Usage This Period</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold">847</div>
                      <div className="text-xs text-muted-foreground">API Calls</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground">Reports Generated</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded bg-muted">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Visa ending in 4242</div>
                      <div className="text-xs text-muted-foreground">Expires 12/2025</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── API Keys Tab (unchanged) ── */}
        <TabsContent value="api-keys" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">API Keys</CardTitle>
                    <CardDescription>Manage API access to your account</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{apiKey.name}</div>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showKeys[apiKey.id] ? apiKey.key.replace("...", "67890klmno") : apiKey.key}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setShowKeys({ ...showKeys, [apiKey.id]: !showKeys[apiKey.id] })}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          >
                            {copied === apiKey.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">Created {apiKey.created} · Last used {apiKey.lastUsed}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ── Team Tab (unchanged) ── */}
        <TabsContent value="team" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Team Members</CardTitle>
                    <CardDescription>Manage who has access to your organization</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                        <Badge variant="outline">{member.role}</Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
