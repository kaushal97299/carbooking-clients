/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  RotateCcw,
  IndianRupee,
  FileText,
  Layers,
  ShieldCheck,
  CreditCard,
  Warehouse,
  Briefcase,
  Menu,
  X,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const router = useRouter();

  /* ================= GET USER EMAIL ================= */
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) setUserEmail(email);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.replace("/");
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="hidden md:block fixed left-0 top-0 h-screen w-64
        bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#020617]
        text-gray-300 shadow-2xl border-r border-white/10"
      >
        {/* LOGO */}
        <div className="px-5 py-3 text-lg font-semibold text-white border-b border-white/10">
          🚗 Car Booking
        </div>

        {/* USER */}
        <div className="px-5 py-3 border-b border-white/10">
          <p className="text-[10px] uppercase text-gray-400">
            Logged in as
          </p>

          <div className="flex items-center gap-2 mt-1">
            <User size={14} className="text-emerald-400" />

            {/* CLICKABLE EMAIL */}
            <Link
              href="/profile"
              className="text-sm text-white truncate
              hover:text-emerald-400 hover:underline transition"
            >
              {userEmail || "Loading..."}
            </Link>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2 text-[10px] uppercase text-gray-400">
          Manage Business
        </div>

        {/* MENU */}
        <nav className="px-3 space-y-1 text-xs">
          <SidebarLink href="/dashboard" icon={<Home size={14} />} label="Dashboard" />
          <SidebarLink href="/orders" icon={<Package size={14} />} label="Orders" />
          <SidebarLink href="/pricing" icon={<IndianRupee size={14} />} label="Pricing" />
          <SidebarLink href="/claims" icon={<FileText size={14} />} label="Claims" />
          <SidebarLink href="/inventory" icon={<Layers size={14} />} label="Inventory" />
          <SidebarLink href="/quality" icon={<ShieldCheck size={14} />} label="Quality" />
          <SidebarLink href="/payments" icon={<CreditCard size={14} />} label="Payments" />
          <SidebarLink href="/warehouse" icon={<Warehouse size={14} />} label="Warehouse" />
          <SidebarLink href="/services" icon={<Briefcase size={14} />} label="Services" />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-4 right-4 flex items-center gap-2
          px-3 py-2 rounded-md text-xs text-red-400
          hover:text-white hover:bg-red-500/20 transition"
        >
          <LogOut size={14} />
          Logout
        </button>
      </aside>

      {/* ================= MOBILE NAV ================= */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#020617]
        text-gray-300 flex justify-around py-2 md:hidden
        border-t border-white/10 z-50"
      >
        <BottomLink href="/dashboard" icon={<Home size={18} />} label="Home" />
        <BottomLink href="/orders" icon={<Package size={18} />} label="Orders" />
        <BottomLink href="/returns" icon={<RotateCcw size={18} />} label="Returns" />
        <BottomLink href="/help" icon={<HelpCircle size={18} />} label="Help" />

        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-[10px]"
        >
          <Menu size={20} />
          More
        </button>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute bottom-0 left-0 right-0 h-[85%]
            bg-[#020617] rounded-t-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-3">
              <h2 className="text-white text-sm font-semibold">
                Menu
              </h2>

              <X onClick={() => setOpen(false)} size={18} />
            </div>

            {/* USER (MOBILE) */}
            <div className="mb-4 px-3 py-2 border border-white/10 rounded-lg">
              <p className="text-xs text-gray-400">Logged in as</p>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-sm text-white truncate
                hover:text-emerald-400 transition"
              >
                {userEmail || "Loading..."}
              </Link>
            </div>

            <nav className="space-y-1 text-xs">
              <SidebarLink href="/dashboard" icon={<Home size={14} />} label="Dashboard" />
              <SidebarLink href="/orders" icon={<Package size={14} />} label="Orders" />
              <SidebarLink href="/pricing" icon={<IndianRupee size={14} />} label="Pricing" />
              <SidebarLink href="/claims" icon={<FileText size={14} />} label="Claims" />
              <SidebarLink href="/inventory" icon={<Layers size={14} />} label="Inventory" />
              <SidebarLink href="/quality" icon={<ShieldCheck size={14} />} label="Quality" />
              <SidebarLink href="/payments" icon={<CreditCard size={14} />} label="Payments" />
              <SidebarLink href="/warehouse" icon={<Warehouse size={14} />} label="Warehouse" />
              <SidebarLink href="/services" icon={<Briefcase size={14} />} label="Services" />

              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center gap-2 px-3 py-2
                text-xs text-red-400 hover:bg-red-500/20 rounded"
              >
                <LogOut size={14} />
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

/* ================= COMPONENTS ================= */

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md
      text-gray-300 text-xs font-medium
      hover:bg-white/10 hover:text-white transition"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function BottomLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-[10px]"
    >
      {icon}
      {label}
    </Link>
  );
}
