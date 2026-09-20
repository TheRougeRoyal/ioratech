import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — IORA",
  description: "Read the Terms of Service governing your use of the IORA climate intelligence platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="max-w-3xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Terms of Service</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span><strong className="text-foreground">Effective date:</strong> September 1, 2026</span>
              <span><strong className="text-foreground">Last updated:</strong> September 19, 2026</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Iora Climate Technologies, Inc. ("IORA", "we", "us", or "our") governing your access to and use of the IORA platform, APIs, and related services. Please read them carefully before using our services.
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-10 p-5 bg-muted/40 border border-border text-sm">
            <p className="font-semibold mb-3">Contents</p>
            <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
              {[
                "Acceptance of Terms",
                "Description of Service",
                "User Accounts",
                "Acceptable Use",
                "Subscription & Billing",
                "Intellectual Property",
                "Data & Privacy",
                "Limitation of Liability",
                "Termination",
                "Changes to Terms",
                "Contact",
              ].map((section, i) => (
                <li key={i} className="hover:text-foreground transition-colors">
                  <a href={`#section-${i + 1}`}>{section}</a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Sections */}
          <article className="space-y-10 text-sm leading-relaxed">

            <section id="section-1">
              <h2 className="text-lg font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By creating an account, accessing, or using the IORA platform (the "Service"), you agree to be bound by these Terms and our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. If you are using the Service on behalf of a company or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms. If you do not agree to these Terms, you must not access or use the Service.
              </p>
              <p className="text-muted-foreground mt-3">
                Your continued use of the Service following any modification to these Terms constitutes your acceptance of those modifications.
              </p>
            </section>

            <section id="section-2">
              <h2 className="text-lg font-semibold mb-3 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground mb-3">
                IORA provides an enterprise-grade climate intelligence and emissions management platform. The Service includes, but is not limited to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Scope 1, 2, and 3 greenhouse gas emissions tracking and calculation",
                  "Climate risk assessment (physical and transition risks)",
                  "Regulatory compliance reporting for TCFD, CSRD, ISSB, GRI, SASB, and the SEC Climate Rule",
                  "Scenario modeling and net-zero pathway planning",
                  "Audit-ready documentation and data export",
                  "REST API access for programmatic data integration",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.
              </p>
            </section>

            <section id="section-3">
              <h2 className="text-lg font-semibold mb-3 text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground mb-3">
                To access certain features of the Service, you must create an account. When registering, you agree to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Provide accurate, current, and complete information",
                  "Maintain and promptly update your account information",
                  "Keep your password secure and confidential",
                  "Immediately notify IORA of any unauthorized use of your account",
                  "Accept responsibility for all activities that occur under your account",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                IORA reserves the right to suspend or terminate accounts that provide false information or that we determine, in our sole discretion, to be in violation of these Terms. You may not create more than one account per person without our express written permission.
              </p>
            </section>

            <section id="section-4">
              <h2 className="text-lg font-semibold mb-3 text-foreground">4. Acceptable Use</h2>
              <p className="text-muted-foreground mb-3">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree <em>not</em> to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Use the Service for any unlawful purpose or in violation of any applicable law or regulation",
                  "Attempt to gain unauthorized access to any part of the Service, servers, or networks",
                  "Interfere with or disrupt the integrity or performance of the Service",
                  "Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Service",
                  "Resell, sublicense, rent, or redistribute the Service or API access without written authorization",
                  "Upload, transmit, or distribute malicious code, viruses, or any material that could harm the Service or other users",
                  "Scrape, crawl, or extract data from the Service using automated means without our written consent",
                  "Use the Service to produce misleading or fraudulent emissions disclosures",
                  "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="section-5">
              <h2 className="text-lg font-semibold mb-3 text-foreground">5. Subscription & Billing</h2>
              <h3 className="font-semibold text-foreground mb-2 mt-4">5.1 Plans and Fees</h3>
              <p className="text-muted-foreground">
                Access to certain features requires a paid subscription. All fees are stated in US Dollars and are exclusive of applicable taxes. You agree to pay all fees associated with your chosen plan as they become due.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-4">5.2 Billing Cycle</h3>
              <p className="text-muted-foreground">
                Subscriptions are billed in advance on a monthly or annual basis depending on your selected plan. Invoices are issued automatically. Failure to pay within 30 days of the invoice date may result in suspension of your account.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-4">5.3 Refunds</h3>
              <p className="text-muted-foreground">
                All fees are non-refundable except as required by applicable law or as expressly set forth in a separate written agreement. If you downgrade your plan, the change takes effect at the start of your next billing cycle with no partial refunds issued for unused time.
              </p>
              <h3 className="font-semibold text-foreground mb-2 mt-4">5.4 Price Changes</h3>
              <p className="text-muted-foreground">
                We reserve the right to change our pricing at any time. We will provide at least 30 days' advance notice of any price changes by email or in-app notification. Your continued use of the Service after the price change becomes effective constitutes acceptance of the new pricing.
              </p>
            </section>

            <section id="section-6">
              <h2 className="text-lg font-semibold mb-3 text-foreground">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-3">
                The Service, including its software, algorithms, documentation, trademarks, trade names, and all content created or made available by IORA, is owned by or licensed to Iora Climate Technologies, Inc. and is protected by copyright, trademark, patent, trade secret, and other applicable intellectual property laws.
              </p>
              <p className="text-muted-foreground mb-3">
                You retain full ownership of all data, content, and information you submit to the Service ("Customer Data"). By submitting Customer Data, you grant IORA a limited, non-exclusive, royalty-free license to access, process, store, and use your Customer Data solely for the purpose of providing and improving the Service.
              </p>
              <p className="text-muted-foreground">
                You may not use IORA's name, logo, or trademarks without our prior written consent. Feedback or suggestions you provide regarding the Service may be used by IORA without any obligation to you.
              </p>
            </section>

            <section id="section-7">
              <h2 className="text-lg font-semibold mb-3 text-foreground">7. Data & Privacy</h2>
              <p className="text-muted-foreground mb-3">
                Your privacy is important to us. Our collection, use, and disclosure of personal information is governed by our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
              <p className="text-muted-foreground mb-3">
                If you are a customer subject to the General Data Protection Regulation (GDPR), our{" "}
                <Link href="/dpa" className="text-primary hover:underline">Data Processing Agreement (DPA)</Link>{" "}
                governs the processing of personal data on your behalf and supplements these Terms.
              </p>
              <p className="text-muted-foreground">
                You are solely responsible for ensuring that your use of the Service complies with applicable data protection and privacy laws, including obtaining any necessary consents from individuals whose personal data you upload or process via the Service.
              </p>
            </section>

            <section id="section-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-3 uppercase text-xs tracking-wide font-medium">Disclaimer of warranties</p>
              <p className="text-muted-foreground mb-3">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT. IORA DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF HARMFUL COMPONENTS.
              </p>
              <p className="text-muted-foreground mb-3 uppercase text-xs tracking-wide font-medium">Limitation of liability</p>
              <p className="text-muted-foreground mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IORA AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, DATA, BUSINESS, OR GOODWILL, EVEN IF IORA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-muted-foreground">
                In no event shall IORA's total aggregate liability to you exceed the greater of (a) the total fees paid by you to IORA in the twelve (12) months immediately preceding the event giving rise to the claim, or (b) one hundred US Dollars ($100).
              </p>
            </section>

            <section id="section-9">
              <h2 className="text-lg font-semibold mb-3 text-foreground">9. Termination</h2>
              <p className="text-muted-foreground mb-3">
                You may terminate your account at any time by contacting us at{" "}
                <a href="mailto:legal@iora.io" className="text-primary hover:underline">legal@iora.io</a>{" "}
                or through your account settings. Upon termination, your right to access the Service will cease immediately.
              </p>
              <p className="text-muted-foreground mb-3">
                IORA may suspend or terminate your account or access to the Service at any time, with or without cause, and with or without notice. Grounds for termination include, but are not limited to, violation of these Terms, non-payment of fees, fraudulent activity, or conduct that IORA reasonably believes could expose it to legal liability.
              </p>
              <p className="text-muted-foreground">
                Upon termination, we will retain your Customer Data for up to 90 days during which you may request an export. After that period, your data will be permanently deleted except where retention is required by applicable law or regulation.
              </p>
            </section>

            <section id="section-10">
              <h2 className="text-lg font-semibold mb-3 text-foreground">10. Changes to Terms</h2>
              <p className="text-muted-foreground mb-3">
                We reserve the right to update or modify these Terms at any time. We will notify you of material changes by sending an email to the address associated with your account, or by displaying a prominent notice within the Service, at least 30 days before the changes take effect.
              </p>
              <p className="text-muted-foreground">
                If you continue to access or use the Service after the revised Terms have taken effect, you will be considered to have accepted those changes. If you do not agree to the revised Terms, you must stop using the Service before the changes take effect.
              </p>
            </section>

            <section id="section-11">
              <h2 className="text-lg font-semibold mb-3 text-foreground">11. Governing Law & Disputes</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Delaware, and you waive any objection to venue and personal jurisdiction in those courts.
              </p>
            </section>

            <section id="section-12">
              <h2 className="text-lg font-semibold mb-3 text-foreground">12. Contact</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions, concerns, or requests regarding these Terms, please contact our legal team:
              </p>
              <div className="p-5 border border-border text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Iora Climate Technologies, Inc.</p>
                <p>Legal Department</p>
                <a href="mailto:legal@iora.io" className="text-primary hover:underline">legal@iora.io</a>
                <p className="pt-2">
                  <Link href="/dpa" className="text-primary hover:underline">Data Processing Agreement →</Link>
                </p>
                <p>
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
                </p>
              </div>
            </section>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
