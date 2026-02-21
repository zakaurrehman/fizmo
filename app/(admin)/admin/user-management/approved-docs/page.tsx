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

export default function ApprovedDocsPage() {
  const [docs, setDocs] = useState<KYCDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/kyc?status=APPROVED", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        // API returns { clients: [{ client, documents: [...] }] }
        const allDocs: KYCDoc[] = [];
        (d.clients || []).forEach((entry: any) => {
          (entry.documents || []).forEach((doc: any) => {
            allDocs.push({ ...doc, client: entry.client });
          });
        });
        setDocs(allDocs);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Approved Documents</h1>
        <p className="text-gray-400">KYC documents that have been approved</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Client", "Client ID", "Email", "Document Type", "Approved On"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-white">{d.client?.firstName} {d.client?.lastName}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">{d.client?.clientId}</td>
                    <td className="py-3 px-4 text-gray-400">{d.client?.user?.email}</td>
                    <td className="py-3 px-4 text-gray-300">{d.documentType.replace(/_/g, " ")}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {docs.length === 0 && <div className="text-center py-8 text-gray-400">No approved documents</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {docs.length} approved documents</p>
    </div>
  );
}
