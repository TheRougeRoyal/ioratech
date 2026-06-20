import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function DpaPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight mb-6">Data Processing Agreement</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            This Data Processing Agreement ("DPA") forms part of the agreement between
            Iora Technologies, Inc. ("Processor") and the customer ("Controller") for
            the use of the Iora Climate Intelligence platform.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Scope and Purpose</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This DPA applies to the processing of personal data by Iora Technologies
                on behalf of the Controller in connection with the services provided through
                the Iora Climate Intelligence platform. The Processor shall process personal
                data only in accordance with the Controller's documented instructions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Types of Data Processed</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Account information (names, email addresses)
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Organizational data (company details, operational data)
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Emissions and environmental data
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  Usage analytics and platform interaction data
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Sub-processors</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Processor may engage sub-processors to assist in providing the services.
                The Processor shall ensure that all sub-processors are bound by data protection
                obligations no less protective than those set out in this DPA. A current list
                of sub-processors is available upon request.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Data Transfers</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Personal data may be transferred to and processed in countries outside the
                European Economic Area. The Processor shall ensure appropriate safeguards
                are in place, including Standard Contractual Clauses where required.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Security Measures</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Processor shall implement appropriate technical and organizational measures
                to ensure a level of security appropriate to the risk, including encryption,
                access controls, regular testing, and incident response procedures.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Data Subject Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Processor shall assist the Controller in responding to data subject requests
                by appropriate technical and organizational measures, taking into account the
                nature of the processing.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Data Breach Notification</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Processor shall notify the Controller without undue delay after becoming
                aware of a personal data breach. The notification shall include the nature
                of the breach, categories and approximate number of data subjects affected,
                and the measures taken or proposed to address the breach.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. Data Retention and Deletion</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upon termination of services, the Processor shall, at the Controller's choice,
                delete or return all personal data, and delete existing copies unless
                retention is required by applicable law.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
