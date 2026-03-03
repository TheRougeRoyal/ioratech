"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
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

const reportTemplates = [
  {
    id: "tpl-1",
    name: "Board Climate Brief",
    description: "Executive summary of emissions, risk signals, and mitigation actions.",
    frameworks: ["TCFD", "ISSB"],
    estimatedTime: "20 min",
  },
  {
    id: "tpl-2",
    name: "CSRD Climate Package",
    description: "Structured ESRS E1 disclosure pack with policy, metrics, and targets.",
    frameworks: ["CSRD", "ESRS"],
    estimatedTime: "35 min",
  },
  {
    id: "tpl-3",
    name: "Supplier Scope 3 Digest",
    description: "Category-level Scope 3 trends, confidence bands, and data quality notes.",
    frameworks: ["GHG Protocol"],
    estimatedTime: "25 min",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ReportsPage() {
  const publishedReports = reports.filter((report) => report.status === "published");
  const draftReports = reports.filter((report) => report.status !== "published");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage ESG disclosures and reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-border/50 hover:border-border hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{report.name}</h3>
                          <Badge variant="outline" className={`text-xs ${
                            report.status === "published" ? "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950" :
                            report.status === "draft" ? "text-muted-foreground" :
                            "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950"
                          }`}>
                            {report.status === "in-review" ? "In Review" : report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{report.type}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{report.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{report.pages} pages</span>
                          </div>
                          {report.status === "published" && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Download className="h-3 w-3" />
                              <span>{report.downloads} downloads</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          {report.frameworks.map((fw) => (
                            <Badge key={fw} variant="secondary" className="text-[10px]">
                              {fw}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          {publishedReports.map((report) => (
            <Card key={report.id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-medium">{report.name}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center"><Calendar className="h-3 w-3 mr-1" />{report.date}</span>
                      <span className="inline-flex items-center"><Download className="h-3 w-3 mr-1" />{report.downloads} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.frameworks.map((framework) => (
                        <Badge key={framework} variant="secondary" className="text-[10px]">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Open
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftReports.map((report) => (
            <Card key={report.id} className="border-border/50">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-xs text-muted-foreground">{report.type}</p>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950">
                    {report.status === "draft" ? "Draft" : "In Review"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center"><Clock className="h-3 w-3 mr-1" />Last edited {report.date}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Continue editing
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {template.frameworks.map((framework) => (
                      <Badge key={framework} variant="outline" className="text-[10px]">
                        {framework}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center"><Clock className="h-3 w-3 mr-1" />{template.estimatedTime}</span>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Preview */}
      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Report Preview</CardTitle>
            <CardDescription>Annual ESG Report 2024 - Page 1 of 84</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg border border-border/50 p-8 min-h-[400px]">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-4 pb-8 border-b border-border/50">
                  <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center">
                      <span className="text-2xl font-bold text-background">I</span>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold">Annual ESG Report</h1>
                  <p className="text-lg text-muted-foreground">Fiscal Year 2024</p>
                  <div className="flex items-center justify-center space-x-2 pt-4">
                    {["TCFD", "GRI", "SASB"].map((tag) => (
                      <Badge key={tag} variant="outline">{tag} Aligned</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6">
                  <div className="text-center p-4 rounded-lg bg-background border border-border/50">
                    <div className="text-2xl font-bold">-12.3%</div>
                    <div className="text-xs text-muted-foreground">Emissions Reduction</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background border border-border/50">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-muted-foreground">Renewable Energy</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background border border-border/50">
                    <div className="text-2xl font-bold">A-</div>
                    <div className="text-xs text-muted-foreground">CDP Score</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>This report provides a comprehensive overview of our environmental, social, and governance performance for fiscal year 2024. Our commitment to sustainability continues to drive measurable progress across all key metrics.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page 1 of 84</span>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
