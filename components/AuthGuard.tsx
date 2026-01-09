"use client";

import { auth } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Run generic check
    const isAuth = auth.isAuthenticated();
    const isLoginPage = window.location.pathname === '/login';

    if (!isAuth && !isLoginPage) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
    setChecking(false);
  }, [router]);

  // While checking, show nothing or spinner to prevent flash of content
  if (checking) return null;

  // If on login page, render children (the login form)
  // If authorized, render children
  // If not authorized and not on login, we redirected already.
  return <>{children}</>;
}
