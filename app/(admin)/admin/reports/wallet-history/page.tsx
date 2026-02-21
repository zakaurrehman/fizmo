"use client";

import { useState, useEffect } from "react";

export default function WalletHistoryReportPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch wallet history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wallet History Report</h1>
        <p className="text-gray-400">Full wallet transaction history for all accounts</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading wallet history...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No wallet history found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CURRENCY</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DESCRIPTION</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr
                    key={tx.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      {(tx.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{tx.currency}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{tx.description}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tx.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-500"
                            : tx.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {tx.status}
                      </span>
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
