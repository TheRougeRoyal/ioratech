"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signInWithGoogle } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await signUp(email, password, name);
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email, name: name || undefined }),
      });
      router.push("/dashboard");
    } catch (err) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "An account with this email already exists"
          : err.code === "auth/weak-password"
          ? "Password is too weak"
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
      const user = await signInWithGoogle();
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email, name: user.displayName || undefined }),
      });
      router.push("/dashboard");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-up failed. Please try again.");
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
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>
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
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link href="/login" className="text-neutral-900 dark:text-neutral-50 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
