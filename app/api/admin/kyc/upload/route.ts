import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

/**
 * POST /api/admin/kyc/upload
 * Admin uploads a KYC document for a client (stores URL reference)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const body = await request.json();
    const { clientId, documentType, fileUrl, fileName } = body;

    if (!clientId || !documentType || !fileUrl || !fileName) {
      return NextResponse.json(
        { error: "clientId, documentType, fileUrl and fileName are required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findFirst({ where: { id: clientId, brokerId } });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const doc = await prisma.kYCDocument.create({
      data: {
        brokerId,
        clientId,
        documentType,
        fileUrl,
        fileName,
        fileSize: 0,
        mimeType: "application/octet-stream",
        status: "UNDER_REVIEW",
        reviewedBy: user.id,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error("Admin KYC upload error:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
