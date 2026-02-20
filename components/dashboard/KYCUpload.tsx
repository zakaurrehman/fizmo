"use client";

import { useState, useEffect, useRef } from "react";
import { FaUpload, FaCheck, FaTimes, FaClock, FaTrash, FaEye } from "react-icons/fa";

interface KYCDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

interface KYCUploadProps {
  onUploadComplete?: () => void;
}

export function KYCUpload({ onUploadComplete }: KYCUploadProps) {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [kycStatus, setKycStatus] = useState<string>("PENDING");
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState("ID_FRONT");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: "ID_FRONT", label: "ID Card (Front)" },
    { value: "ID_BACK", label: "ID Card (Back)" },
    { value: "PASSPORT", label: "Passport" },
    { value: "DRIVERS_LICENSE", label: "Driver's License" },
    { value: "PROOF_OF_ADDRESS", label: "Proof of Address" },
    { value: "UTILITY_BILL", label: "Utility Bill" },
    { value: "BANK_STATEMENT", label: "Bank Statement" },
    { value: "SELFIE", label: "Selfie with ID" },
  ];

  // Fetch existing documents
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/kyc/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setKycStatus(data.kycStatus || "PENDING");
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, WEBP, and PDF files are allowed");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", selectedType);

      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/kyc/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh documents list
        await fetchDocuments();
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadComplete?.();
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (error: any) {
      setError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/kyc/documents?id=${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchDocuments();
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <FaCheck className="text-green-500" />;
      case "REJECTED":
        return <FaTimes className="text-red-500" />;
      case "UNDER_REVIEW":
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-500";
      case "REJECTED":
        return "bg-red-500/20 text-red-500";
      case "UNDER_REVIEW":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* KYC Status Card */}
      <div className={`rounded-xl p-6 ${getStatusColor(kycStatus)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">KYC Verification Status</h3>
            <p className="text-sm opacity-80">
              {kycStatus === "APPROVED" && "Your identity has been verified"}
              {kycStatus === "REJECTED" && "Some documents were rejected. Please reupload."}
              {kycStatus === "UNDER_REVIEW" && "Your documents are being reviewed"}
              {kycStatus === "PENDING" && "Please upload your verification documents"}
            </p>
          </div>
          <div className="text-4xl">{getStatusIcon(kycStatus)}</div>
        </div>
      </div>

      {/* Upload Section */}
      {kycStatus !== "APPROVED" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Upload Document</h3>

          <div className="space-y-4">
            {/* Document Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fizmo-purple-500"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select File
              </label>
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1 bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-fizmo-purple-500 file:text-white hover:file:bg-fizmo-purple-600 file:cursor-pointer"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-3 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FaUpload />
                  <span>{uploading ? "Uploading..." : "Upload"}</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Accepted formats: JPEG, PNG, WEBP, PDF. Max size: 10MB
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-500">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Documents */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Uploaded Documents</h3>

        {documents.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No documents uploaded yet
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-fizmo-dark-800 rounded-lg p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getStatusIcon(doc.status)}</div>
                    <div>
                      <h4 className="text-white font-medium">{doc.fileName}</h4>
                      <p className="text-sm text-gray-400">
                        {documentTypes.find((t) => t.value === doc.documentType)?.label} •{" "}
                        {formatFileSize(doc.fileSize)} •{" "}
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      {doc.rejectionReason && (
                        <p className="text-sm text-red-500 mt-1">
                          Rejected: {doc.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                      doc.status
                    )}`}
                  >
                    {doc.status}
                  </span>
                  {(doc.status === "PENDING" || doc.status === "REJECTED") && (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
        <div className="space-y-2 text-gray-400">
          <p>✓ One government-issued ID (ID Card, Passport, or Driver's License)</p>
          <p>✓ One proof of address (Utility Bill, Bank Statement, or Proof of Address)</p>
          <p>✓ Documents must be clear and readable</p>
          <p>✓ All corners of the document must be visible</p>
          <p>✓ No glare or shadows on the document</p>
        </div>
      </div>
    </div>
  );
}
