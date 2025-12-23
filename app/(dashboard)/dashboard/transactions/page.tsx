"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TransactionsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock transaction data
  const transactions = [
    {
      id: "1",
      txId: "TX-2024122100145",
      type: "DEPOSIT",
      method: "Credit Card",
      amount: 2500.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-12-21 10:42",
      fee: 50.0,
      reference: "****1234",
    },
    {
      id: "2",
      txId: "TX-2024122000140",
      type: "WITHDRAWAL",
      method: "Bank Transfer",
      amount: 300.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-12-20 16:45",
      fee: 25.0,
      reference: "****5678",
    },
    {
      id: "3",
      txId: "TX-2024121800132",
      type: "DEPOSIT",
      method: "Cryptocurrency",
      amount: 5000.0,
      currency: "BTC",
      status: "COMPLETED",
      date: "2024-12-18 09:15",
      fee: 50.0,
      reference: "bc1q...xyz",
    },
    {
      id: "4",
      txId: "TX-2024121500128",
      type: "INTERNAL_TRANSFER",
      method: "Internal",
      amount: 1000.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-12-15 14:30",
      fee: 0.0,
      reference: "MT5-100234 → MT5-100235",
    },
    {
      id: "5",
      txId: "TX-2024121200120",
      type: "DEPOSIT",
      method: "Credit Card",
      amount: 1500.0,
      currency: "USD",
      status: "COMPLETED",
      date: "2024-12-12 11:20",
      fee: 30.0,
      reference: "****1234",
    },
    {
      id: "6",
      txId: "TX-2024121000115",
      type: "WITHDRAWAL",
      method: "Cryptocurrency",
      amount: 750.0,
      currency: "BTC",
      status: "PENDING",
      date: "2024-12-10 08:45",
      fee: 15.0,
      reference: "bc1q...abc",
    },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilter !== "all" && tx.type !== selectedFilter) return false;
    if (searchTerm && !JSON.stringify(tx).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-gray-400">View all your deposits, withdrawals, and transfers</p>
        </div>
        <Button variant="outline">Export Statement</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-500">$9,000</p>
          <p className="text-gray-400 text-sm">3 transactions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-500">$1,050</p>
          <p className="text-gray-400 text-sm">2 transactions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Net Deposits</p>
          <p className="text-2xl font-bold text-white">$7,950</p>
          <p className="text-gray-400 text-sm">Lifetime</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">$750</p>
          <p className="text-gray-400 text-sm">1 transaction</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by TX ID or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </div>

      {/* Transaction Type Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "all"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => setSelectedFilter("DEPOSIT")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "DEPOSIT"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setSelectedFilter("WITHDRAWAL")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "WITHDRAWAL"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setSelectedFilter("INTERNAL_TRANSFER")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "INTERNAL_TRANSFER"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Transfers
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE/TIME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TX ID</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">FEE</th>
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
                  <td className="py-3 px-4 text-white text-sm">{tx.date}</td>
                  <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">{tx.txId}</td>
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
                  <td className="py-3 px-4 text-gray-400 text-sm">${tx.fee.toFixed(2)}</td>
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
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-fizmo-purple-500/20">
            <p className="text-gray-400 text-sm">Showing {filteredTransactions.length} transactions</p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
                Previous
              </button>
              <button className="px-3 py-1 bg-fizmo-purple-500 text-white rounded">1</button>
              <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p
                      className={`font-semibold ${
                        tx.type === "DEPOSIT"
                          ? "text-green-500"
                          : tx.type === "WITHDRAWAL"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {tx.type === "WITHDRAWAL" ? "-" : "+"}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">{tx.method}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">{tx.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Transaction Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Deposits</span>
                <span className="text-green-500 font-semibold">50%</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "50%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Withdrawals</span>
                <span className="text-red-500 font-semibold">33%</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Transfers</span>
                <span className="text-blue-500 font-semibold">17%</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "17%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-500 text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Transaction Processing Times</h4>
            <p className="text-gray-400 text-sm">
              Deposits via credit card are typically instant. Bank transfers may take 1-3 business days.
              Cryptocurrency deposits require 3-6 network confirmations. Withdrawals are processed within
              1-3 business days. All times are estimates and may vary based on payment method and network
              conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
