"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL;

// Strong password regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function AuthPage() {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  /* ================= SOCIAL LOGIN ================= */

  const handleGoogleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API}/auth/github`;
  };

  /* ================= BUBBLES ================= */

  const bubbles = useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 20 + Math.random() * 60,
        delay: `${Math.random() * 5}s`,
        duration: `${12 + Math.random() * 10}s`,
      })),
    []
  );

  /* ================= VALIDATION ================= */

  const validate = () => {

    if (!isLogin && name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    if (!email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Enter a valid email address";
    }

    if (!password) {
      return "Password is required";
    }

    if (!isLogin && passwordError) {
      return "Please enter a strong password";
    }

    return "";
  };

  /* ================= PASSWORD ================= */

  const handlePasswordChange = (val: string) => {

    setPassword(val);

    if (!val) {
      setPasswordError("Password is required");
      setPasswordStrength("");
    }
    else if (!strongPasswordRegex.test(val)) {
      setPasswordError(
        "8+ chars, Aa, 1 number & special character required"
      );
      setPasswordStrength("Weak");
    }
    else {
      setPasswordError("");
      setPasswordStrength("Strong");
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    const msg = validate();

    if (msg) {
      setError(msg);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const url = isLogin
        ? `${API}/api/clintlogin`
        : `${API}/api/signup`;

      const res = await axios.post(url, {
        email,
        password,
        ...(isLogin ? {} : { name }),
      });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email);
        router.push("/sidebar");
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
        setPassword("");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020b0a] text-white flex items-center justify-center px-4">

      {/* BACKGROUND */}
      <div className="absolute inset-0 mesh-bg" />

      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:grid md:grid-cols-2 items-center">

        {/* LEFT */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col justify-center px-6 md:px-16 pt-12 md:pt-0"
        >
          <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl font-bold">
            {isLogin ? (
              <>
                Welcome Back 👋 <br />
                <span className="text-emerald-300">
                  Manage your bookings smarter
                </span>
              </>
            ) : (
              <>
                Create Your Account 🚀 <br />
                <span className="text-emerald-300">
                  Start your journey today
                </span>
              </>
            )}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-gray-300 max-w-md">
            {isLogin
              ? "Access your dashboard securely."
              : "Join thousands of users today."}
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-8 mt-6 text-sm">
            <Stat value="500+" label="Cars" />
            <Stat value="50k+" label="Users" />
            <Stat value="24/7" label="Support" />
          </motion.div>
        </motion.div>

        {/* RIGHT FORM */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center w-full px-4 py-10"
        >
          <div className="relative mobile-glow-soft w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.55)] animate-floatCard">

            <h2 className="text-2xl font-bold text-center text-emerald-300 mb-2">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            {/* SOCIAL LOGIN */}
            <div className="flex gap-3 mb-4">

              <button
                onClick={handleGoogleLogin}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg text-sm font-medium"
              >
                <FcGoogle size={18} /> Google
              </button>

              <button
                onClick={handleGithubLogin}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium"
              >
                <Github size={18} /> GitHub
              </button>

            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs text-gray-400">or continue with email</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm text-center mb-3">
                {error}
              </p>
            )}

            {/* NAME */}
            {!isLogin && (
              <input
                placeholder="Full Name (min 3 chars)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            )}

            {/* EMAIL */}
            <input
              placeholder="Email (example@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password (8+ chars, Aa1@ required)"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full mb-1 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
            />

            {/* PASSWORD HINT */}
            {!isLogin && passwordError && (
              <p className="text-red-400 text-xs mb-2">
                {passwordError}
              </p>
            )}

            {!isLogin && passwordStrength && !passwordError && (
              <p className="text-green-400 text-xs mb-2">
                Password is {passwordStrength}
              </p>
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full mt-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

            {/* SWITCH */}
            <p className="text-sm text-center text-gray-300 mt-4">
              {isLogin ? "New user?" : "Already have account?"}{" "}
              <span
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setPassword("");
                  setPasswordError("");
                  setPasswordStrength("");
                }}
                className="text-emerald-300 cursor-pointer hover:underline"
              >
                {isLogin ? "Create account" : "Login"}
              </span>
            </p>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= STATS ================= */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-emerald-300">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}
