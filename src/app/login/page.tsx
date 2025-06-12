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

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     // 👇 Create doc only if it's new
  //     const userDoc = await getDoc(doc(db, "users", user.uid));
  //     if (!userDoc.exists()) {
  //       await setDoc(doc(db, "users", user.uid), {
  //         email: user.email,
  //         username: user.displayName || "Anonymous",
  //       });
  //     }

  //     router.push("/dashboard");
  //   } catch (err: any) {
  //     setError(err.message);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5FF] px-4">
      <div className="bg-white border border-[#E3DDEF] p-8 rounded-2xl shadow-lg shadow-[#A68CB0]/10 w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex mb-6 bg-[#F3F0FA] rounded-lg p-1 border border-[#E3DDEF]">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              isLogin
                ? "bg-[#A68CB0] text-white shadow-sm"
                : "text-[#4E4C67] hover:bg-[#ECE9F6]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-md text-center font-medium transition-all ${
              !isLogin
                ? "bg-[#A68CB0] text-white shadow-sm"
                : "text-[#4E4C67] hover:bg-[#ECE9F6]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#4E4C67] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[#7F7D93] text-sm">
            {isLogin
              ? "Continue your typing journey"
              : "Join to track your progress"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#FBEAEC] border border-[#F4C7CD] rounded-lg text-[#8C4E57] text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B3A7C5]">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 bg-[#F8F5FF] border border-[#E3DDEF] rounded-lg focus:border-[#A68CB0] focus:ring-1 focus:ring-[#A68CB0] text-[#4E4C67] placeholder-[#B3A7C5] transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B3A7C5]">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-[#F8F5FF] border border-[#E3DDEF] rounded-lg focus:border-[#A68CB0] focus:ring-1 focus:ring-[#A68CB0] text-[#4E4C67] placeholder-[#B3A7C5] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B3A7C5]">
              <FaLock />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-[#F8F5FF] border border-[#E3DDEF] rounded-lg focus:border-[#A68CB0] focus:ring-1 focus:ring-[#A68CB0] text-[#4E4C67] placeholder-[#B3A7C5] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isSubmitting
                ? "bg-[#D6D1E8] text-[#7F7D93] cursor-not-allowed"
                : "bg-[#A68CB0] text-white hover:bg-[#8C73A2]"
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
        <div className="mt-6 text-center text-sm text-[#7F7D93]">
          {isLogin ? (
            <p>
              New here?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#A68CB0] hover:text-[#8B73A2] transition-colors"
              >
                Create account
              </button>
            </p>
          ) : (
            <p>
              Have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#A68CB0] hover:text-[#8B73A2] transition-colors"
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
