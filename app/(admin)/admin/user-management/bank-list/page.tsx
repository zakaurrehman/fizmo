"use client";

import { useState, useEffect } from "react";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  swiftCode: string | null;
  iban: string | null;
  country: string | null;
  currency: string;
  isVerified: boolean;
  client: { firstName: string; lastName: string; clientId: string };
}

export default function BankListPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/bank-accounts", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setAccounts(d.bankAccounts || []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bank Details List</h1>
        <p className="text-gray-400">All client bank accounts</p>
      </div>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Client", "Bank Name", "Account Holder", "Account No.", "SWIFT", "Country", "Currency", "Verified"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-white">{a.client?.firstName} {a.client?.lastName}</td>
                    <td className="py-3 px-4 text-gray-300">{a.bankName}</td>
                    <td className="py-3 px-4 text-gray-400">{a.accountHolderName}</td>
                    <td className="py-3 px-4 font-mono text-xs text-gray-400">{a.accountNumber}</td>
                    <td className="py-3 px-4 text-gray-400">{a.swiftCode || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">{a.country || "-"}</td>
                    <td className="py-3 px-4 text-gray-400">{a.currency}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${a.isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                        {a.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {accounts.length === 0 && <div className="text-center py-8 text-gray-400">No bank accounts found</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {accounts.length} bank accounts</p>
    </div>
  );
}
