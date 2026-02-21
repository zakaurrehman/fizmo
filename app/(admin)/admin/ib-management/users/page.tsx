"use client";

import { useState, useEffect } from "react";

export default function IBUsersPage() {
  const [ibs, setIbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIBs() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/ib", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setIbs(data.ibs || []);
        }
      } catch (error) {
        console.error("Failed to fetch IB users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIBs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">IB Users</h1>
        <p className="text-gray-400">View and manage all Introducing Broker partners</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading IB users...</div>
          ) : ibs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No IB partners found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">NAME</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">EMAIL</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">COMMISSION RATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TOTAL COMMISSION</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {ibs.map((ib: any) => (
                  <tr
                    key={ib.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm font-medium">
                      {ib.name}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{ib.email}</td>
                    <td className="py-3 px-4 text-white text-sm">{ib.commissionRate}%</td>
                    <td className="py-3 px-4 text-green-500 text-sm font-semibold">
                      ${(ib.totalCommission || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ib.status === "ACTIVE"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {ib.status}
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
