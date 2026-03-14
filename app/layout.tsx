"use client";

import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./sidebar/page";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* AUTH PAGES (no login required) */
  const isAuthPage =
    pathname === "/" || pathname.startsWith("/reset-password");

  /* 🔒 ROUTE GUARD */
  useEffect(() => {

    // logged-in user should not see login page
    if (token && pathname === "/") {
      router.replace("/sidebar");
    }

    // non-logged-in user cannot access protected pages
    if (!token && !isAuthPage) {
      router.replace("/");
    }

  }, [pathname]);

  return (
    <html lang="en">
      <body className="min-h-screen w-full overflow-x-hidden bg-black">

        {/* GOOGLE LOGIN SCRIPT */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />

        {isAuthPage ? (
          /* LOGIN + RESET PASSWORD PAGES */
          children
        ) : (
          /* AFTER LOGIN LAYOUT */
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-100 md:ml-50 lg:ml-64">
              {children}
            </main>
          </div>
        )}

      </body>
    </html>
  );
}