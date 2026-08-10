"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateApiKeyPage() {
  const [name, setName] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="max-w-md space-y-6">
      <Link href="/dashboard/api-keys" className="text-sm text-neutral-600 dark:text-neutral-400 hover:underline">
        ← Back to API keys
      </Link>

      <div>
        <h1 className="text-lg font-semibold">Create API key</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Treat keys like passwords — keep them secure.
        </p>
      </div>

      {success ? (
        <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 text-sm">
          Key created. Copy it now — you won't see it again.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Key name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production server"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expires in (days, optional)</label>
            <input
              type="number"
              min="1"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              placeholder="30"
              className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full h-9 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create key"}
          </button>
        </form>
      )}
    </div>
  );
}
