import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth/session";
import type { ApiResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "No token provided",
        },
        { status: 401 }
      );
    }

    // Delete session
    await deleteSession(token);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
