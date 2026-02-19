"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { AreaChart } from "@/components/charts/AreaChart";
import { ForexPrices } from "@/components/dashboard/ForexPrices";
import { FaDollarSign, FaArrowDown, FaChartBar, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fizmo_token");
    router.push("/login");
  };

  // Real portfolio performance data from API (6-month cumulative deposits)
  const portfolioData = stats?.portfolioHistory?.length > 0
    ? stats.portfolioHistory
    : [{ name: "—", value: 0 }];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Welcome back, {user?.client?.firstName || user?.email}!
            </h1>
            {stats?.broker && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-semibold border border-purple-500/30">
                {stats.broker.name}
              </span>
            )}
          </div>
          <p className="text-gray-400">Here's your trading overview</p>
        </div>
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-fizmo-dark-800 rounded-lg">
            <FaUserCircle className="text-purple-400 text-xl" />
            <span className="text-white text-sm">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 lg:px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center space-x-2 text-sm lg:text-base"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total assets"
          value={loading ? "Loading..." : `$ ${stats?.totalAssets?.toLocaleString() || "0"}`}
          icon={<FaDollarSign />}
          trend="up"
          change="+12.5%"
        />
        <KPICard
          title="Total deposits"
          value={loading ? "Loading..." : `$ ${stats?.totalDeposits?.toLocaleString() || "0"}`}
          icon={<FaArrowDown className="rotate-180" />}
          trend="up"
          change="+8.3%"
        />
        <KPICard
          title="APY"
          value={loading ? "Loading..." : `+ ${stats?.apy || "0"}%`}
          icon={<FaChartBar />}
          trend="up"
          change="This month"
        />
      </div>

      {/* Portfolio Performance */}
      <div className="glassmorphic rounded-xl p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-white">Portfolios performance</h2>
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
            <button className="px-2 sm:px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-xs sm:text-sm whitespace-nowrap">
              FTN
            </button>
            <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
              1D
            </button>
            <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
              5D
            </button>
            <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
              1M
            </button>
            <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
              1Y
            </button>
            <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
              5Y
            </button>
          </div>
        </div>

        {/* Portfolio Chart */}
        <AreaChart data={portfolioData} color="#a855f7" height={256} />
      </div>

      {/* Live Forex Prices */}
      <ForexPrices />

      {/* Trading Accounts */}
      {stats?.accounts && stats.accounts.length > 0 && (
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Your Trading Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.accounts.map((acc: any) => (
              <div key={acc.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">{acc.accountId}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    acc.accountType === "LIVE" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                  }`}>
                    {acc.accountType}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{acc.currency} {acc.balance.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${acc.status === "ACTIVE" ? "text-green-500" : "text-gray-400"}`}>
                  {acc.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glassmorphic rounded-xl p-4 lg:p-6">
        <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">Type</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">Amount</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">Currency</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">Date</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-3 px-2 lg:px-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : stats?.recentTransactions?.length > 0 ? (
                stats.recentTransactions.map((tx: any) => (
                  <tr
                    key={tx.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-2 lg:px-4 text-green-500 text-xs lg:text-sm">{tx.type}</td>
                    <td className="py-3 px-2 lg:px-4 text-white text-xs lg:text-sm">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-gray-400 text-xs lg:text-sm">
                      {tx.currency}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-gray-400 text-xs lg:text-sm">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 lg:px-4">
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 px-2 lg:px-4 text-center text-gray-400">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
