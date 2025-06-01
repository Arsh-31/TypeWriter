"use client";

import { useEffect, useRef, useState } from "react";
import { FaKeyboard, FaUserCircle, FaSignInAlt } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false); // Track scroll for sticky effect
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // Control dropdown visibility
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Check auth status

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Brand */}
          <div className="flex items-center space-x-2">
            <FaKeyboard className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              TypeWriter
            </span>
          </div>

          {isAuthenticated ? (
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
              {/* Avatar with hover effect */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${getAvatarColor()} text-white text-lg font-bold transition-transform hover:scale-105`}
              >
                {userName?.charAt(0).toUpperCase()}
              </button>

              {/* Username with subtle hover effect */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="text-gray-300 hover:text-white font-medium transition-colors focus:outline-none flex items-center"
              >
                {userName}
                <svg
                  className={`ml-1 w-4 h-4 transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu - matches container style */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-14 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl shadow-cyan-500/10 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-gray-300">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {userName}
                    </p>
                  </div>

                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Statistics
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-cyan-400 transition-colors"
                    >
                      Settings
                    </a>
                  </div>

                  <div className="border-t border-gray-700 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Login button (unchanged)
            <Link href="/login">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white transition-all shadow-md hover:shadow-cyan-500/30">
                <FaSignInAlt className="h-4 w-4" />
                <span>Login</span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
