"use client";

import { useState, useEffect } from "react";

interface KYCDoc {
  id: string;
  documentType: string;
  status: string;
  fileUrl: string;
  createdAt: string;
  client: { firstName: string; lastName: string; clientId: string; user: { email: string } };
}

export default function PendingDocsPage() {
  const [docs, setDocs] = useState<KYCDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = () => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/kyc", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        // API returns { clients: [{ client, documents: [...] }] }
        const allDocs: KYCDoc[] = [];
        (d.clients || []).forEach((entry: any) => {
          (entry.documents || []).forEach((doc: any) => {
            if (doc.status === "PENDING" || doc.status === "UNDER_REVIEW") {
              allDocs.push({ ...doc, client: entry.client });
            }
          });
        });
        setDocs(allDocs);
        setLoading(false);
      });
  };

  useEffect(() => { fetchDocs(); }, []);

  const statusColor = (status: string) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-400";
    if (status === "UNDER_REVIEW") return "bg-blue-500/20 text-blue-400";
    return "bg-gray-500/20 text-gray-400";
  };

  const reviewDoc = async (documentId: string, status: string) => {
    const token = localStorage.getItem("fizmo_token");
    await fetch("/api/admin/kyc", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, status, rejectionReason: status === "REJECTED" ? "Rejected by admin" : undefined }),
    });
    fetchDocs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pending Documents</h1>
        <p className="text-gray-400">KYC documents awaiting review</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Client", "Email", "Document Type", "Status", "Submitted", "Actions"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-white">{d.client?.firstName} {d.client?.lastName}</td>
                    <td className="py-3 px-4 text-gray-400">{d.client?.user?.email}</td>
                    <td className="py-3 px-4 text-gray-300">{d.documentType.replace(/_/g, " ")}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${statusColor(d.status)}`}>{d.status}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {d.fileUrl && (
                          <a href={d.fileUrl} target="_blank" rel="noreferrer"
                            className="text-xs px-2 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded hover:bg-fizmo-purple-500/30">View</a>
                        )}
                        <button onClick={() => reviewDoc(d.id, "APPROVED")}
                          className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">Approve</button>
                        <button onClick={() => reviewDoc(d.id, "REJECTED")}
                          className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {docs.length === 0 && <div className="text-center py-8 text-gray-400">No pending documents</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {docs.length} pending documents</p>
    </div>
  );
}
