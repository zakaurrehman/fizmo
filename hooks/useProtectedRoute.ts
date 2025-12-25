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
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to admin login
      if (!user) {
        router.push("/admin-login");
        return;
      }

      // Check if user is ADMIN or SUPER_ADMIN
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, router]);

  return { user, loading };
}

/**
 * Hook for super admin-only routes
 */
export function useSuperAdminRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to super admin login
      if (!user) {
        router.push("/super-admin/login");
        return;
      }

      // Check if user is SUPER_ADMIN
      if (user.role !== "SUPER_ADMIN") {
        router.push("/unauthorized");
        return;
      }
    }
  }, [user, loading, router]);

  return { user, loading };
}
