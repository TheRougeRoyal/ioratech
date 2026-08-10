"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ioratech.apiKeys";

const MOCK_KEYS = [
  {
    id: "mk_01HZ8XK3G7M2P4Q5R6T8V9W0AY",
    name: "Production server",
    key_preview: "sk_live_a1b2••••c3d4••••e5f6",
    created_at: "2026-07-14T09:23:00.000Z",
  },
  {
    id: "mk_01HZ8XK3G7M2P4Q5R6T8V9W0B4",
    name: "Staging CI",
    key_preview: "sk_test_7g8h••••i9j0••••k1l2",
    created_at: "2026-07-22T15:08:00.000Z",
  },
  {
    id: "mk_01HZ8XK3G7M2P4Q5R6T8V9W0C7",
    name: "Local dev",
    key_preview: "sk_dev_m3n4••••o5p6••••q7r8",
    created_at: "2026-08-02T11:42:00.000Z",
  },
];

function readKeys() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_KEYS));
    return MOCK_KEYS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return MOCK_KEYS;
  }
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);

  useEffect(() => {
    setApiKeys(readKeys());
  }, []);

  const revoke = (id) => {
    const next = apiKeys.filter((k) => k.id !== id);
    setApiKeys(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">API keys</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage programmatic access to your account.
          </p>
        </div>
        <Link
          href="/dashboard/api-keys/create"
          className="inline-flex items-center h-8 px-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          Create key
        </Link>
      </div>

      {apiKeys.length === 0 ? (
        <div className="border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No API keys yet.</p>
          <Link
            href="/dashboard/api-keys/create"
            className="inline-flex items-center h-8 px-3 mt-3 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            Create your first key
          </Link>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
          {apiKeys.map((k) => (
            <div key={k.id} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{k.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Created {new Date(k.created_at).toLocaleDateString()}
                </p>
                <code className="block mt-2 px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-xs font-mono break-all">
                  {k.key_preview}
                </code>
              </div>
              <button
                onClick={() => revoke(k.id)}
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
