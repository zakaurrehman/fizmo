"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminWithdrawalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  async function fetchWithdrawals() {
    try {
      const response = await fetch("/api/admin/withdrawals");
      if (response.ok) {
        const data = await response.json();
        setWithdrawals(data.withdrawals || []);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(withdrawalId: string) {
    if (!confirm("Approve this withdrawal and complete the payment?")) return;

    setProcessing(withdrawalId);
    try {
      const response = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, status: "COMPLETED" }),
      });

      if (response.ok) {
        alert("Withdrawal approved successfully!");
        await fetchWithdrawals();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to approve withdrawal");
      }
    } catch (error) {
      console.error("Failed to approve withdrawal:", error);
      alert("Failed to approve withdrawal");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(withdrawalId: string) {
    if (!confirm("Reject this withdrawal? Funds will be returned to the account.")) return;

    setProcessing(withdrawalId);
    try {
      const response = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId, status: "REJECTED" }),
      });

      if (response.ok) {
        alert("Withdrawal rejected. Funds returned to account.");
        await fetchWithdrawals();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject withdrawal");
      }
    } catch (error) {
      console.error("Failed to reject withdrawal:", error);
      alert("Failed to reject withdrawal");
    } finally {
      setProcessing(null);
    }
  }

  // Filter withdrawals based on selected tab
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return withdrawal.status === "PENDING";
    if (selectedTab === "completed") return withdrawal.status === "COMPLETED";
    if (selectedTab === "rejected") return withdrawal.status === "REJECTED";
    return true;
  });

  // Calculate stats
  const stats = {
    pending: withdrawals.filter((w) => w.status === "PENDING").reduce((sum, w) => sum + w.amount, 0),
    pendingCount: withdrawals.filter((w) => w.status === "PENDING").length,
    completed: withdrawals
      .filter((w) => w.status === "COMPLETED" && new Date(w.createdAt) > new Date(Date.now() - 86400000))
      .reduce((sum, w) => sum + w.amount, 0),
    completedCount: withdrawals
      .filter((w) => w.status === "COMPLETED" && new Date(w.createdAt) > new Date(Date.now() - 86400000))
      .length,
    rejected: withdrawals.filter((w) => w.status === "REJECTED").reduce((sum, w) => sum + w.amount, 0),
    rejectedCount: withdrawals.filter((w) => w.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Withdrawals Management</h1>
          <p className="text-gray-400">Review and process client withdrawal requests</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Manual Withdrawal</Button>
          <Button>Batch Process</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Withdrawals (24h)</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "Loading..." : `$${stats.completed.toLocaleString()}`}
          </p>
          <p className="text-green-500 text-sm">{stats.completedCount} completed today</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-500">
            {loading ? "Loading..." : `$${stats.pending.toLocaleString()}`}
          </p>
          <p className="text-gray-400 text-sm">{stats.pendingCount} requests</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "Loading..." : withdrawals.filter((w) => w.status === "COMPLETED").length}
          </p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-500">
            {loading ? "Loading..." : `$${stats.rejected.toLocaleString()}`}
          </p>
          <p className="text-gray-400 text-sm">{stats.rejectedCount} transactions</p>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "all"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              All ({withdrawals.length})
            </button>
            <button
              onClick={() => setSelectedTab("pending")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "pending"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Pending ({stats.pendingCount})
            </button>
            <button
              onClick={() => setSelectedTab("completed")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "completed"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Completed ({withdrawals.filter((w) => w.status === "COMPLETED").length})
            </button>
            <button
              onClick={() => setSelectedTab("rejected")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "rejected"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Rejected ({stats.rejectedCount})
            </button>
          </div>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading withdrawals...</div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No withdrawals found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">REQUESTED</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DETAILS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((withdrawal: any) => (
                  <tr
                    key={withdrawal.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(withdrawal.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">
                        {withdrawal.account?.client?.firstName} {withdrawal.account?.client?.lastName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {withdrawal.account?.client?.user?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-mono">{withdrawal.account?.accountId}</p>
                      <p className="text-gray-400 text-xs">{withdrawal.account?.accountType}</p>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      ${withdrawal.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{withdrawal.paymentMethod}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm font-mono text-xs">
                      {withdrawal.paymentDetails ? withdrawal.paymentDetails.substring(0, 20) + "..." : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          withdrawal.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-500"
                            : withdrawal.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {withdrawal.status === "PENDING" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(withdrawal.id)}
                            disabled={processing === withdrawal.id}
                            className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 text-xs disabled:opacity-50"
                          >
                            {processing === withdrawal.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(withdrawal.id)}
                            disabled={processing === withdrawal.id}
                            className="px-3 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 text-xs disabled:opacity-50"
                          >
                            {processing === withdrawal.id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {withdrawal.status === "COMPLETED" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-500 text-sm">
            ⚠️ <strong>Important:</strong> Always verify client identity and withdrawal details
            before approving. Check for AML flags and ensure compliance with regulatory
            requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
