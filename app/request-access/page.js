"use client";

import Link from "next/link";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RequestAccessPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    companySize: "",
    useCase: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold mb-2">Request received</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Thanks for your interest. We'll review and reach out within 1–2 business days.
          </p>
          <Link href="/" className="text-sm font-medium hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-neutral-950">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center text-sm font-semibold tracking-tight mb-8">
          Iora
        </Link>

        <h1 className="text-xl font-semibold mb-1">Request access</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Tell us about your organization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                placeholder="Jane"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Work email</label>
            <input
              type="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job title</label>
            <input
              placeholder="Sustainability Lead"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              required
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company size</label>
            <Select value={formData.companySize} onValueChange={(v) => setFormData({ ...formData, companySize: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-50">1–50</SelectItem>
                <SelectItem value="51-200">51–200</SelectItem>
                <SelectItem value="201-1000">201–1,000</SelectItem>
                <SelectItem value="1001-5000">1,001–5,000</SelectItem>
                <SelectItem value="5001+">5,001+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">How can we help?</label>
            <textarea
              rows={3}
              placeholder="Briefly describe your needs"
              value={formData.useCase}
              onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit request"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
