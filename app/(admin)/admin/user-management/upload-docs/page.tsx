"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
}

export default function UploadDocsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ clientId: "", documentType: "PASSPORT", fileUrl: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/clients", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClients(d.clients || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/kyc/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setMsg(res.ok ? "Document uploaded successfully." : d.error || "Failed to upload.");
    if (res.ok) setForm({ clientId: "", documentType: "PASSPORT", fileUrl: "" });
    setLoading(false);
  };

  const docTypes = ["PASSPORT", "NATIONAL_ID", "DRIVERS_LICENSE", "PROOF_OF_ADDRESS", "BANK_STATEMENT", "OTHER"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload User Documents</h1>
        <p className="text-gray-400">Upload KYC documents on behalf of a client</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Client</label>
            <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} required
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              <option value="">Select client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.clientId})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Document Type</label>
            <select value={form.documentType} onChange={e => setForm({ ...form, documentType: e.target.value })}
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              {docTypes.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">File URL</label>
            <input type="url" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} required
              placeholder="https://..." className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm" />
          </div>

          {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    </div>
  );
}
