"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckCircle, ShieldCheck, Clock, Zap } from "lucide-react";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "SOC 2 in progress" },
  { icon: CheckCircle, label: "GDPR compliant" },
  { icon: Clock, label: "2-day response time" },
];

const COMPANY_SIZES = ["1–50", "51–500", "501–5,000", "5,000+"];
const REVENUE_RANGES = [
  "Under $10M",
  "$10M – $50M",
  "$50M – $250M",
  "$250M – $1B",
  "Over $1B",
  "Prefer not to say",
];
const USE_CASES = [
  "GHG reporting (Scope 1, 2, 3)",
  "CSRD compliance",
  "ESG disclosure (ISSB / TCFD / GRI)",
  "Carbon reduction planning",
  "Other",
];
const REFERRAL_SOURCES = [
  "LinkedIn",
  "Google / web search",
  "Colleague or peer",
  "Conference or event",
  "Newsletter or blog",
  "Other",
];

const FIELD_CLASS =
  "w-full h-9 px-3 border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors";
const SELECT_CLASS =
  "w-full h-9 px-3 border border-border bg-background text-sm text-foreground focus:outline-none focus:border-foreground transition-colors appearance-none cursor-pointer";
const LABEL_CLASS = "block text-sm font-medium mb-1.5";

export default function RequestAccessPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    companySize: "",
    annualRevenue: "",
    useCase: "",
    currentProcess: "",
    referralSource: "",
  });

  const set = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  /* ── Success state ─────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex items-center justify-center px-4 py-32">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 rounded-full mb-6">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-3">
              Request received.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
              We&apos;ll be in touch within 2 business days. In the meantime, feel free to explore
              our documentation or product overview.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center h-9 px-5 bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Return home
              </Link>
              <Link
                href="/product"
                className="inline-flex items-center h-9 px-5 border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                View product
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Form state ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="border-b border-border">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">
              <Zap className="h-3.5 w-3.5" />
              Early access
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Get early access to IORA.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
              We&apos;re onboarding teams selectively. Tell us about your climate reporting needs
              and we&apos;ll be in touch within 2 business days.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border px-3 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLASS}>First name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={set("firstName")}
                    required
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Last name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={set("lastName")}
                    required
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              {/* Work email */}
              <div>
                <label className={LABEL_CLASS}>Work email</label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={set("email")}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              {/* Company */}
              <div>
                <label className={LABEL_CLASS}>Company name</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={set("company")}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              {/* Company size */}
              <div>
                <label className={LABEL_CLASS}>Company size (employees)</label>
                <div className="relative">
                  <select
                    value={formData.companySize}
                    onChange={set("companySize")}
                    required
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Select range
                    </option>
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ▾
                  </span>
                </div>
              </div>

              {/* Annual revenue */}
              <div>
                <label className={LABEL_CLASS}>
                  Annual revenue{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.annualRevenue}
                    onChange={set("annualRevenue")}
                    className={SELECT_CLASS}
                  >
                    <option value="">Select range</option>
                    {REVENUE_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ▾
                  </span>
                </div>
              </div>

              {/* Primary use case */}
              <div>
                <label className={LABEL_CLASS}>Primary use case</label>
                <div className="relative">
                  <select
                    value={formData.useCase}
                    onChange={set("useCase")}
                    required
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Select use case
                    </option>
                    {USE_CASES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ▾
                  </span>
                </div>
              </div>

              {/* Current process */}
              <div>
                <label className={LABEL_CLASS}>
                  Tell us about your current process
                </label>
                <textarea
                  rows={4}
                  placeholder="How are you handling emissions tracking and reporting today? What's broken or time-consuming?"
                  value={formData.currentProcess}
                  onChange={set("currentProcess")}
                  className="w-full px-3 py-2.5 border border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              {/* Referral source */}
              <div>
                <label className={LABEL_CLASS}>How did you hear about us?</label>
                <div className="relative">
                  <select
                    value={formData.referralSource}
                    onChange={set("referralSource")}
                    className={SELECT_CLASS}
                  >
                    <option value="">Select one</option>
                    {REFERRAL_SOURCES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ▾
                  </span>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? "Submitting…" : "Request access"}
                </button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  We respect your privacy. No spam, ever.{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Privacy policy
                  </Link>
                </p>
              </div>
            </form>

            {/* Already have an account */}
            <p className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
