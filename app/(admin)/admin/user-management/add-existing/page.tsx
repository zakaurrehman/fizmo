"use client";

import { useState } from "react";

export default function AddExistingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/users/add-existing", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await res.json();
    setMsg(res.ok ? `Client added successfully. Client ID: ${d.clientId}` : d.error || "Failed.");
    if (res.ok) setEmail("");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add Existing Client</h1>
        <p className="text-gray-400">Link an existing platform user to this broker</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-md">
        <p className="text-gray-400 text-sm mb-4">
          If a user already has an account on the platform (registered under another broker),
          you can link them to your broker by entering their email address.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">User Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="user@example.com" className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm" />
          </div>

          {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Adding..." : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
}
