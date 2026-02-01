"use client";

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./sidebar/page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* 🔒 ROUTE GUARD */
  useEffect(() => {
    if (token && isLoginPage) {
      router.replace("/sidebar");
    }

    if (!token && !isLoginPage) {
      router.replace("/");
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className="min-h-screen w-full overflow-x-hidden bg-black">
        {isLoginPage ? (
          // ✅ LOGIN PAGE = FULL SCREEN (NO PADDING, NO SIDEBAR)
          children
        ) : (
          // ✅ AFTER LOGIN LAYOUT
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-100  md:ml-50 lg:ml-64">
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
