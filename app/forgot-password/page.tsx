"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"
          ? "No account found with this email"
          : "Failed to send reset email. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white dark:bg-neutral-950">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-xl font-semibold mb-2">Check your email</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            A reset link has been sent to <strong>{email}</strong>.
          </p>
          <Link href="/login" className="text-sm font-medium hover:underline">
            Back to login
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

        {error && (
          <div className="mb-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        <h1 className="text-xl font-semibold mb-1">Reset password</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Remember your password?{" "}
          <Link href="/login" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
