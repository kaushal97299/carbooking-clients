"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ================= ANIMATION VARIANTS ================= */
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
  const [showOtp, setShowOtp] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const url = isLogin
        ? `${API}/api/clintlogin`
        : `${API}/api/signup`;

      const res = await axios.post(url, {
        email,
        password,
        ...(isLogin ? {} : { name }),
      });

      // After signup → send OTP
      if (!isLogin && res.data.otpStep) {
        await axios.post(`${API}/api/send-otp`, { email });
        setShowOtp(true);
        return;
      }

      // Normal login
      if (isLogin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email);
        router.push("/sidebar");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/verify-otp`, {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);

      router.push("/sidebar");

    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT ================= */

  const sendForgotOtp = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/api/forgot-password`, { email });

      setShowOtp(true);

      alert("OTP sent to email");

    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */

  const resetPassword = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/api/reset-password`, {
        email,
        otp,
        password,
      });

      alert("Password reset successful");

      setIsForgot(false);
      setShowOtp(false);
      setIsLogin(true);

    } catch {
      alert("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020b0a] text-white flex items-center justify-center px-4">

      {/* ===== BACKGROUND ===== */}
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

      {/* ===== CONTENT ===== */}
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
              ? "Access your dashboard, manage orders, inventory, and payments in one secure platform."
              : "Join thousands of businesses using our platform to manage cars, pricing, and customers effortlessly."}
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
              {showOtp
                ? "Verify OTP"
                : isForgot
                ? "Reset Password"
                : isLogin
                ? "Login"
                : "Sign Up"}
            </h2>

            <p className="text-center text-sm text-gray-300 mb-5">
              {isLogin ? "Continue to dashboard" : "Create account in seconds"}
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3 mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg text-sm font-medium">
                <FcGoogle size={18} /> Google
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg text-sm font-medium">
                <Github size={18} /> GitHub
              </button>
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/20" />
              <span className="text-xs text-gray-400">or continue with email</span>
              <div className="flex-1 h-px bg-white/20" />
            </div>

            {/* NAME */}
            {!isLogin && !showOtp && !isForgot && (
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-3 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            )}

            {/* EMAIL */}
            {!showOtp && (
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            )}

            {/* PASSWORD */}
            {!showOtp && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            )}

            {/* OTP */}
            {showOtp && (
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mb-4 p-3 bg-white/10 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400/50"
              />
            )}

            {/* BUTTON */}
            <button
              disabled={loading}
              onClick={
                showOtp
                  ? isForgot
                    ? resetPassword
                    : verifyOtp
                  : isForgot
                  ? sendForgotOtp
                  : handleSubmit
              }
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
            >
              {loading
                ? "Please wait..."
                : showOtp
                ? isForgot
                  ? "Reset Password"
                  : "Verify OTP"
                : isForgot
                ? "Send OTP"
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>

            {/* FORGOT */}
            {!showOtp && !isForgot && isLogin && (
              <p
                onClick={() => setIsForgot(true)}
                className="text-sm text-center text-cyan-400 mt-2 cursor-pointer"
              >
                Forgot Password?
              </p>
            )}

            {/* SWITCH */}
            {!showOtp && !isForgot && (
              <p className="text-sm text-center text-gray-300 mt-4">
                {isLogin ? "New user?" : "Already have account?"}{" "}
                <span
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setIsForgot(false);
                  }}
                  className="text-emerald-300 cursor-pointer hover:underline"
                >
                  {isLogin ? "Create account" : "Login"}
                </span>
              </p>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-emerald-300">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  );
}
