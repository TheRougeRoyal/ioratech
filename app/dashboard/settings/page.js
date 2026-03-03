"use client";

import { useState } from "react";
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

export default function SettingsPage() {
  const [showKeys, setShowKeys] = useState({});
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences</p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
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

        <TabsContent value="profile" className="space-y-6">
          <motion.div variants={item}>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Organization Profile</CardTitle>
                <CardDescription>Update your company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue="Acme Corporation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Manufacturing" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue="Global manufacturing company with operations across 12 countries." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Input id="employees" defaultValue="5,200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revenue">Annual Revenue</Label>
                    <Input id="revenue" defaultValue="$2.4B" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
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
                {[
                  { title: "Email Reports", desc: "Receive weekly summary reports" },
                  { title: "Risk Alerts", desc: "Get notified of risk score changes" },
                  { title: "Compliance Updates", desc: "Regulatory deadline reminders" },
                  { title: "Product Updates", desc: "New features and improvements" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

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
