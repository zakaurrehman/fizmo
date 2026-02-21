"use client";

import { useState, useEffect } from "react";

export default function PendingWithdrawPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWithdrawals() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/withdrawals?status=PENDING", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setWithdrawals(data.withdrawals || []);
        }
      } catch (error) {
        console.error("Failed to fetch pending withdrawals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWithdrawals();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pending Withdrawals</h1>
        <p className="text-gray-400">Withdrawals awaiting approval</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading pending withdrawals...</div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No pending withdrawals found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CURRENCY</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal: any) => (
                  <tr
                    key={withdrawal.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">
                        {withdrawal.client?.firstName} {withdrawal.client?.lastName}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      {(withdrawal.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{withdrawal.currency}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-500">
                        {withdrawal.status}
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
