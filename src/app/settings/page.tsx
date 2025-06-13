"use client";

import { useTheme } from "../../lib/theme";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen pt-20 bg-[var(--background)] px-6 py-12">
      <div className="max-w-2xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-lg shadow-[var(--accent)]/30 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">Settings</h1>
          <p className="text-sm text-[var(--secondary)]">
            Manage your preferences, account details, and personal experience.
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--hover)]">
            <h2 className="font-semibold text-[var(--primary)] mb-1 text-sm">
              Theme
            </h2>
            <p className="text-xs text-[var(--secondary)] mb-4">
              Choose between light and dark mode.
            </p>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--button-bg)] border border-[var(--button-border)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <FaSun className="h-4 w-4 text-[var(--accent)]" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon className="h-4 w-4 text-[var(--accent)]" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Account Info */}
          <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--hover)]">
            <h2 className="font-semibold text-[var(--primary)] mb-1 text-sm">
              Account Info
            </h2>
            <p className="text-xs text-[var(--secondary)]">
              Update your email, password, or username.
            </p>
          </div>

          {/* Preferences */}
          <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--hover)]">
            <h2 className="font-semibold text-[var(--primary)] mb-1 text-sm">
              Preferences
            </h2>
            <p className="text-xs text-[var(--secondary)]">
              Choose theme, notification options, and typing preferences.
            </p>
          </div>

          {/* Danger Zone */}
          <div className="p-4 border border-[var(--border)] rounded-xl bg-[var(--hover)]">
            <h2 className="font-semibold text-[var(--primary)] mb-1 text-sm">
              Danger Zone
            </h2>
            <p className="text-xs text-[var(--secondary)] mb-2">
              Delete your account or reset all progress.
            </p>
            <button className="text-sm px-4 py-2 rounded-md bg-[var(--button-bg)] hover:bg-[var(--button-hover)] text-[var(--button-text)] font-medium transition border border-[var(--button-border)]">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
