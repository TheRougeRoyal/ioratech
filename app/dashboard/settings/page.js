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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { logOut } from "@/lib/auth";
import {
  Building,
  CreditCard,
  Key,
  Users,
  Plus,
  Loader2,
  User,
  Trash2,
  Shield,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_OPTIONS = ["admin", "member", "viewer"];
const ROLE_STYLES = {
  owner: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  admin: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  member: "bg-muted text-muted-foreground",
  viewer: "bg-muted text-muted-foreground",
};

function TeamManagementTab() {
  const { user, getIdToken } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getIdToken();
      const res = await fetch("/api/team/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMembers(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return;
    }

    try {
      setInviting(true);
      const token = await getIdToken();
      const res = await fetch("/api/team/members", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });

      const json = await res.json();
      if (json.success) {
        toast({ title: "Success", description: "Member added successfully" });
        setInviteOpen(false);
        setInviteEmail("");
        setInviteRole("member");
        fetchMembers();
      } else {
        toast({ title: "Error", description: json.error?.message || "Failed to add member", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async () => {
    if (!selectedMember) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/team/members?id=${selectedMember.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        toast({ title: "Success", description: "Member removed" });
        setMembers(members.filter((m) => m.id !== selectedMember.id));
      } else {
        toast({ title: "Error", description: json.error?.message || "Failed to remove member", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
    } finally {
      setRemoveDialogOpen(false);
      setSelectedMember(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Team members</CardTitle>
              <CardDescription>Manage who has access to your organization</CardDescription>
            </div>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium">No team members yet</p>
              <p className="text-xs text-muted-foreground mt-1">Invite colleagues to collaborate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {(member.name || member.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name || "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] capitalize ${ROLE_STYLES[member.role] || ""}`}>
                      {member.role}
                    </Badge>
                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setSelectedMember(member);
                          setRemoveDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Send an invite to a colleague. They must already have an account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full access</SelectItem>
                  <SelectItem value="member">Member — read & write</SelectItem>
                  <SelectItem value="viewer">Viewer — read only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={handleInvite} disabled={inviting} size="sm">
                {inviting && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Invite
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedMember?.name || selectedMember?.email} from the team. They will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const NOTIFICATION_ITEMS = [
  { key: "email_reports", title: "Email Reports", desc: "Weekly summary reports" },
  { key: "risk_alerts", title: "Risk Alerts", desc: "Risk score changes" },
  { key: "compliance_updates", title: "Compliance Updates", desc: "Regulatory deadline reminders" },
  { key: "product_updates", title: "Product Updates", desc: "New features and improvements" },
];

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, getIdToken } = useAuth();
  const defaultTab = searchParams.get("tab") || "profile";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aakash Raj",
    email: "",
    phone: "+1 (555) 123-4567",
    company: "Iora Technologies",
    industry: "Climate Tech",
    job_title: "Sustainability Engineer",
    bio: "Leading climate intelligence initiatives and emissions reduction strategies.",
    timezone: "America/New_York",
    notification_preferences: {
      email_reports: true,
      risk_alerts: true,
      compliance_updates: true,
      product_updates: true,
    },
  });

  const getAuthHeaders = useCallback(async () => {
    const token = await getIdToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [getIdToken]);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/profile", { headers });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setProfile((prev) => ({
          name: d.name || prev.name,
          email: d.email || user.email || prev.email,
          phone: d.phone || prev.phone,
          company: d.company || prev.company,
          industry: d.industry || prev.industry,
          job_title: d.job_title || prev.job_title,
          bio: d.bio || prev.bio,
          timezone: d.timezone || prev.timezone,
          notification_preferences: {
            email_reports: d.notification_preferences?.email_reports ?? prev.notification_preferences.email_reports,
            risk_alerts: d.notification_preferences?.risk_alerts ?? prev.notification_preferences.risk_alerts,
            compliance_updates: d.notification_preferences?.compliance_updates ?? prev.notification_preferences.compliance_updates,
            product_updates: d.notification_preferences?.product_updates ?? prev.notification_preferences.product_updates,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      toast({ title: "Error", description: "Could not load profile settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, router, toast, getAuthHeaders]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers,
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
        toast({ title: "Saved", description: "Profile updated." });
      } else {
        toast({ title: "Error", description: json.error?.message || "Failed to save.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = async (key) => {
    const updated = { ...profile.notification_preferences, [key]: !profile.notification_preferences[key] };
    setProfile((prev) => ({ ...prev, notification_preferences: updated }));

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers,
        body: JSON.stringify({ notification_preferences: updated }),
      });

      if (!res.ok) {
        setProfile((prev) => ({
          ...prev,
          notification_preferences: { ...prev.notification_preferences, [key]: !updated[key] },
        }));
        toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
      }
    } catch {
      setProfile((prev) => ({
        ...prev,
        notification_preferences: { ...prev.notification_preferences, [key]: !updated[key] },
      }));
    }
  };

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-3.5 w-3.5 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building className="h-3.5 w-3.5 mr-1.5" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-3.5 w-3.5 mr-1.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <Key className="h-3.5 w-3.5 mr-1.5" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Personal information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Full name</Label>
                  <Input id="name" value={profile.name} onChange={handleChange("name")} placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" value={profile.email} disabled className="bg-muted" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" value={profile.phone} onChange={handleChange("phone")} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="job_title" className="text-xs">Job title</Label>
                  <Input id="job_title" value={profile.job_title} onChange={handleChange("job_title")} placeholder="e.g. Sustainability Manager" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs">Bio</Label>
                <Textarea id="bio" value={profile.bio} onChange={handleChange("bio")} placeholder="A short description" rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs">Timezone</Label>
                <Input id="timezone" value={profile.timezone} onChange={handleChange("timezone")} placeholder="e.g. America/New_York" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} size="sm">
                  {saving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notifications</CardTitle>
              <CardDescription>How you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {NOTIFICATION_ITEMS.map((n) => (
                <div key={n.key} className="flex items-center justify-between py-1.5">
                  <div>
                    <div className="text-sm font-medium">{n.title}</div>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="text-sm font-medium">Sign out</div>
                  <div className="text-xs text-muted-foreground">Sign out on this device</div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleSignOut}>Sign out</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Organization profile</CardTitle>
              <CardDescription>Your company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs">Company name</Label>
                  <Input id="company" value={profile.company} onChange={handleChange("company")} placeholder="Your company" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-xs">Industry</Label>
                  <Input id="industry" value={profile.industry} onChange={handleChange("industry")} placeholder="e.g. Manufacturing" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving} size="sm">
                  {saving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Current plan</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Free plan</span>
                    <Badge>Current</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Basic features, limited API calls</p>
                </div>
                <Button variant="outline" size="sm">Upgrade</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">API keys</CardTitle>
                  <CardDescription>Manage API access</CardDescription>
                </div>
                <Button size="sm" onClick={() => router.push("/dashboard/api-keys/create")}>
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">API keys are managed on the dedicated page.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <TeamManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
