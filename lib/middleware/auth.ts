import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import type { ApiResponse } from "@/types/api";

export type UserRole = "CLIENT" | "ADMIN" | "IB" | "SUPER_ADMIN";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Middleware to verify authentication
 */
export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Authentication required",
      },
      { status: 401 }
    );
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Invalid or expired token",
      },
      { status: 401 }
    );
  }

  // Validate session exists in database
  const session = await validateSession(token);

  if (!session) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Session expired or invalid",
      },
      { status: 401 }
    );
  }

  // Return user data
  return {
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    },
  };
}

/**
 * Middleware to verify role-based access
 */
export async function requireRole(request: NextRequest, allowedRoles: UserRole[]) {
  const authResult = await requireAuth(request);

  // If auth failed, return the error response
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Insufficient permissions",
      },
      { status: 403 }
    );
  }

  return { user };
}

/**
 * Helper to require admin access
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Helper to require super admin access
 */
export async function requireSuperAdmin(request: NextRequest) {
  return requireRole(request, ["SUPER_ADMIN"]);
}
