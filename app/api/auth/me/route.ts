import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    // If auth failed, return the error response
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Get full user data
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        kycStatus: true,
        status: true,
        createdAt: true,
        client: {
          select: {
            id: true,
            clientId: true,
            firstName: true,
            lastName: true,
            phone: true,
            country: true,
            labels: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
