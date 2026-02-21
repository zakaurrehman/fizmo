"use client";

import { useState, useEffect } from "react";

interface Client {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
}

export default function AddBankPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    clientId: "", bankName: "", accountHolderName: "", accountNumber: "",
    routingNumber: "", swiftCode: "", iban: "", country: "", currency: "USD",
  });
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
    const res = await fetch("/api/admin/bank-accounts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setMsg(res.ok ? "Bank account added successfully." : d.error || "Failed to add bank account.");
    if (res.ok) setForm({ clientId: "", bankName: "", accountHolderName: "", accountNumber: "", routingNumber: "", swiftCode: "", iban: "", country: "", currency: "USD" });
    setLoading(false);
  };

  const field = (label: string, key: keyof typeof form, placeholder = "") => (
    <div>
      <label className="block text-gray-400 text-sm mb-1">{label}</label>
      <input type="text" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
        className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add Bank Details</h1>
        <p className="text-gray-400">Add bank account details for a client</p>
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

          {field("Bank Name", "bankName", "e.g. HSBC")}
          {field("Account Holder Name", "accountHolderName")}
          {field("Account Number", "accountNumber")}
          {field("Routing Number", "routingNumber")}
          {field("SWIFT / BIC Code", "swiftCode")}
          {field("IBAN", "iban")}
          {field("Country", "country")}

          <div>
            <label className="block text-gray-400 text-sm mb-1">Currency</label>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              {["USD", "EUR", "GBP", "AED", "PKR"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Saving..." : "Add Bank Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
