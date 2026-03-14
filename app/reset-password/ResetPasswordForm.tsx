/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordForm() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const resetPassword = async () => {

    if (!token) {
      setMsg("Invalid reset link");
      return;
    }

    if (!password) {
      setMsg("Password required");
      return;
    }

    try {

      const res = await axios.post(`${API}/api/reset-passwordd`, {
        token,
        password
      });

      setMsg(res.data?.message || "Password updated");

      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-[#0b1413] p-8 rounded-xl w-[350px]">

        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/10 mb-4"
        />

        <button
          onClick={resetPassword}
          className="w-full bg-emerald-500 py-2 rounded-lg"
        >
          Reset Password
        </button>

        {msg && (
          <p className="text-center mt-3 text-sm">
            {msg}
          </p>
        )}

      </div>

    </div>

  );

}