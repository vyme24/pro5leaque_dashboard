"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth({ redirectIfNotLoggedIn = true } = {}) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [subscription, setSubscription] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("subscription");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Always check server on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/account/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setSubscription(data.subscription || null);
         
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.subscription) {
            localStorage.setItem("subscription", JSON.stringify(data.subscription));
          }
        } else {
          setUser(null);
          setSubscription(null);
          localStorage.removeItem("user");
          localStorage.removeItem("subscription");
          if (redirectIfNotLoggedIn) router.push("/auth/login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
        setSubscription(null);
        localStorage.removeItem("user");
        localStorage.removeItem("subscription");
        if (redirectIfNotLoggedIn) router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectIfNotLoggedIn]);


  // Logout: clear everything
  const logout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setSubscription(null);
      localStorage.removeItem("user");
      localStorage.removeItem("subscription");
      router.push("/auth/login");
    }
  };

  const authHeader = () => {
    if (user?.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  const isAuthenticated = !!user;

  return { user, subscription, isAuthenticated, loading, logout, authHeader };
}
