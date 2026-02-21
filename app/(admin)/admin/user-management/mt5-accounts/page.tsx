"use client";

import { useState, useEffect } from "react";

interface Account {
  id: string; accountId: string; accountType: string; currency: string;
  balance: number; equity: number; leverage: number; status: string;
  mt4Login: number | null; mt5Login: number | null;
  clientName: string; clientEmail: string;
}

export default function MT5AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/accounts", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setAccounts(d.accounts || []); setLoading(false); });
  }, []);

  const filtered = accounts.filter(a => tab === "all" || a.accountType === tab.toUpperCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">MT5 User List</h1>
        <p className="text-gray-400">All trading accounts</p>
      </div>

      <div className="flex gap-2">
        {["all", "live", "demo"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? "bg-fizmo-purple-500 text-white" : "bg-fizmo-dark-800 text-gray-400 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Account ID", "Client", "Type", "MT5 Login", "Currency", "Balance", "Leverage", "Status"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">{a.accountId}</td>
                    <td className="py-3 px-4 text-white">{a.clientName}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${a.accountType === "LIVE" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>{a.accountType}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{a.mt5Login || a.mt4Login || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">{a.currency}</td>
                    <td className="py-3 px-4 text-white font-semibold">${Number(a.balance).toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-400">1:{a.leverage}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${a.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-8 text-gray-400">No accounts found</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {filtered.length} accounts</p>
    </div>
  );
}
