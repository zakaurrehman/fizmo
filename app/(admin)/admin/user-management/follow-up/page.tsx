"use client";

import { useState, useEffect } from "react";

interface FollowUpClient {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  registeredAt: string;
  reason: string;
}

export default function FollowUpPage() {
  const [clients, setClients] = useState<FollowUpClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users/follow-up", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setClients(d.clients || []); setLoading(false); });
  }, []);

  const reasonColor = (reason: string) => {
    if (reason === "No Account") return "bg-orange-500/20 text-orange-400";
    if (reason === "No Deposit") return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Follow Up List</h1>
        <p className="text-gray-400">Clients requiring follow-up action</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Client ID", "Name", "Email", "Phone", "Country", "Registered", "Reason"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">{c.clientId}</td>
                    <td className="py-3 px-4 text-white">{c.firstName} {c.lastName}</td>
                    <td className="py-3 px-4 text-gray-400">{c.email}</td>
                    <td className="py-3 px-4 text-gray-400">{c.phone || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">{c.country || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(c.registeredAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${reasonColor(c.reason)}`}>{c.reason}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && <div className="text-center py-8 text-gray-400">No follow-up clients found</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {clients.length} clients need follow-up</p>
    </div>
  );
}
