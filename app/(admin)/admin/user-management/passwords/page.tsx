"use client";

import { useState, useEffect } from "react";

interface UserRow {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  user: { id: string; email: string; emailVerified: boolean };
}

export default function PasswordsPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false); });
  }, []);

  const sendReset = async (clientId: string, userId: string) => {
    setSending(clientId);
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/users/reset-password", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const d = await res.json();
    setMsgs(prev => ({ ...prev, [clientId]: res.ok ? "Reset email sent!" : d.error || "Failed" }));
    setSending(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Password List</h1>
        <p className="text-gray-400">Send password reset emails to users</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Name", "Email", "Verified", "Action"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-white">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-4 text-gray-400">{u.user?.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${u.user?.emailVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {u.user?.emailVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => sendReset(u.id, u.user?.id)} disabled={sending === u.id}
                          className="text-xs px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded hover:bg-fizmo-purple-500/30 disabled:opacity-50">
                          {sending === u.id ? "Sending..." : "Send Reset"}
                        </button>
                        {msgs[u.id] && <span className={`text-xs ${msgs[u.id].includes("sent") ? "text-green-400" : "text-red-400"}`}>{msgs[u.id]}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-8 text-gray-400">No users found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
