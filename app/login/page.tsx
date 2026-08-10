"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn, signInWithGoogle } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(callbackUrl);
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"
          ? "No account found with this email"
          : err.code === "auth/wrong-password"
          ? "Incorrect password"
          : err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "An error occurred. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push(callbackUrl);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-neutral-500 hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-9 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-xs text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full h-9 border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-50"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-neutral-950">
          <div className="text-sm text-neutral-500">Loading login...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
