import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { sendKycStatusEmail } from "@/lib/email";

/**
 * GET /api/admin/kyc
 * Get all KYC documents for admin review
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
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

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    // Build where clause
    const where: any = {
      brokerId,
    };
    if (status) {
      where.status = status;
    }
    if (clientId) {
      where.clientId = clientId;
    }

    // Get all KYC documents within this broker
    const documents = await prisma.kYCDocument.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            clientId: true,
            firstName: true,
            lastName: true,
            user: {
              select: {
                email: true,
                kycStatus: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group documents by client
    const clientDocuments = documents.reduce((acc: any, doc) => {
      const clientKey = doc.clientId;
      if (!acc[clientKey]) {
        acc[clientKey] = {
          client: doc.client,
          documents: [],
        };
      }
      acc[clientKey].documents.push({
        id: doc.id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        fileUrl: doc.fileUrl, // Admins can see the file URL
        status: doc.status,
        rejectionReason: doc.rejectionReason,
        reviewedBy: doc.reviewedBy,
        reviewedAt: doc.reviewedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      clients: Object.values(clientDocuments),
      totalDocuments: documents.length,
    });
  } catch (error: any) {
    console.error("Get admin KYC error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch KYC documents",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/kyc
 * Approve or reject a KYC document
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication and admin role
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
    const { documentId, status, rejectionReason } = body;

    // Validation
    if (!documentId || !status) {
      return NextResponse.json(
        { error: "Document ID and status are required" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "UNDER_REVIEW"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (status === "REJECTED" && !rejectionReason) {
      return NextResponse.json(
        { error: "Rejection reason is required for rejected documents" },
        { status: 400 }
      );
    }

    // Get document (verify it belongs to this broker)
    const document = await prisma.kYCDocument.findFirst({
      where: {
        id: documentId,
        brokerId,
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Update document status
    const updatedDocument = await prisma.kYCDocument.update({
      where: { id: documentId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason : null,
        reviewedBy: user.email,
        reviewedAt: new Date(),
      },
    });

    // Get all documents for this client
    const clientDocuments = await prisma.kYCDocument.findMany({
      where: { clientId: document.clientId },
    });

    // Determine overall KYC status
    const hasRejected = clientDocuments.some((doc) => doc.status === "REJECTED");
    const hasPending = clientDocuments.some((doc) => doc.status === "PENDING");
    const allApproved = clientDocuments.every((doc) => doc.status === "APPROVED");
    const hasUnderReview = clientDocuments.some(
      (doc) => doc.status === "UNDER_REVIEW"
    );

    // Check if minimum required documents are approved
    const hasIdDocument = clientDocuments.some(
      (doc) =>
        (doc.documentType === "ID_FRONT" ||
          doc.documentType === "PASSPORT" ||
          doc.documentType === "DRIVERS_LICENSE") &&
        doc.status === "APPROVED"
    );

    const hasProofOfAddress = clientDocuments.some(
      (doc) =>
        (doc.documentType === "PROOF_OF_ADDRESS" ||
          doc.documentType === "UTILITY_BILL" ||
          doc.documentType === "BANK_STATEMENT") &&
        doc.status === "APPROVED"
    );

    let userKycStatus = "PENDING";

    if (hasRejected) {
      userKycStatus = "REJECTED";
    } else if (hasIdDocument && hasProofOfAddress && allApproved) {
      userKycStatus = "APPROVED";
    } else if (hasUnderReview || hasPending) {
      userKycStatus = "UNDER_REVIEW";
    }

    // Update user's overall KYC status
    await prisma.user.update({
      where: { id: document.client.userId },
      data: { kycStatus: userKycStatus as any },
    });

    // Create audit log
    await prisma.audit.create({
      data: {
        brokerId,
        actor: user.id,
        action: "KYC_DOCUMENT_REVIEW",
        target: documentId,
        payload: {
          status,
          rejectionReason,
          clientId: document.clientId,
          documentType: document.documentType,
          userKycStatus,
        },
      },
    });

    // Send email notification to user about overall KYC status change
    await sendKycStatusEmail(
      document.client.user.email,
      userKycStatus,
      status === "REJECTED" ? rejectionReason : undefined,
      `${document.client.firstName} ${document.client.lastName}`
    );

    return NextResponse.json({
      success: true,
      message: `Document ${status.toLowerCase()} successfully`,
      document: updatedDocument,
      userKycStatus,
    });
  } catch (error: any) {
    console.error("Review KYC document error:", error);
    return NextResponse.json(
      {
        error: "Failed to review document",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
