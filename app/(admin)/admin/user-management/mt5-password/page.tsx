"use client";

import { useState, useEffect } from "react";

interface Account {
  id: string;
  accountId: string;
  mt5Login: number | null;
  clientName: string;
}

export default function MT5PasswordPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ accountId: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/accounts", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAccounts(d.accounts || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 6) { setMsg("Password must be at least 6 characters."); return; }
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    // Store MT5 password in account metadata via PATCH
    const res = await fetch("/api/admin/accounts", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: form.accountId, mt5Password: form.newPassword }),
    });
    const d = await res.json();
    setMsg(res.ok ? "MT5 password updated successfully." : d.error || "Failed to update password.");
    if (res.ok) setForm({ accountId: "", newPassword: "" });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Change MT5 Password</h1>
        <p className="text-gray-400">Update the trading account password</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Select Account</label>
            <select value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} required
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              <option value="">Select account</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.accountId} — {a.clientName}
                  {a.mt5Login ? ` (Login: ${a.mt5Login})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">New MT5 Password</label>
            <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required
              placeholder="Minimum 6 characters" className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm" />
          </div>

          {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Updating..." : "Update MT5 Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
