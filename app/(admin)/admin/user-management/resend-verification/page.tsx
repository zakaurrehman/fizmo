"use client";

import { useState, useEffect } from "react";

interface UnverifiedUser {
  userId: string;
  clientId: string;
  email: string;
  firstName: string;
  lastName: string;
  registeredAt: string;
}

export default function ResendVerificationPage() {
  const [users, setUsers] = useState<UnverifiedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users/resend-verification", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setUsers(d.users || []); setLoading(false); });
  }, []);

  const sendVerification = async (userId: string) => {
    setSending(userId);
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/users/resend-verification", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const d = await res.json();
    setMsgs(prev => ({ ...prev, [userId]: res.ok ? "Email sent!" : d.error || "Failed" }));
    setSending(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resend Verification Mail</h1>
        <p className="text-gray-400">Resend email verification to unverified users</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Name", "Email", "Registered", "Action"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.userId} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-white">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-4 text-gray-400">{u.email}</td>
                    <td className="py-3 px-4 text-gray-400">{new Date(u.registeredAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => sendVerification(u.userId)} disabled={sending === u.userId}
                          className="text-xs px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded hover:bg-fizmo-purple-500/30 disabled:opacity-50">
                          {sending === u.userId ? "Sending..." : "Resend Email"}
                        </button>
                        {msgs[u.userId] && <span className={`text-xs ${msgs[u.userId] === "Email sent!" ? "text-green-400" : "text-red-400"}`}>{msgs[u.userId]}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-8 text-gray-400">All users are verified</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {users.length} unverified users</p>
    </div>
  );
}
