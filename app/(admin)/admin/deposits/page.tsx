"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminDepositsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/deposits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDeposits(data.deposits || []);
      }
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(depositId: string) {
    if (!confirm("Approve this deposit and credit the account balance?")) return;

    setProcessing(depositId);
    try {
      const response = await fetch("/api/admin/deposits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("fizmo_token")}` },
        body: JSON.stringify({ depositId, status: "COMPLETED" }),
      });

      if (response.ok) {
        alert("Deposit approved successfully!");
        await fetchDeposits();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to approve deposit");
      }
    } catch (error) {
      console.error("Failed to approve deposit:", error);
      alert("Failed to approve deposit");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(depositId: string) {
    if (!confirm("Reject this deposit? This cannot be undone.")) return;

    setProcessing(depositId);
    try {
      const response = await fetch("/api/admin/deposits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("fizmo_token")}` },
        body: JSON.stringify({ depositId, status: "REJECTED" }),
      });

      if (response.ok) {
        alert("Deposit rejected successfully!");
        await fetchDeposits();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject deposit");
      }
    } catch (error) {
      console.error("Failed to reject deposit:", error);
      alert("Failed to reject deposit");
    } finally {
      setProcessing(null);
    }
  }

  function handleExportCSV() {
    const headers = ["Date", "Client", "Email", "Account", "Amount", "Method", "Status"];
    const rows = filteredDeposits.map((d) => [
      new Date(d.createdAt).toLocaleString(),
      `${d.account?.client?.firstName || ""} ${d.account?.client?.lastName || ""}`.trim(),
      d.account?.client?.user?.email || "",
      d.account?.accountId || "",
      d.amount?.toFixed(2) || "0.00",
      d.paymentMethod || "",
      d.status || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deposits-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReconcile() {
    const pending = deposits.filter((d) => d.status === "PENDING").length;
    alert(`Reconciliation check:\n- ${pending} pending deposit(s) require review.\n- Use Approve/Reject buttons on each deposit to reconcile.`);
  }

  function handleManualDeposit() {
    alert("Manual Deposit:\nTo create a manual deposit, approve a pending deposit or use the API directly at POST /api/admin/deposits with the required parameters.");
  }

  // Filter deposits based on selected tab
  const filteredDeposits = deposits.filter((deposit) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return deposit.status === "PENDING";
    if (selectedTab === "completed") return deposit.status === "COMPLETED";
    if (selectedTab === "rejected") return deposit.status === "REJECTED";
    return true;
  });

  // Calculate stats
  const stats = {
    pending: deposits.filter((d) => d.status === "PENDING").reduce((sum, d) => sum + d.amount, 0),
    pendingCount: deposits.filter((d) => d.status === "PENDING").length,
    completed: deposits
      .filter((d) => d.status === "COMPLETED" && new Date(d.createdAt) > new Date(Date.now() - 86400000))
      .reduce((sum, d) => sum + d.amount, 0),
    rejected: deposits.filter((d) => d.status === "REJECTED").reduce((sum, d) => sum + d.amount, 0),
    rejectedCount: deposits.filter((d) => d.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Deposits Management</h1>
          <p className="text-gray-400">Monitor and manage all client deposits</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleManualDeposit}>Manual Deposit</Button>
          <Button onClick={handleReconcile}>Reconcile</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Deposits (24h)</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "Loading..." : `$${stats.completed.toLocaleString()}`}
          </p>
          <p className="text-green-500 text-sm">Completed today</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {loading ? "Loading..." : `$${stats.pending.toLocaleString()}`}
          </p>
          <p className="text-gray-400 text-sm">{stats.pendingCount} transactions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "Loading..." : deposits.filter((d) => d.status === "COMPLETED").length}
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
              All ({deposits.length})
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
              Completed ({deposits.filter((d) => d.status === "COMPLETED").length})
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
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading deposits...</div>
          ) : filteredDeposits.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No deposits found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE/TIME</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((deposit: any) => (
                  <tr
                    key={deposit.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">
                        {deposit.account?.client?.firstName} {deposit.account?.client?.lastName}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {deposit.account?.client?.user?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-mono">{deposit.account?.accountId}</p>
                      <p className="text-gray-400 text-xs">{deposit.account?.accountType}</p>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      ${deposit.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{deposit.paymentMethod}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          deposit.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-500"
                            : deposit.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {deposit.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {deposit.status === "PENDING" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(deposit.id)}
                            disabled={processing === deposit.id}
                            className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 text-xs disabled:opacity-50"
                          >
                            {processing === deposit.id ? "..." : "Approve"}
                          </button>
                          <button
                            onClick={() => handleReject(deposit.id)}
                            disabled={processing === deposit.id}
                            className="px-3 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 text-xs disabled:opacity-50"
                          >
                            {processing === deposit.id ? "..." : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {deposit.status === "COMPLETED" ? "Approved" : "Rejected"}
                        </span>
                      )}
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
