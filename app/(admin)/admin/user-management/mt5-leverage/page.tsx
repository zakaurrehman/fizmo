"use client";

import { useState, useEffect } from "react";

interface Account {
  id: string;
  accountId: string;
  accountType: string;
  leverage: number;
  currency: string;
  clientName: string;
}

export default function MT5LeveragePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ accountId: "", leverage: "100" });
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
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/accounts", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ accountId: form.accountId, leverage: parseInt(form.leverage) }),
    });
    const d = await res.json();
    setMsg(res.ok ? `Leverage updated to 1:${d.account?.leverage}.` : d.error || "Failed.");
    if (res.ok) {
      setAccounts(prev => prev.map(a => a.id === form.accountId ? { ...a, leverage: parseInt(form.leverage) } : a));
    }
    setLoading(false);
  };

  const leverageOptions = [50, 100, 200, 500, 1000];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Update MT5 Leverage</h1>
        <p className="text-gray-400">Change the leverage on a trading account</p>
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
                  {a.accountId} — {a.clientName} (1:{a.leverage})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">New Leverage</label>
            <select value={form.leverage} onChange={e => setForm({ ...form, leverage: e.target.value })}
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              {leverageOptions.map(l => <option key={l} value={l}>1:{l}</option>)}
            </select>
          </div>

          {msg && <p className={`text-sm ${msg.includes("updated") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Updating..." : "Update Leverage"}
          </button>
        </form>
      </div>
    </div>
  );
}
