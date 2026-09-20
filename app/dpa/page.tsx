import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Download, Shield } from "lucide-react";

export const metadata = {
  title: "Data Processing Agreement — IORA",
  description: "IORA's Data Processing Agreement (DPA) for customers subject to GDPR and other data protection regulations.",
};

const subProcessors = [
  {
    name: "Google Firebase / Google Cloud",
    purpose: "Authentication, real-time database, cloud infrastructure, and serverless functions",
    location: "United States (Iowa, South Carolina) — SCCs in place",
    category: "Infrastructure & Auth",
  },
  {
    name: "Upstash",
    purpose: "Redis-compatible caching layer for rate limiting, session storage, and queue management",
    location: "United States / EU (customer-selectable region)",
    category: "Caching & Queuing",
  },
  {
    name: "Vercel Inc.",
    purpose: "Edge network hosting, CDN, and serverless function execution for the web application",
    location: "United States — SCCs in place for EU data",
    category: "Hosting & Edge",
  },
  {
    name: "Stripe, Inc.",
    purpose: "Payment processing, billing, and subscription management",
    location: "United States — SCCs in place",
    category: "Payments",
  },
  {
    name: "Resend",
    purpose: "Transactional email delivery for account notifications, invoices, and alerts",
    location: "United States — SCCs in place",
    category: "Email",
  },
  {
    name: "Sentry",
    purpose: "Application error monitoring and performance tracing",
    location: "United States — SCCs in place",
    category: "Observability",
  },
];

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="max-w-3xl mx-auto px-4 py-16">

          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              <span>Legal Document</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Data Processing Agreement</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
              <span><strong className="text-foreground">Version:</strong> 2.1</span>
              <span><strong className="text-foreground">Effective date:</strong> September 1, 2026</span>
              <span><strong className="text-foreground">Last updated:</strong> September 19, 2026</span>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
              This Data Processing Agreement ("DPA") supplements the{" "}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
              for customers subject to the General Data Protection Regulation (GDPR), UK GDPR, Swiss Federal Act on Data Protection (FADP), or other applicable data protection laws that require a formal data processing agreement. This DPA is incorporated into and forms part of the agreement between Iora Climate Technologies, Inc. ("IORA") and the customer ("Controller").
            </div>

            {/* Download Button */}
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-4 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Download DPA (PDF)
              </button>
            </div>
          </div>

          {/* Table of Contents */}
          <nav className="mb-10 p-5 bg-muted/40 border border-border text-sm">
            <p className="font-semibold mb-3">Contents</p>
            <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
              {[
                "Definitions",
                "Scope & Application",
                "Controller / Processor Roles",
                "Processing Instructions",
                "Sub-processors",
                "Data Subject Rights",
                "Security Measures",
                "International Transfers",
                "Audit Rights",
                "Term & Termination",
              ].map((section, i) => (
                <li key={i} className="hover:text-foreground transition-colors">
                  <a href={`#dpa-${i + 1}`}>{section}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="space-y-10 text-sm leading-relaxed">

            <section id="dpa-1">
              <h2 className="text-lg font-semibold mb-3 text-foreground">1. Definitions</h2>
              <p className="text-muted-foreground mb-3">For the purposes of this DPA, the following definitions apply:</p>
              <div className="space-y-3">
                {[
                  { term: '"Personal Data"', def: 'Any information relating to an identified or identifiable natural person ("data subject"), as defined under applicable Data Protection Law.' },
                  { term: '"Processing"', def: 'Any operation performed on Personal Data, including collection, recording, storage, adaptation, retrieval, use, disclosure, or erasure.' },
                  { term: '"Controller"', def: 'The Customer, who determines the purposes and means of processing Personal Data.' },
                  { term: '"Processor"', def: 'IORA, who processes Personal Data on behalf of and under the instructions of the Controller.' },
                  { term: '"Sub-processor"', def: 'Any third party engaged by IORA to process Personal Data in connection with providing the Service.' },
                  { term: '"Data Protection Law"', def: 'The applicable privacy and data protection laws, including GDPR (EU 2016/679), UK GDPR, FADP, and any national implementing legislation.' },
                  { term: '"SCCs"', def: 'Standard Contractual Clauses as adopted by the European Commission for the transfer of Personal Data to third countries.' },
                  { term: '"Security Incident"', def: 'A confirmed breach of security leading to accidental or unlawful destruction, loss, alteration, or unauthorized disclosure of Personal Data.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="font-mono text-primary shrink-0 mt-0.5">{item.term}</span>
                    <span className="text-muted-foreground">{item.def}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="dpa-2">
              <h2 className="text-lg font-semibold mb-3 text-foreground">2. Scope & Application</h2>
              <p className="text-muted-foreground mb-3">
                This DPA applies to all processing of Personal Data carried out by IORA as a Processor on behalf of the Customer as Controller in connection with the provision of the Service described in the Terms of Service.
              </p>
              <p className="text-muted-foreground">
                This DPA covers Personal Data relating to the Customer's employees, contractors, and other individuals whose data the Customer uploads to or processes through the IORA platform. It does not cover Personal Data for which IORA acts as an independent Controller (e.g., IORA's own customer account data for billing and support purposes).
              </p>
            </section>

            <section id="dpa-3">
              <h2 className="text-lg font-semibold mb-3 text-foreground">3. Controller / Processor Roles</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">3.1 Customer as Controller</h3>
                  <p className="text-muted-foreground">
                    The Customer acts as the Controller and determines the lawful basis, purposes, and means of processing Personal Data uploaded to or processed via the Service. The Customer warrants that it has all necessary consents, permissions, and lawful bases required under applicable Data Protection Law to instruct IORA to process Personal Data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">3.2 IORA as Processor</h3>
                  <p className="text-muted-foreground">
                    IORA acts as a Processor and processes Personal Data only on documented instructions from the Customer, as set out in this DPA and the Terms of Service. IORA shall not process Personal Data for its own independent purposes unless required to do so by applicable law, in which case IORA shall inform the Customer of that legal requirement before processing (unless the law prohibits such disclosure).
                  </p>
                </div>
              </div>
            </section>

            <section id="dpa-4">
              <h2 className="text-lg font-semibold mb-3 text-foreground">4. Processing Instructions</h2>
              <p className="text-muted-foreground mb-3">
                IORA shall process Personal Data only in accordance with the Customer's documented instructions. The primary instructions are set out in the Terms of Service and any applicable order forms or statements of work. Additional instructions may be given by the Customer in writing during the term of this DPA.
              </p>
              <p className="text-muted-foreground mb-3">
                IORA shall promptly inform the Customer if, in IORA's opinion, an instruction infringes applicable Data Protection Law. In such event, IORA is entitled to refuse to carry out that processing instruction until the Customer amends or withdraws it.
              </p>
              <p className="text-muted-foreground">
                Authorized employees of IORA who process Personal Data under this DPA are bound by appropriate confidentiality obligations and receive data protection training commensurate with their role.
              </p>
            </section>

            <section id="dpa-5">
              <h2 className="text-lg font-semibold mb-3 text-foreground">5. Sub-processors</h2>
              <p className="text-muted-foreground mb-4">
                The Customer provides general written authorization for IORA to engage sub-processors. IORA shall provide at least 30 days' notice before adding or changing a sub-processor to allow the Customer to object. A current list of authorized sub-processors is maintained below and at{" "}
                <Link href="/dpa" className="text-primary hover:underline">iora.io/dpa</Link>.
              </p>

              {/* Sub-processor table */}
              <div className="border border-border text-sm overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left font-semibold text-foreground p-3">Sub-processor</th>
                      <th className="text-left font-semibold text-foreground p-3">Category</th>
                      <th className="text-left font-semibold text-foreground p-3">Purpose</th>
                      <th className="text-left font-semibold text-foreground p-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subProcessors.map((sp, i) => (
                      <tr key={i} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-foreground align-top">{sp.name}</td>
                        <td className="p-3 text-muted-foreground align-top">
                          <span className="inline-block px-2 py-0.5 text-xs border border-border rounded-sm bg-muted/40">
                            {sp.category}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground align-top">{sp.purpose}</td>
                        <td className="p-3 text-muted-foreground align-top text-xs">{sp.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                SCCs = Standard Contractual Clauses. All sub-processors outside the EEA are required to execute appropriate transfer mechanisms.
              </p>
            </section>

            <section id="dpa-6">
              <h2 className="text-lg font-semibold mb-3 text-foreground">6. Data Subject Rights</h2>
              <p className="text-muted-foreground mb-3">
                IORA shall provide commercially reasonable assistance to enable the Customer to fulfill its obligations to respond to requests from data subjects exercising their rights under applicable Data Protection Law, including the right to access, rectification, erasure, restriction, portability, and objection.
              </p>
              <p className="text-muted-foreground mb-3">
                If IORA receives a data subject request directly, IORA shall promptly notify the Customer (where legally permitted to do so) and shall not respond to the request without the Customer's prior written authorization, except to acknowledge receipt.
              </p>
              <p className="text-muted-foreground">
                The Customer may fulfill many data subject requests directly through the IORA dashboard. For requests requiring IORA's direct action, submit a written request to{" "}
                <a href="mailto:privacy@iora.io" className="text-primary hover:underline">privacy@iora.io</a>{" "}
                with the subject line "Data Subject Request."
              </p>
            </section>

            <section id="dpa-7">
              <h2 className="text-lg font-semibold mb-3 text-foreground">7. Security Measures</h2>
              <p className="text-muted-foreground mb-3">
                IORA implements appropriate technical and organizational measures to ensure a level of security appropriate to the risk of processing Personal Data, in accordance with Article 32 GDPR. These measures include:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Pseudonymization and encryption of Personal Data (AES-256 at rest, TLS 1.3 in transit)",
                  "Ongoing confidentiality, integrity, availability, and resilience of processing systems",
                  "Ability to restore access to Personal Data in a timely manner in the event of an incident",
                  "Regular testing and evaluation of the effectiveness of security measures",
                  "Role-based access controls (RBAC) and principle of least privilege",
                  "Comprehensive audit logs for all access to and modification of Personal Data",
                  "Annual penetration testing by qualified third-party security firms",
                  "Employee security training and background checks for personnel with data access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                In the event of a Security Incident, IORA shall notify the Customer without undue delay, and no later than 72 hours after becoming aware of the incident, providing all reasonably available information about the nature of the breach, categories and approximate number of individuals and records affected, and remediation steps taken.
              </p>
            </section>

            <section id="dpa-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">8. International Transfers</h2>
              <p className="text-muted-foreground mb-3">
                IORA's primary infrastructure is located in the United States. For customers in the European Economic Area (EEA), UK, or Switzerland, any transfer of Personal Data outside those jurisdictions is governed by Standard Contractual Clauses (SCCs) as issued by the European Commission (Commission Implementing Decision (EU) 2021/914).
              </p>
              <p className="text-muted-foreground mb-3">
                By entering into this DPA, the Customer agrees to the execution of the SCCs with IORA. The SCCs are incorporated by reference and form part of this DPA. IORA conducts Transfer Impact Assessments (TIAs) for all third-country transfers and makes these available upon request.
              </p>
              <p className="text-muted-foreground">
                For UK customers, IORA relies on the International Data Transfer Addendum (IDTA) issued by the UK Information Commissioner's Office.
              </p>
            </section>

            <section id="dpa-9">
              <h2 className="text-lg font-semibold mb-3 text-foreground">9. Audit Rights</h2>
              <p className="text-muted-foreground mb-3">
                IORA shall make available to the Customer all information reasonably necessary to demonstrate compliance with its obligations under this DPA and applicable Data Protection Law. IORA shall allow for and contribute to audits, including inspections, conducted by the Customer or a mandated auditor.
              </p>
              <p className="text-muted-foreground mb-3">
                In practice, IORA fulfills this obligation by:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Providing current SOC 2 Type II reports upon written request and execution of a mutual NDA",
                  "Sharing penetration test summaries and security questionnaire responses",
                  "Responding to Customer security questionnaires within 15 business days",
                  "Allowing on-site audits with at least 30 days' written notice and at the Customer's expense",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="dpa-10">
              <h2 className="text-lg font-semibold mb-3 text-foreground">10. Term & Termination</h2>
              <p className="text-muted-foreground mb-3">
                This DPA is effective from the date the Customer first accepts the Terms of Service or executes a separate order form, and continues until the termination or expiry of the underlying agreement between the parties.
              </p>
              <p className="text-muted-foreground mb-3">
                Upon termination of the agreement, IORA shall, at the Customer's choice, either delete or return all Personal Data processed under this DPA, within 90 days of the termination date. IORA shall provide written confirmation of deletion upon request.
              </p>
              <p className="text-muted-foreground">
                IORA may retain Personal Data beyond the 90-day period only where required by applicable law or regulation (e.g., statutory financial record-keeping requirements), in which case IORA shall continue to apply the protections of this DPA to that data.
              </p>
            </section>

            {/* Contact / Execute */}
            <div className="pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm mb-4">
                Questions about this DPA or to request execution of a countersigned copy, contact:
              </p>
              <div className="p-5 border border-border text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Data Protection Officer — Iora Climate Technologies, Inc.</p>
                <a href="mailto:dpo@iora.io" className="text-primary hover:underline">dpo@iora.io</a>
                <div className="pt-3 flex flex-col gap-1">
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
                  <Link href="/security" className="text-primary hover:underline">Security Overview →</Link>
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-9 px-4 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                  Download DPA (PDF)
                </button>
              </div>
            </div>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
