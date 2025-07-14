"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  function validateForm() {
    if (!email) return "Email is required.";
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    if (!password) return "Password is required.";
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    // Optionally: check for a number or special char
    // if (!/[0-9]/.test(password)) return "Password must contain a number.";

    if (!isLogin) {
      if (!username) return "Username is required.";
      if (username.length < 3)
        return "Username must be at least 3 characters long.";
      if (username.length > 20)
        return "Username must be less than 20 characters.";
    }
    return "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setError("");

    const vError = validateForm();
    if (vError) {
      setValidationError(vError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username,
        });
      }
      console.log("Saving user:", username);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl shadow-lg shadow-[var(--accent)]/10 w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-[var(--hover)] rounded-lg p-1 border border-[var(--border)]">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              isLogin
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--primary)] hover:bg-[var(--hover)]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              !isLogin
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--primary)] hover:bg-[var(--hover)]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--primary)] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[var(--secondary)] text-sm">
            {isLogin
              ? "Continue your typing journey"
              : "Join to track your progress"}
          </p>
        </div>

        {/* Error Message */}
        {(validationError || error) && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
            {validationError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--secondary)]">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] text-[var(--primary)] placeholder-[var(--secondary)] transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--secondary)]">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] text-[var(--primary)] placeholder-[var(--secondary)] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--secondary)]">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] text-[var(--primary)] placeholder-[var(--secondary)] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-[var(--button-bg)] text-[var(--secondary)] cursor-not-allowed"
                : "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                  {isLogin ? "Log In" : "Sign Up"}
                </>
              )}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[var(--secondary)]">
          {isLogin ? (
            <p>
              New here?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
              >
                Login instead
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}