"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaClock, FaEye, FaUser } from "react-icons/fa";

interface KYCDocument {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
}

interface Client {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  user: {
    email: string;
    kycStatus: string;
  };
}

interface ClientDocuments {
  client: Client;
  documents: KYCDocument[];
}

export default function AdminKYCPage() {
  const [clients, setClients] = useState<ClientDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchKYCDocuments();
  }, []);

  const fetchKYCDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/kyc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Failed to fetch KYC documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (documentId: string, status: string) => {
    if (status === "REJECTED" && !rejectionReason) {
      alert("Please provide a rejection reason");
      return;
    }

    setReviewing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/kyc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId,
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        // Refresh documents
        await fetchKYCDocuments();
        // Close modal
        setSelectedDocument(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Failed to review document:", error);
    } finally {
      setReviewing(false);
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

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      ID_FRONT: "ID Card (Front)",
      ID_BACK: "ID Card (Back)",
      PASSPORT: "Passport",
      DRIVERS_LICENSE: "Driver's License",
      PROOF_OF_ADDRESS: "Proof of Address",
      UTILITY_BILL: "Utility Bill",
      BANK_STATEMENT: "Bank Statement",
      SELFIE: "Selfie with ID",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">KYC Document Review</h1>
        <p className="text-gray-400">Review and approve client verification documents</p>
      </div>

      {clients.length === 0 ? (
        <div className="glassmorphic rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No pending KYC documents</p>
        </div>
      ) : (
        <div className="space-y-6">
          {clients.map((clientData) => (
            <div key={clientData.client.id} className="glassmorphic rounded-xl p-6">
              {/* Client Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-fizmo flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {clientData.client.firstName} {clientData.client.lastName}
                    </h3>
                    <p className="text-gray-400 text-sm">{clientData.client.user.email}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded font-semibold ${getStatusColor(clientData.client.user.kycStatus)}`}>
                  {clientData.client.user.kycStatus}
                </span>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                {clientData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between bg-fizmo-dark-800 rounded-lg p-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl">
                          {doc.status === "APPROVED" && <FaCheck className="text-green-500" />}
                          {doc.status === "REJECTED" && <FaTimes className="text-red-500" />}
                          {(doc.status === "PENDING" || doc.status === "UNDER_REVIEW") && (
                            <FaClock className="text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{getDocumentTypeLabel(doc.documentType)}</h4>
                          <p className="text-sm text-gray-400">
                            {doc.fileName} • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                          {doc.rejectionReason && (
                            <p className="text-sm text-red-500 mt-1">Rejected: {doc.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.status !== "APPROVED" && (
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="px-4 py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 flex items-center space-x-2"
                        >
                          <FaEye />
                          <span>Review</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glassmorphic rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Review {getDocumentTypeLabel(selectedDocument.documentType)}
              </h3>
              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setRejectionReason("");
                }}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Document Preview */}
            <div className="mb-6 bg-fizmo-dark-800 rounded-lg p-4">
              {selectedDocument.fileUrl.endsWith(".pdf") ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">PDF Preview</p>
                  <a
                    href={selectedDocument.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              ) : (
                <img
                  src={selectedDocument.fileUrl}
                  alt={selectedDocument.fileName}
                  className="w-full h-auto rounded-lg"
                />
              )}
            </div>

            {/* Document Info */}
            <div className="bg-fizmo-dark-800 rounded-lg p-4 mb-6">
              <p className="text-gray-400">
                <strong className="text-white">File Name:</strong> {selectedDocument.fileName}
              </p>
              <p className="text-gray-400 mt-2">
                <strong className="text-white">Uploaded:</strong>{" "}
                {new Date(selectedDocument.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-400 mt-2">
                <strong className="text-white">Current Status:</strong>{" "}
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(selectedDocument.status)}`}>
                  {selectedDocument.status}
                </span>
              </p>
            </div>

            {/* Rejection Reason Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Rejection Reason (Required if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fizmo-purple-500 resize-none"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleReview(selectedDocument.id, "APPROVED")}
                disabled={reviewing}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FaCheck />
                <span>{reviewing ? "Processing..." : "Approve"}</span>
              </button>
              <button
                onClick={() => handleReview(selectedDocument.id, "REJECTED")}
                disabled={reviewing}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FaTimes />
                <span>{reviewing ? "Processing..." : "Reject"}</span>
              </button>
              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setRejectionReason("");
                }}
                disabled={reviewing}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
