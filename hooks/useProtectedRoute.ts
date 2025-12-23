"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

type UserRole = "CLIENT" | "ADMIN" | "IB" | "SUPER_ADMIN";

/**
 * Hook to protect routes and redirect if not authenticated
 */
export function useProtectedRoute(allowedRoles?: UserRole[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push("/login");
        return;
      }

      // Check role if specified
      if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, allowedRoles, router]);

  return { user, loading };
}

/**
 * Hook for admin-only routes
 */
export function useAdminRoute() {
  return useProtectedRoute(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Hook for super admin-only routes
 */
export function useSuperAdminRoute() {
  return useProtectedRoute(["SUPER_ADMIN"]);
}
