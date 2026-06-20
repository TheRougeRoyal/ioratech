import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: June 2026
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By accessing or using the Iora Climate Intelligence platform and related
                services (the "Service"), you agree to be bound by these Terms of Service
                ("Terms"). If you are using the Service on behalf of an organization, you
                represent that you have authority to bind that organization to these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Iora provides enterprise-grade climate intelligence infrastructure,
                including carbon emissions tracking, climate risk forecasting, scenario
                modeling, and regulatory compliance reporting. The Service is provided
                "as is" and may be modified, updated, or discontinued at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You must provide accurate, complete information when creating an account.
                You are responsible for maintaining the confidentiality of your credentials
                and for all activities under your account. You must notify us immediately
                of any unauthorized use.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Use the Service for any unlawful purpose or in violation of any applicable regulation
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Attempt to gain unauthorized access to the Service or its related systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Interfere with or disrupt the Service or servers
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Reverse engineer, decompile, or disassemble any part of the Service
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Resell, sublicense, or distribute the Service without authorization
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Upload malicious code or data that could harm the Service or other users
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Service, including all software, content, trademarks, and documentation,
                is the property of Iora Technologies, Inc. and is protected by intellectual
                property laws. You retain ownership of any data you upload to the Service.
                By uploading data, you grant Iora a limited license to process that data
                solely to provide the Service to you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Data and Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your use of the Service is also governed by our{" "}
                <a href="/privacy" className="hover:underline">Privacy Policy</a>.
                You are responsible for ensuring you have the right to upload any data
                to the Service and that such data complies with applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Fees and Payment</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Certain features of the Service require a paid subscription. Fees are
                as specified at the time of purchase. All fees are non-refundable unless
                required by applicable law. We reserve the right to change pricing with
                30 days' notice.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. Service Availability and Support</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We strive for 99.9% uptime but do not guarantee uninterrupted access.
                Scheduled maintenance will be announced in advance when possible. Support
                is available via email during business hours.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Iora Technologies shall not be
                liable for any indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits or revenue, whether incurred directly or
                indirectly. Our total liability shall not exceed the fees paid by you in
                the twelve months preceding the claim.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">10. Disclaimer of Warranties</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES
                OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                NON-INFRINGEMENT. We do not warrant that the Service will be error-free,
                secure, or uninterrupted.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">11. Indemnification</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Iora Technologies, Inc. and its
                officers, directors, employees, and agents from any claims, losses, damages,
                liabilities, and expenses arising from your use of the Service or violation
                of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">12. Termination</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Either party may terminate this agreement. We may suspend or terminate
                your access immediately for cause, including breach of these Terms.
                Upon termination, your right to use the Service ceases. We may retain
                data as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">13. Governing Law</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the State of Delaware, United
                States, without regard to conflict of law principles. Any disputes shall
                be resolved in the courts of Delaware, except where arbitration is agreed upon.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">14. Changes to Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Material changes
                will be communicated via email or prominent notice on the Service at least
                30 days before taking effect. Continued use after changes constitutes
                acceptance.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">15. Contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For questions about these Terms, contact:
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
