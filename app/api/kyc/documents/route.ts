import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

/**
 * GET /api/kyc/documents
 * Get all KYC documents for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get all KYC documents for this client
    const documents = await prisma.kYCDocument.findMany({
      where: { clientId: client.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        documentType: true,
        fileName: true,
        fileSize: true,
        mimeType: true,
        status: true,
        rejectionReason: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
        // Don't expose fileUrl to prevent unauthorized access
        fileUrl: false,
      },
    });

    // Get user's overall KYC status
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { kycStatus: true },
    });

    return NextResponse.json({
      success: true,
      kycStatus: userData?.kycStatus || "PENDING",
      documents,
    });
  } catch (error: any) {
    console.error("Get KYC documents error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch documents",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/kyc/documents?id=xxx
 * Delete a KYC document (only if status is REJECTED or PENDING)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get document ID from query params
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get client info
    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Verify document belongs to client
    const document = await prisma.kYCDocument.findFirst({
      where: {
        id: documentId,
        clientId: client.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of REJECTED or PENDING documents
    if (document.status === "APPROVED" || document.status === "UNDER_REVIEW") {
      return NextResponse.json(
        { error: "Cannot delete approved or under-review documents" },
        { status: 403 }
      );
    }

    // Delete document from database
    await prisma.kYCDocument.delete({
      where: { id: documentId },
    });

    // TODO: Delete file from Vercel Blob storage
    // This requires Vercel Blob delete API
    // For now, files remain in storage (they're small and storage is cheap)

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete KYC document error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete document",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
