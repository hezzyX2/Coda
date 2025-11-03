"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, verifySession } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const publicPaths = ["/login", "/signup", "/home"];
    const isPublic = publicPaths.includes(pathname);

    // Verify session is valid - isAuthenticated already checks verifySession
    if (!isPublic && !isAuthenticated()) {
      router.push("/login");
      return;
    }

    // If authenticated and on login/signup, redirect to dashboard
    if (isPublic && pathname !== "/home" && isAuthenticated()) {
      router.push("/");
    }
  }, [mounted, pathname, router]);

  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const publicPaths = ["/login", "/signup"];
  const isPublic = publicPaths.includes(pathname);

  if (!isPublic && !isAuthenticated()) {
    return null; // Will redirect
  }

  return <>{children}</>;
}

