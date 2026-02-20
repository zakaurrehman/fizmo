"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminTransactionsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    const headers = ["TX ID", "Timestamp", "Client", "Account", "Type", "Method", "Amount", "Currency", "Status"];
    const rows = filteredTransactions.map((tx) => [
      tx.txId,
      new Date(tx.timestamp).toLocaleString(),
      tx.clientName,
      tx.accountId,
      tx.type,
      tx.method,
      tx.amount?.toFixed(2) || "0.00",
      tx.currency,
      tx.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReconcile() {
    const pending = transactions.filter((t) => t.status === "PENDING").length;
    alert(`Reconciliation check:\n- Total transactions: ${transactions.length}\n- Pending: ${pending}\n\nReview pending transactions on the deposits and withdrawals pages to reconcile.`);
  }

  function handleManualTransaction() {
    alert("Manual Transaction:\nUse the Deposits or Withdrawals pages to manually approve/reject transactions. Direct transaction creation requires API access at POST /api/admin/deposits or /api/admin/withdrawals.");
  }

  // Filter transactions based on selected tab and search
  const filteredTransactions = transactions.filter((tx) => {
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "deposits" && tx.type === "DEPOSIT") ||
      (selectedTab === "withdrawals" && tx.type === "WITHDRAWAL") ||
      (selectedTab === "internal" && tx.type === "INTERNAL_TRANSFER") ||
      (selectedTab === "commissions" && tx.type === "COMMISSION");

    const matchesSearch =
      searchTerm === "" ||
      tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.clientId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">Monitor and manage all financial transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleReconcile}>Reconcile</Button>
          <Button onClick={handleManualTransaction}>Manual Transaction</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : (stats.totalTransactions || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : `$${(stats.totalDeposits || 0).toLocaleString()}`}
          </p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-500">
            {loading ? "..." : `$${(stats.totalWithdrawals || 0).toLocaleString()}`}
          </p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">
            {loading ? "..." : (stats.pendingCount || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">Awaiting processing</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : (stats.completedCount || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by TX ID, Client ID, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Types</option>
            <option>Deposit</option>
            <option>Withdrawal</option>
            <option>Internal Transfer</option>
            <option>Commission</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Methods</option>
            <option>Credit Card</option>
            <option>Cryptocurrency</option>
            <option>Bank Transfer</option>
            <option>E-Wallet</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
          <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "all"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedTab("deposits")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "deposits"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setSelectedTab("withdrawals")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "withdrawals"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setSelectedTab("internal")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "internal"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Internal Transfers
          </button>
          <button
            onClick={() => setSelectedTab("commissions")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "commissions"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading transactions...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No transactions found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TX ID</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TIMESTAMP</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">
                      {tx.txId}
                    </td>
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">{tx.clientName}</p>
                      <p className="text-gray-400 text-xs">{tx.clientId}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs font-mono">
                      {tx.accountId}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tx.type === "DEPOSIT"
                            ? "bg-green-500/20 text-green-500"
                            : tx.type === "WITHDRAWAL"
                            ? "bg-red-500/20 text-red-500"
                            : tx.type === "INTERNAL_TRANSFER"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-purple-500/20 text-purple-500"
                        }`}
                      >
                        {tx.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{tx.method}</td>
                    <td className="py-3 px-4 text-sm">
                      <p
                        className={`font-semibold ${
                          tx.type === "DEPOSIT" || tx.type === "COMMISSION"
                            ? "text-green-500"
                            : tx.type === "WITHDRAWAL"
                            ? "text-red-500"
                            : "text-white"
                        }`}
                      >
                        {tx.type === "WITHDRAWAL" ? "-" : "+"}
                        {tx.currency} {tx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          tx.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-500"
                            : tx.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : tx.status === "PROCESSING"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-fizmo-purple-500/20">
            <p className="text-gray-400 text-sm">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Transaction Summary (All Time)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Deposits</p>
            <p className="text-2xl font-bold text-green-500">
              {transactions.filter((t) => t.type === "DEPOSIT").length}
            </p>
            <p className="text-gray-400 text-xs">transactions</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Withdrawals</p>
            <p className="text-2xl font-bold text-red-500">
              {transactions.filter((t) => t.type === "WITHDRAWAL").length}
            </p>
            <p className="text-gray-400 text-xs">transactions</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Transfers</p>
            <p className="text-2xl font-bold text-blue-500">
              {transactions.filter((t) => t.type === "INTERNAL_TRANSFER").length}
            </p>
            <p className="text-gray-400 text-xs">transactions</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Commissions</p>
            <p className="text-2xl font-bold text-purple-500">
              {transactions.filter((t) => t.type === "COMMISSION").length}
            </p>
            <p className="text-gray-400 text-xs">transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
