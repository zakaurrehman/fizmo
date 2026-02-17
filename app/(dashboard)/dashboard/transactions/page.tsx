"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Input } from "@/components/ui/Input";

interface Transaction {
  id: string;
  type: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  reference: string;
}

interface Summary {
  totalDeposits: number;
  depositCount: number;
  totalWithdrawals: number;
  withdrawalCount: number;
  pendingAmount: number;
  pendingCount: number;
}

export default function TransactionsPage() {
  const { token } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data.transactions);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilter !== "all" && tx.type !== selectedFilter) return false;
    if (searchTerm && !JSON.stringify(tx).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const netDeposits = (summary?.totalDeposits || 0) - (summary?.totalWithdrawals || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fizmo-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
        <p className="text-gray-400">View all your deposits, withdrawals, and transfers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-500">${summary?.totalDeposits?.toLocaleString() || "0"}</p>
          <p className="text-gray-400 text-sm">{summary?.depositCount || 0} transactions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-500">${summary?.totalWithdrawals?.toLocaleString() || "0"}</p>
          <p className="text-gray-400 text-sm">{summary?.withdrawalCount || 0} transactions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Net Deposits</p>
          <p className="text-2xl font-bold text-white">${netDeposits.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">Lifetime</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">${summary?.pendingAmount?.toLocaleString() || "0"}</p>
          <p className="text-gray-400 text-sm">{summary?.pendingCount || 0} transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Transaction Type Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Transactions" },
            { key: "DEPOSIT", label: "Deposits" },
            { key: "WITHDRAWAL", label: "Withdrawals" },
            { key: "INTERNAL_TRANSFER", label: "Transfers" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFilter === tab.key
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE/TIME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">REFERENCE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                >
                  <td className="py-3 px-4 text-white text-sm">
                    {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        tx.type === "DEPOSIT"
                          ? "bg-green-500/20 text-green-500"
                          : tx.type === "WITHDRAWAL"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {tx.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{tx.method}</td>
                  <td className="py-3 px-4 text-sm">
                    <p
                      className={`font-semibold ${
                        tx.type === "DEPOSIT"
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
                  <td className="py-3 px-4 text-gray-400 text-sm font-mono">{tx.reference}</td>
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
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No transactions found</p>
            <p className="text-gray-500 text-sm mt-2">
              {transactions.length === 0
                ? "Make a deposit to get started"
                : "Try adjusting your filters"}
            </p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-fizmo-purple-500/20">
            <p className="text-gray-400 text-sm">Showing {filteredTransactions.length} transactions</p>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-500 font-bold">i</span>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Transaction Processing Times</h4>
            <p className="text-gray-400 text-sm">
              Deposits via credit card are typically instant. Bank transfers may take 1-3 business days.
              Cryptocurrency deposits require 3-6 network confirmations. Withdrawals are processed within
              1-3 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
