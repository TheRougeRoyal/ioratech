import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — IORA",
  description: "Learn how IORA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="max-w-3xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-10 pb-8 border-b border-border">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Privacy Policy</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span><strong className="text-foreground">Last updated:</strong> September 19, 2026</span>
              <span><strong className="text-foreground">Effective date:</strong> September 1, 2026</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Iora Climate Technologies, Inc. ("IORA", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use the IORA platform, website, and related services. Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-10 p-5 bg-muted/40 border border-border text-sm">
            <p className="font-semibold mb-3">Contents</p>
            <ol className="space-y-1.5 text-muted-foreground list-decimal list-inside">
              {[
                "Information We Collect",
                "How We Use Your Information",
                "Data Sharing & Disclosure",
                "Cookies & Tracking Technologies",
                "Data Retention",
                "Your Rights (GDPR & CCPA)",
                "Security",
                "Children's Privacy",
                "Changes to This Policy",
                "Contact Us",
              ].map((section, i) => (
                <li key={i} className="hover:text-foreground transition-colors">
                  <a href={`#priv-section-${i + 1}`}>{section}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="space-y-10 text-sm leading-relaxed">

            <section id="priv-section-1">
              <h2 className="text-lg font-semibold mb-3 text-foreground">1. Information We Collect</h2>

              <h3 className="font-semibold text-foreground mb-2 mt-4">1.1 Information You Provide Directly</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Account registration data: name, work email address, company name, job title, and password",
                  "Billing information: credit card details and billing address (processed by our payment processor; IORA does not store raw card data)",
                  "Emissions and climate data: operational data, energy consumption records, supply chain data, and other business information you upload",
                  "Communications: messages, feedback, support requests, and survey responses you send to us",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-foreground mb-2 mt-4">1.2 Information Collected Automatically</h3>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Usage data: pages visited, features used, actions taken, session duration, and click patterns",
                  "Device and browser information: IP address, browser type, operating system, device identifiers",
                  "Log data: server logs, error reports, API request logs, and timestamps",
                  "Cookies and similar technologies (see Section 4)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="font-semibold text-foreground mb-2 mt-4">1.3 Information from Third Parties</h3>
              <p className="text-muted-foreground">
                We may receive information about you from third-party sources such as identity verification services, corporate registry databases, or integration partners when you choose to connect external services to IORA.
              </p>
            </section>

            <section id="priv-section-2">
              <h2 className="text-lg font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">We use the information we collect for the following purposes:</p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Providing, operating, and improving the Service, including emissions calculations, risk assessments, and compliance reports",
                  "Creating and managing your account and authenticating your identity",
                  "Processing payments and sending invoices and billing communications",
                  "Sending product updates, service announcements, and security alerts",
                  "Responding to your support requests and inquiries",
                  "Analyzing usage patterns to improve platform performance, user experience, and feature development",
                  "Detecting, preventing, and investigating fraud, abuse, and security incidents",
                  "Complying with legal obligations, including tax reporting, audit requirements, and court orders",
                  "Enforcing our Terms of Service and other policies",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                We will not use your emissions or operational data to train machine learning models or for any purpose other than providing the Service to you, unless we obtain your explicit consent.
              </p>
            </section>

            <section id="priv-section-3">
              <h2 className="text-lg font-semibold mb-3 text-foreground">3. Data Sharing & Disclosure</h2>
              <p className="text-muted-foreground mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <div className="space-y-5">
                {[
                  {
                    title: "Service Providers",
                    body: "We share information with trusted third-party vendors who help us operate the Service, including cloud infrastructure, payment processing, analytics, customer support tools, and email delivery. These providers are contractually obligated to protect your data and may only use it to perform services on our behalf.",
                  },
                  {
                    title: "Business Transfers",
                    body: "If IORA is involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of company assets, your information may be transferred as part of that transaction. We will notify you via email or prominent notice on the Service before your information is transferred and becomes subject to a different privacy policy.",
                  },
                  {
                    title: "Legal Requirements",
                    body: "We may disclose your information if required to do so by law or in good-faith belief that such disclosure is reasonably necessary to comply with legal obligations, protect our rights or property, prevent fraud, or protect the safety of our users or the public.",
                  },
                  {
                    title: "With Your Consent",
                    body: "We may share your information with third parties when you explicitly consent to such sharing, such as when you authorize integrations with external platforms.",
                  },
                ].map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="priv-section-4">
              <h2 className="text-lg font-semibold mb-3 text-foreground">4. Cookies & Tracking Technologies</h2>
              <p className="text-muted-foreground mb-3">
                We use cookies and similar tracking technologies to operate and improve the Service. The types of cookies we use include:
              </p>
              <div className="border border-border divide-y divide-border text-sm">
                {[
                  { type: "Essential Cookies", purpose: "Required for the Service to function. These enable core features like authentication, session management, and security. Cannot be disabled.", examples: "Session token, CSRF protection" },
                  { type: "Performance Cookies", purpose: "Help us understand how users interact with the Service by collecting anonymous usage data.", examples: "PostHog, Vercel Analytics" },
                  { type: "Preference Cookies", purpose: "Remember your settings and preferences, such as theme selection and language.", examples: "Theme preference, locale" },
                ].map((row, i) => (
                  <div key={i} className="p-4 grid grid-cols-3 gap-4">
                    <div className="font-medium text-foreground">{row.type}</div>
                    <div className="text-muted-foreground col-span-2">{row.purpose} <span className="text-xs text-muted-foreground/70">Examples: {row.examples}</span></div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-3">
                You can control non-essential cookies through your browser settings. Note that disabling cookies may affect the functionality of the Service.
              </p>
            </section>

            <section id="priv-section-5">
              <h2 className="text-lg font-semibold mb-3 text-foreground">5. Data Retention</h2>
              <p className="text-muted-foreground mb-3">
                We retain your personal information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Account data is retained for the duration of your account and for 90 days after termination, after which it is permanently deleted",
                  "Billing and transaction records are retained for 7 years to comply with financial regulatory requirements",
                  "Emissions and operational data you upload is retained per your account's data retention settings, with a minimum of 5 years to meet most regulatory audit requirements",
                  "Log data and usage analytics are retained for up to 12 months",
                  "Communications sent to our support team are retained for 3 years",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="priv-section-6">
              <h2 className="text-lg font-semibold mb-3 text-foreground">6. Your Rights (GDPR & CCPA)</h2>
              <p className="text-muted-foreground mb-3">
                Depending on your location, you may have specific rights regarding your personal information. We honor the following rights for all users regardless of location:
              </p>
              <div className="space-y-4">
                {[
                  { right: "Right of Access", desc: "You may request a copy of the personal information we hold about you." },
                  { right: "Right to Rectification", desc: "You may request correction of inaccurate or incomplete personal information." },
                  { right: "Right to Erasure", desc: "You may request deletion of your personal information, subject to certain legal limitations." },
                  { right: "Right to Data Portability", desc: "You may request your data in a structured, machine-readable format." },
                  { right: "Right to Restrict Processing", desc: "You may request that we limit how we use your personal information in certain circumstances." },
                  { right: "Right to Object", desc: "You may object to processing of your personal information based on legitimate interests." },
                  { right: "Right to Opt Out of Sale (CCPA)", desc: "California residents have the right to opt out of the sale of personal information. We do not sell personal information." },
                  { right: "Right to Non-Discrimination", desc: "We will not discriminate against you for exercising any of your privacy rights." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">{item.right}: </span>
                      <span className="text-muted-foreground">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-4">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@iora.io" className="text-primary hover:underline">privacy@iora.io</a>.
                We will respond to verified requests within 30 days (or as required by applicable law).
              </p>
            </section>

            <section id="priv-section-7">
              <h2 className="text-lg font-semibold mb-3 text-foreground">7. Security</h2>
              <p className="text-muted-foreground mb-3">
                We implement industry-standard technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. Our security measures include:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "TLS 1.3 encryption for all data in transit",
                  "AES-256 encryption for data at rest",
                  "SOC 2 Type II compliant infrastructure",
                  "Role-based access controls and least-privilege principles",
                  "Regular penetration testing and vulnerability assessments",
                  "Multi-factor authentication (MFA) support for all accounts",
                  "Comprehensive audit logging for all data access and modifications",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                Despite our efforts, no security system is impenetrable. In the event of a data breach affecting your personal information, we will notify you as required by applicable law, typically within 72 hours of becoming aware of the breach.
              </p>
            </section>

            <section id="priv-section-8">
              <h2 className="text-lg font-semibold mb-3 text-foreground">8. Children's Privacy</h2>
              <p className="text-muted-foreground">
                The Service is designed for enterprise and professional use and is not directed at individuals under the age of 18. We do not knowingly collect personal information from anyone under 18 years of age. If we become aware that a minor has provided us with personal information without parental consent, we will take steps to delete that information promptly. If you believe we may have collected information from a minor, please contact us at{" "}
                <a href="mailto:privacy@iora.io" className="text-primary hover:underline">privacy@iora.io</a>.
              </p>
            </section>

            <section id="priv-section-9">
              <h2 className="text-lg font-semibold mb-3 text-foreground">9. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-3">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {[
                  "Update the 'Last updated' date at the top of this page",
                  "Notify you by email at the address associated with your account",
                  "Display a prominent notice within the Service for at least 30 days",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-3">
                We encourage you to review this policy periodically. Your continued use of the Service after changes take effect constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section id="priv-section-10">
              <h2 className="text-lg font-semibold mb-3 text-foreground">10. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our privacy team:
              </p>
              <div className="p-5 border border-border text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Privacy Team — Iora Climate Technologies, Inc.</p>
                <a href="mailto:privacy@iora.io" className="text-primary hover:underline">privacy@iora.io</a>
                <p className="pt-2 text-xs">
                  For GDPR-related inquiries, our Data Protection Officer can be reached at the same address with the subject line "DPO Inquiry."
                </p>
                <div className="pt-2 flex flex-col gap-1">
                  <Link href="/dpa" className="text-primary hover:underline">Data Processing Agreement (DPA) →</Link>
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
                  <Link href="/security" className="text-primary hover:underline">Security Overview →</Link>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
