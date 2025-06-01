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
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 👈 new
  const [error, setError] = useState("");
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

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

        // 👇 Store username in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username,
        });
      }
      console.log("Saving user:", username);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 👇 Create doc only if it's new
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username: user.displayName || "Anonymous",
        });
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-xl shadow-cyan-500/10 w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              isLogin
                ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              !isLogin
                ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? "Continue your typing journey"
              : "Join to track your progress"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
              isSubmitting
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-lg hover:shadow-cyan-500/20"
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
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? (
            <p>
              New here?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
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
