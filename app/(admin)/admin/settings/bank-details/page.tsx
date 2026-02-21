"use client";

import { useState, useEffect } from "react";

export default function DepositBankDetailsPage() {
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/bank-accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setBankAccounts(data.bankAccounts || []);
        }
      } catch (error) {
        console.error("Failed to fetch bank accounts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBankAccounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Bank Details</h1>
        <p className="text-gray-400">View and manage deposit bank account details</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading bank accounts...</div>
          ) : bankAccounts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No bank accounts found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">BANK NAME</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT HOLDER</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT NUMBER</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CURRENCY</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.map((account: any) => (
                  <tr
                    key={account.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm font-medium">{account.bankName}</td>
                    <td className="py-3 px-4 text-white text-sm">{account.accountHolderName}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm font-mono">{account.accountNumber}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{account.currency}</td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white text-sm">
                        {account.client?.firstName} {account.client?.lastName}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
