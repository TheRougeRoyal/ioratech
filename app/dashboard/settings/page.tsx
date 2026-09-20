"use client";

import { useAuth } from "@/lib/auth-context";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

/* ─── helpers ─────────────────────────────────────────────── */

function initials(name: string | undefined, email: string | null | undefined) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email[0].toUpperCase() : "?";
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-150 focus:outline-none ${
        checked
          ? "bg-emerald-500"
          : "bg-neutral-300 dark:bg-neutral-700"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-150 ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-50">
      {children}
    </h2>
  );
}

function SettingsRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">{label}</p>
        {hint && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{hint}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────────── */

export default function SettingsPage() {
  const { user, isDemo, signOut } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  /* Profile edit */
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [savedName, setSavedName] = useState("");

  useEffect(() => {
    const n = user?.displayName || "";
    setSavedName(n);
    setDraftName(n);
  }, [user]);

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavedName(draftName.trim() || savedName);
    setEditingName(false);
  }

  /* Password form */
  const isOAuth =
    user?.providerData?.some((p) =>
      ["google.com", "github.com", "microsoft.com"].includes(p.providerId)
    ) ?? false;

  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (!pwForm.current) return setPwError("Current password is required.");
    if (pwForm.next.length < 8)
      return setPwError("New password must be at least 8 characters.");
    if (pwForm.next !== pwForm.confirm)
      return setPwError("Passwords do not match.");
    // Placeholder — real implementation would call Firebase updatePassword
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
  }

  /* Notifications */
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    weeklyDigest: true,
    riskAlerts: true,
    reportReady: false,
  });

  function toggleNotif(key: string) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  /* Org info (static demo values) */
  const orgName = "IORATECH";
  const planName = "Starter";

  /* Sign out */
  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  /* Delete tooltip state */
  const [showDeleteTip, setShowDeleteTip] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page heading */}
      <div>
        <h1 className="text-lg font-semibold">Settings</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your account preferences and organization details.
        </p>
      </div>

      {/* ── 1. Profile ─────────────────────────────────────────── */}
      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <SectionHeading>Profile</SectionHeading>

        {/* Avatar row */}
        <div className="p-4 flex items-center gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <span className="text-base font-semibold text-emerald-700 dark:text-emerald-400 select-none">
              {initials(savedName, user?.email)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {savedName || user?.email || "—"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isDemo ? "Demo session" : "Active"}
            </p>
          </div>
        </div>

        {/* Display name row */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Display name
              </p>
              {!editingName && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {savedName || "—"}
                </p>
              )}
            </div>
            {!editingName && (
              <button
                type="button"
                onClick={() => {
                  setDraftName(savedName);
                  setEditingName(true);
                }}
                className="inline-flex items-center h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {editingName && (
            <form onSubmit={handleSaveName} className="mt-3 space-y-3">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Your full name"
                className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center h-9 px-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="inline-flex items-center h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Email row */}
        <SettingsRow
          label="Email"
          hint={user?.email || "—"}
        >
          <span className="inline-flex items-center h-6 px-2 text-xs border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 select-none">
            Read-only
          </span>
        </SettingsRow>
      </section>

      {/* ── 2. Password ────────────────────────────────────────── */}
      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <SectionHeading>Password</SectionHeading>

        {isOAuth || isDemo ? (
          <div className="p-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {isDemo
                ? "Password changes are unavailable in demo mode."
                : "Your account uses a third-party sign-in provider. Password changes are managed there."}
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, current: e.target.value }))
                  }
                  autoComplete="current-password"
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  New password
                </label>
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, next: e.target.value }))
                  }
                  autoComplete="new-password"
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) =>
                    setPwForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  autoComplete="new-password"
                  className="w-full h-9 px-3 border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-50"
                />
              </div>
            </div>

            {pwError && (
              <p className="text-xs text-red-600 dark:text-red-400">{pwError}</p>
            )}
            {pwSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Password updated successfully.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center h-9 px-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Update password
            </button>
          </form>
        )}
      </section>

      {/* ── 3. Theme ───────────────────────────────────────────── */}
      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <SectionHeading>Appearance</SectionHeading>

        <div className="p-4">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-3">
            Theme
          </p>
          <div className="flex gap-2">
            {[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ].map(({ value, label }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  className={`inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium border transition-colors ${
                    active
                      ? "border-neutral-900 dark:border-neutral-50 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900"
                      : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  }`}
                >
                  {value === "light" && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>
                  )}
                  {value === "dark" && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                  {value === "system" && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                    </svg>
                  )}
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            {theme === "system"
              ? "Follows your OS preference."
              : `Locked to ${theme} mode.`}
          </p>
        </div>
      </section>

      {/* ── 4. Notifications ───────────────────────────────────── */}
      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <SectionHeading>Notifications</SectionHeading>

        {[
          {
            key: "weeklyDigest",
            label: "Weekly digest",
            hint: "A summary of your emissions data and risk scores every Monday.",
          },
          {
            key: "riskAlerts",
            label: "Risk alerts",
            hint: "Immediate notification when a new physical or transition risk is detected.",
          },
          {
            key: "reportReady",
            label: "Report ready",
            hint: "Email when a compliance report (TCFD, CSRD, etc.) finishes generating.",
          },
        ].map(({ key, label, hint }) => (
          <SettingsRow key={key} label={label} hint={hint}>
            <Toggle
              id={`notif-${key}`}
              checked={notifs[key]}
              onChange={() => toggleNotif(key)}
            />
          </SettingsRow>
        ))}
      </section>

      {/* ── 5. Organization ────────────────────────────────────── */}
      <section className="border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        <SectionHeading>Organization</SectionHeading>

        <SettingsRow label="Organization name" hint={orgName}>
          <span className="text-xs text-neutral-500 dark:text-neutral-400" />
        </SettingsRow>

        <SettingsRow label="Plan" hint="Your current subscription tier.">
          <span className="inline-flex items-center h-6 px-2.5 text-xs font-medium border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 rounded bg-emerald-50 dark:bg-emerald-900/20">
            {planName}
          </span>
        </SettingsRow>

        <SettingsRow label="Members" hint="Users with access to this workspace.">
          <span className="text-sm text-neutral-900 dark:text-neutral-50 font-mono">1</span>
        </SettingsRow>
      </section>

      {/* ── 6. Danger Zone ─────────────────────────────────────── */}
      <section className="border border-red-200 dark:border-red-900 divide-y divide-red-200 dark:divide-red-900">
        <h2 className="text-sm font-semibold px-4 py-3 border-b border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
          Danger Zone
        </h2>

        {/* Sign out */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">Sign out</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              End your current session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center h-9 px-4 border border-red-300 dark:border-red-700 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Delete account */}
        <div className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Delete account
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Permanently remove your account and all associated data. This cannot be undone.
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              type="button"
              disabled
              onMouseEnter={() => setShowDeleteTip(true)}
              onMouseLeave={() => setShowDeleteTip(false)}
              onFocus={() => setShowDeleteTip(true)}
              onBlur={() => setShowDeleteTip(false)}
              className="inline-flex items-center h-9 px-4 border border-red-200 dark:border-red-900 text-sm font-medium text-red-400 dark:text-red-700 cursor-not-allowed opacity-60"
            >
              Delete account
            </button>
            {showDeleteTip && (
              <div className="absolute right-0 bottom-full mb-2 z-10 whitespace-nowrap">
                <div className="px-2.5 py-1.5 text-xs bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-md">
                  Contact support to delete your account
                </div>
                <div className="flex justify-end pr-3">
                  <div className="w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rotate-45 -mt-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
