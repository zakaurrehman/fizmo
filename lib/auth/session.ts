import { prisma } from "@/lib/prisma";
import { createToken } from "./jwt";
import crypto from "crypto";

/**
 * Create a new session for a user
 */
export async function createSession(userId: string, email: string, role: string, brokerId: string) {
  // Create JWT token
  const token = await createToken({ userId, email, role, brokerId });

  // Store session in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string) {
  await prisma.session.delete({
    where: { token },
  });
}

/**
 * Validate if a session exists and is not expired
 */
export async function validateSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          client: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Check if expired
  if (session.expiresAt < new Date()) {
    await deleteSession(token);
    return null;
  }

  return session;
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string) {
  await prisma.session.deleteMany({
    where: { userId },
  });
}
