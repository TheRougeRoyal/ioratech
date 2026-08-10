"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your account and preferences.
        </p>
      </div>

      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.displayName || "—"}</p>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email || "—"}</p>
          </div>
        </div>
      </section>

      <section className="border border-neutral-200 dark:border-neutral-800">
        <div className="p-4">
          <p className="text-sm font-medium">Theme</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Follows your system preference.
          </p>
        </div>
      </section>

      <section className="border border-neutral-200 dark:border-neutral-800 p-4">
        <p className="text-sm font-medium mb-3">Session</p>
        <button
          onClick={() => signOut().then(() => router.push("/login"))}
          className="inline-flex items-center h-8 px-3 text-sm font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
