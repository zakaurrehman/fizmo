import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * POST /api/kyc/upload
 * Upload KYC document to Vercel Blob storage
 */
export async function POST(request: NextRequest) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type is required" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Validate file type (images and PDFs only)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WEBP, and PDF files are allowed" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `kyc/${client.id}/${documentType}-${timestamp}.${fileExtension}`;

    // Upload to Vercel Blob
    const blob = await put(uniqueFileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Save document record to database
    const kycDocument = await prisma.kYCDocument.create({
      data: {
        clientId: client.id,
        documentType: documentType as any,
        fileUrl: blob.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        status: "PENDING",
      },
    });

    // Check if all required documents are uploaded
    const uploadedDocs = await prisma.kYCDocument.findMany({
      where: { clientId: client.id },
      select: { documentType: true, status: true },
    });

    const hasIdDocument =
      uploadedDocs.some(
        (doc) =>
          (doc.documentType === "ID_FRONT" ||
            doc.documentType === "PASSPORT" ||
            doc.documentType === "DRIVERS_LICENSE") &&
          doc.status !== "REJECTED"
      );

    const hasProofOfAddress = uploadedDocs.some(
      (doc) =>
        (doc.documentType === "PROOF_OF_ADDRESS" ||
          doc.documentType === "UTILITY_BILL" ||
          doc.documentType === "BANK_STATEMENT") &&
        doc.status !== "REJECTED"
    );

    // Update user KYC status if all required docs are uploaded
    if (hasIdDocument && hasProofOfAddress) {
      await prisma.user.update({
        where: { id: user.id },
        data: { kycStatus: "UNDER_REVIEW" },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        document: kycDocument,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("KYC upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload document",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
