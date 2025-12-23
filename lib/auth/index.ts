import { NextRequest } from "next/server";
import { validateSession } from "./session";
import { verifyToken } from "./jwt";

/**
 * Verify authentication from request headers
 * Returns user data if authenticated, null otherwise
 */
export async function verifyAuth(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate session
    const session = await validateSession(token);
    if (!session) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

// Re-export other auth functions for convenience
export { createSession, deleteSession, validateSession, deleteAllUserSessions } from "./session";
export { createToken, verifyToken } from "./jwt";
export { hashPassword, verifyPassword, validatePassword } from "./password";
