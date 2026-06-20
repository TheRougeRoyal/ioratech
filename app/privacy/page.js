import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: June 2026
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Iora Technologies, Inc. ("Iora," "we," "us," or "our") is committed to
                protecting your privacy. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our Climate
                Intelligence platform and related services (collectively, the "Service").
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                By using the Service, you agree to the collection and use of information
                in accordance with this policy. If you do not agree, please discontinue
                use of the Service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>

              <h3 className="text-base font-medium mb-2 mt-4">2.1 Information You Provide</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Account Information:</strong> Name, email address, password, and organization details when you create an account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Operational Data:</strong> Emissions data, facility information, supply chain data, and other environmental metrics you upload or connect to the Service.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Communication Data:</strong> Information you provide when contacting support or submitting inquiries.</span>
                </li>
              </ul>

              <h3 className="text-base font-medium mb-2 mt-4">2.2 Information Collected Automatically</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Usage Data:</strong> Pages viewed, features used, actions taken, time spent, and interaction patterns within the Service.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Device Data:</strong> Browser type, operating system, device type, screen resolution, and IP address.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Log Data:</strong> Server logs including access times, pages visited, and error reports.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To provide, maintain, and improve the Service
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To process and analyze your emissions and climate risk data
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To generate reports, dashboards, and analytics for your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To send administrative notifications (service updates, security alerts)
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To respond to inquiries and provide customer support
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To detect, prevent, and address technical issues and security threats
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  To comply with legal obligations and enforce our terms
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. How We Share Your Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal data. We may share information in the following circumstances:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Service Providers:</strong> With third-party vendors who assist in operating the Service (hosting, analytics, payment processing), bound by contractual obligations to protect your data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Legal Requirements:</strong> When required by law, subpoena, or other legal process, or to protect our rights, safety, or property.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span><strong>With Your Consent:</strong> When you have given explicit permission to share with specific third parties.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data,
                including AES-256 encryption at rest, TLS 1.3 encryption in transit,
                role-based access controls, regular security audits, and automated
                vulnerability scanning. However, no method of transmission over the
                Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We retain your personal data for as long as your account is active or
                as needed to provide the Service. We will also retain data as necessary
                to comply with legal obligations, resolve disputes, and enforce our
                agreements. Upon account deletion, we will delete or anonymize your
                data within 30 days, except where retention is required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Depending on your jurisdiction, you may have the following rights:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Access:</strong> Request a copy of the personal data we hold about you.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Correction:</strong> Request correction of inaccurate or incomplete data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Deletion:</strong> Request deletion of your personal data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Portability:</strong> Request a copy of your data in a portable format.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Objection:</strong> Object to processing of your personal data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <strong>Restriction:</strong> Request restriction of processing in certain circumstances.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                To exercise these rights, contact us at{" "}
                <a href="mailto:aakashr@lysandragroup.com" className="hover:underline">
                  aakashr@lysandragroup.com
                </a>. We will respond within 30 days.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. International Data Transfers</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries outside your
                country of residence. We ensure appropriate safeguards are in place,
                including Standard Contractual Clauses (SCCs) approved by the European
                Commission where required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Cookies and Tracking</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use essential cookies to operate the Service and analytics cookies
                to understand how the Service is used. You can manage cookie preferences
                through your browser settings. We do not use advertising cookies or
                cross-site tracking.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">10. Children's Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Service is not directed to individuals under 16. We do not knowingly
                collect personal data from children. If we become aware that we have
                collected data from a child, we will delete it promptly.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify
                you of material changes by posting the updated policy on this page
                and updating the "Last updated" date. Your continued use of the Service
                after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For questions about this Privacy Policy or our data practices, contact:
              </p>
              <div className="mt-3 text-sm text-muted-foreground">
                <p>Iora Technologies, Inc.</p>
                <a href="mailto:aakashr@lysandragroup.com" className="hover:underline">
                  aakashr@lysandragroup.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
