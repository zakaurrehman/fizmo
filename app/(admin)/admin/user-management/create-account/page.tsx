"use client";

import { useState, useEffect } from "react";

interface Client { id: string; clientId: string; firstName: string; lastName: string; }

export default function CreateAccountPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({ clientId: "", accountType: "LIVE", currency: "USD", leverage: "100", mt5Login: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setClients(d.users || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clientId: form.clientId, accountType: form.accountType, currency: form.currency, leverage: parseInt(form.leverage), ...(form.mt5Login ? { mt5Login: parseInt(form.mt5Login) } : {}) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Account created! ID: ${data.account?.accountId || ""}` });
        setForm(f => ({ ...f, clientId: "" }));
      } else {
        setMessage({ type: "error", text: data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to create account") });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create MT5 Account</h1>
        <p className="text-gray-400">Create a trading account for a client</p>
      </div>
      <div className="glassmorphic rounded-xl p-6 max-w-2xl">
        {message && (
          <div className={`mb-4 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Select Client *</label>
            <select required value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500">
              <option value="">-- Select a client --</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.clientId})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Type</label>
              <select value={form.accountType} onChange={e => setForm(f => ({ ...f, accountType: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500">
                <option value="LIVE">LIVE</option>
                <option value="DEMO">DEMO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">MT5 Login (optional)</label>
            <input type="number" placeholder="e.g. 10048" value={form.mt5Login} onChange={e => setForm(f => ({ ...f, mt5Login: e.target.value }))}
              className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Leverage</label>
            <select value={form.leverage} onChange={e => setForm(f => ({ ...f, leverage: e.target.value }))}
              className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500">
              {[50, 100, 200, 300, 400, 500].map(l => (
                <option key={l} value={l}>1:{l}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-fizmo-purple-500 hover:bg-fizmo-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-all">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
