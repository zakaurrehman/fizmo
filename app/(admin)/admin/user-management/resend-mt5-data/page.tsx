"use client";

import { useState, useEffect } from "react";

interface ClientWithAccounts {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  user: { email: string };
  accounts: { accountId: string; mt5Login: number | null; leverage: number }[];
}

export default function ResendMT5DataPage() {
  const [clients, setClients] = useState<ClientWithAccounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientWithAccounts | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users/resend-mt5-data", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setClients(d.clients || []); setLoading(false); });
  }, []);

  const handleClientChange = (clientId: string) => {
    const c = clients.find(cl => cl.id === clientId) || null;
    setSelectedClient(c);
    setSelectedAccount(c?.accounts[0]?.accountId || "");
    setMsg("");
  };

  const handleSend = async () => {
    if (!selectedClient || !selectedAccount) return;
    setSending(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/users/resend-mt5-data", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: selectedClient.id, accountId: selectedAccount }),
    });
    const d = await res.json();
    setMsg(res.ok ? "MT5 data email sent successfully." : d.error || "Failed to send email.");
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resend MT5 Data Mail</h1>
        <p className="text-gray-400">Resend MT5 account credentials to a client</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-md">
        {loading ? <div className="text-gray-400 text-sm">Loading clients...</div> : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Select Client</label>
              <select onChange={e => handleClientChange(e.target.value)} defaultValue=""
                className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Select client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.user?.email}</option>
                ))}
              </select>
            </div>

            {selectedClient && (
              <>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Select Account</label>
                  <select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}
                    className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
                    {selectedClient.accounts.map(a => (
                      <option key={a.accountId} value={a.accountId}>
                        {a.accountId} {a.mt5Login ? `(MT5: ${a.mt5Login})` : ""} — 1:{a.leverage}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-fizmo-dark-700 rounded-lg p-3 text-sm text-gray-400">
                  <p>Email will be sent to: <span className="text-white">{selectedClient.user?.email}</span></p>
                </div>

                {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

                <button onClick={handleSend} disabled={sending || !selectedAccount}
                  className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
                  {sending ? "Sending..." : "Send MT5 Data Email"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
