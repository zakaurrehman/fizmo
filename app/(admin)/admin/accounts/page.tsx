"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminAccountsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    const headers = ["Account ID", "Client", "Email", "Type", "Balance", "Equity", "Currency", "Leverage", "KYC", "Status"];
    const rows = filteredAccounts.map((a) => [
      a.accountId,
      a.clientName,
      a.clientEmail,
      a.accountType,
      a.balance?.toFixed(2) || "0.00",
      a.equity?.toFixed(2) || "0.00",
      a.currency,
      a.leverage,
      a.kycStatus,
      a.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleBulkActions() {
    alert(`Bulk Actions:\n- ${filteredAccounts.length} account(s) currently visible.\n\nSelect individual accounts to apply bulk operations (suspend, activate, export). Full bulk selection coming soon.`);
  }

  // Filter accounts based on selected tab and search
  const filteredAccounts = accounts.filter((account) => {
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "live" && account.accountType === "LIVE") ||
      (selectedTab === "demo" && account.accountType === "DEMO") ||
      (selectedTab === "active" && account.status === "ACTIVE") ||
      (selectedTab === "suspended" && account.status === "SUSPENDED");

    const matchesSearch =
      searchTerm === "" ||
      account.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Accounts Management</h1>
          <p className="text-gray-400">Manage and monitor all trading accounts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleBulkActions}>Bulk Actions</Button>
          <Button onClick={() => router.push("/admin/clients")}>+ Create Account</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Accounts</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : (stats.totalAccounts || 0).toLocaleString()}
          </p>
          <p className="text-green-500 text-sm">All accounts</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Live Accounts</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : (stats.liveAccounts || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">
            {!loading && stats.totalAccounts
              ? ((stats.liveAccounts / stats.totalAccounts) * 100).toFixed(1)
              : "0"}
            %
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Demo Accounts</p>
          <p className="text-2xl font-bold text-blue-500">
            {loading ? "..." : (stats.demoAccounts || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">
            {!loading && stats.totalAccounts
              ? ((stats.demoAccounts / stats.totalAccounts) * 100).toFixed(1)
              : "0"}
            %
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : `$${((stats.totalBalance || 0) / 1000000).toFixed(1)}M`}
          </p>
          <p className="text-green-500 text-sm">All accounts</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Equity</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : `$${((stats.totalEquity || 0) / 1000000).toFixed(1)}M`}
          </p>
          <p className="text-green-500 text-sm">All accounts</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : (stats.activeAccounts || 0).toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">
            {!loading && stats.totalAccounts
              ? ((stats.activeAccounts / stats.totalAccounts) * 100).toFixed(1)
              : "0"}
            %
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by Account ID, Client ID, or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Platforms</option>
            <option>MT4</option>
            <option>MT5</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Closed</option>
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
            All Accounts
          </button>
          <button
            onClick={() => setSelectedTab("live")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "live"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setSelectedTab("demo")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "demo"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Demo
          </button>
          <button
            onClick={() => setSelectedTab("suspended")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "suspended"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Suspended
          </button>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading accounts...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No accounts found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACCOUNT ID</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">BALANCE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">EQUITY</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">LEVERAGE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">KYC STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">
                      {account.accountId}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">{account.clientName}</p>
                      <p className="text-gray-400 text-xs">{account.clientEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          account.accountType === "LIVE"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {account.accountType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      {account.currency} {account.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <p
                        className={`font-semibold ${
                          account.equity >= account.balance
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {account.currency} {account.equity.toLocaleString()}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-white text-sm">1:{account.leverage}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          account.kycStatus === "APPROVED"
                            ? "bg-green-500/20 text-green-500"
                            : account.kycStatus === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {account.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          account.status === "ACTIVE"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/clients/${account.clientId}`)}
                          className="text-fizmo-purple-400 hover:text-fizmo-purple-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredAccounts.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-fizmo-purple-500/20">
            <p className="text-gray-400 text-sm">
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </p>
          </div>
        )}
      </div>

      {/* Account Breakdown */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Account Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Live Accounts</p>
            <p className="text-2xl font-bold text-green-500">{stats.liveAccounts || 0}</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Demo Accounts</p>
            <p className="text-2xl font-bold text-blue-500">{stats.demoAccounts || 0}</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-2xl font-bold text-white">{stats.activeAccounts || 0}</p>
          </div>
          <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Suspended</p>
            <p className="text-2xl font-bold text-red-500">
              {(stats.totalAccounts || 0) - (stats.activeAccounts || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
