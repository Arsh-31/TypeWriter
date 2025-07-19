"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaKeyboard,
  FaUserCircle,
  FaSignInAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import Link from "next/link";
import { useTheme } from "../lib/theme";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false); // Track scroll for sticky effect
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Control dropdown visibility
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Check auth status
  const { theme, toggleTheme } = useTheme();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setIsAuthenticated(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().username);
          console.log("User authenticated:", userDoc.data().username);
        }
      } else {
        setIsAuthenticated(false);
        setUserName("");
      }
    });
    return () => unsub();
  }, []);

  // Sticky Navbar on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate consistent avatar color based on first character
  const getAvatarColor = () => {
    const colors = [
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-purple-500",
      "bg-indigo-500",
    ];
    if (!userName) return "bg-gray-500";
    const index = userName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setProfileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[var(--button-bg)] shadow-inner">
              <FaKeyboard className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[var(--primary)]">
              TypeWriter
            </span>
          </div>

          {/* Right - Theme Toggle + Auth */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition-colors border border-[var(--button-border)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <FaSun className="h-5 w-5 text-[var(--accent)]" />
              ) : (
                <FaMoon className="h-5 w-5 text-[var(--accent)]" />
              )}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div
                className="relative flex items-center gap-3"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-[var(--primary)] hover:text-[var(--accent)] transition"
                >
                  <span className="font-bold">Hello, {userName}</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    } text-[var(--accent)]/80`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 backdrop-blur-md bg-[var(--card-bg)]/80 border border-[var(--card-border)] rounded-2xl shadow-xl shadow-[var(--accent)]/10 z-50 overflow-hidden animate-fadeIn ring-1 ring-[var(--card-border)]/40">
                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-[var(--primary)] hover:bg-[var(--hover)] hover:text-[var(--accent)] transition rounded-md"
                      >
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-[var(--border)] py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--secondary)] hover:bg-[var(--hover)] hover:text-[var(--accent)] transition rounded-md"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="px-4 py-2 rounded-md bg-[var(--button-bg)] border border-[var(--button-border)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition flex items-center gap-2 text-sm font-medium shadow-sm">
                  <FaSignInAlt className="h-4 w-4 text-[var(--accent)]" />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
