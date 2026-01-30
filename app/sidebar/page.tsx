"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Package,
  RotateCcw,
  IndianRupee,
  Barcode,
  FileText,
  Layers,
  Upload,
  Image,
  ShieldCheck,
  CreditCard,
  Warehouse,
  Briefcase,
  Menu,
  X,
  HelpCircle,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="hidden md:block fixed left-0 top-0 h-screen w-64
        bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#020617]
        text-gray-300 overflow-hidden shadow-2xl border-r border-white/10"
      >
        {/* LOGO */}
        <div className="px-5 py-3 text-lg font-semibold text-white border-b border-white/10">
          🚗 Car Booking
        </div>

        <div className="px-5 pt-4 pb-2 text-[10px] uppercase text-gray-400">
          Manage Business
        </div>

        {/* MENU */}
        <nav className="px-3 space-y-0.5 text-xs">
          <SidebarLink href="/dashboard" icon={<Home size={14} />} label="Dashboard" />
          <SidebarLink href="/orders" icon={<Package size={14} />} label="Orders" />
          <SidebarLink href="/returns" icon={<RotateCcw size={14} />} label="Returns" />
          <SidebarLink href="/pricing" icon={<IndianRupee size={14} />} label="Pricing" />
          <SidebarLink href="/barcode" icon={<Barcode size={14} />} label="Barcoded Packaging" />
          <SidebarLink href="/claims" icon={<FileText size={14} />} label="Claims" />
          <SidebarLink href="/inventory" icon={<Layers size={14} />} label="Inventory" />
          <SidebarLink href="/catalog" icon={<Upload size={14} />} label="Catalog Uploads" />
          <SidebarLink href="/images" icon={<Image size={14} />} label="Image Bulk Upload" />
          <SidebarLink href="/quality" icon={<ShieldCheck size={14} />} label="Quality" />
          <SidebarLink href="/payments" icon={<CreditCard size={14} />} label="Payments" />
          <SidebarLink href="/warehouse" icon={<Warehouse size={14} />} label="Warehouse" />
          <SidebarLink href="/services" icon={<Briefcase size={14} />} label="Services" />
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-4 right-4 flex items-center gap-2
          px-3 py-1.5 rounded-md text-xs text-red-400
          hover:text-white hover:bg-red-500/20 transition"
        >
          <LogOut size={14} />
          Logout
        </button>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-[#020617] text-gray-300
        flex justify-around py-2 md:hidden z-50 border-t border-white/10"
      >
        <BottomLink href="/sidebar" icon={<Home size={18} />} label="Home" />
        <BottomLink href="/orders" icon={<Package size={18} />} label="Orders" />
        <BottomLink href="/returns" icon={<RotateCcw size={18} />} label="Returns" />
        <BottomLink href="/help" icon={<HelpCircle size={18} />} label="Help" />

        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-[10px] text-gray-300"
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
            bg-[#020617] text-gray-300 rounded-t-2xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-white text-sm font-semibold">Menu</h2>
              <X onClick={() => setOpen(false)} size={18} />
            </div>

            <nav className="space-y-0.5 text-xs">
              <SidebarLink href="/dashboard" icon={<Home size={14} />} label="Dashboard" />
              <SidebarLink href="/orders" icon={<Package size={14} />} label="Orders" />
              <SidebarLink href="/returns" icon={<RotateCcw size={14} />} label="Returns" />
              <SidebarLink href="/pricing" icon={<IndianRupee size={14} />} label="Pricing" />
              <SidebarLink href="/barcode" icon={<Barcode size={14} />} label="Barcoded Packaging" />
              <SidebarLink href="/claims" icon={<FileText size={14} />} label="Claims" />
              <SidebarLink href="/inventory" icon={<Layers size={14} />} label="Inventory" />
              <SidebarLink href="/catalog" icon={<Upload size={14} />} label="Catalog Uploads" />
              <SidebarLink href="/images" icon={<Image size={14} />} label="Image Bulk Upload" />
              <SidebarLink href="/quality" icon={<ShieldCheck size={14} />} label="Quality" />
              <SidebarLink href="/payments" icon={<CreditCard size={14} />} label="Payments" />
              <SidebarLink href="/warehouse" icon={<Warehouse size={14} />} label="Warehouse" />
              <SidebarLink href="/services" icon={<Briefcase size={14} />} label="Services" />

              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center gap-2 px-3 py-1.5
                text-xs text-red-400 hover:text-white hover:bg-red-500/20 rounded-md"
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md
      text-gray-300 text-xs font-medium
      hover:bg-white/10 hover:text-white transition"
    >
      {icon}
      <span className="truncate">{label}</span>
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
      className="flex flex-col items-center text-[10px] text-gray-300"
    >
      {icon}
      {label}
    </Link>
  );
}
