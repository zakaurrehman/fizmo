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

  // Mock portfolio performance data - will be replaced with real data later
  const portfolioData = [
    { name: "Jan", value: 65000 },
    { name: "Feb", value: 72000 },
    { name: "Mar", value: 68000 },
    { name: "Apr", value: 78000 },
    { name: "May", value: 82000 },
    { name: "Jun", value: stats?.totalAssets || 87743 },
  ];

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

      {/* Tokens & Chain Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Tokens Table */}
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Tokens</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <span className="text-white font-medium">Bitcoin</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">0.04321</p>
                <p className="text-gray-400 text-sm">$2,340.32</p>
              </div>
              <button className="px-4 py-1 bg-fizmo-purple-500 text-white rounded hover:bg-fizmo-purple-600 transition-all text-sm">
                Trade
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="text-white font-medium">Ethereum</span>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">32.234</p>
                <p className="text-gray-400 text-sm">$5,340.32</p>
              </div>
              <button className="px-4 py-1 bg-fizmo-purple-500 text-white rounded hover:bg-fizmo-purple-600 transition-all text-sm">
                Trade
              </button>
            </div>
          </div>
        </div>

        {/* Chain Allocation */}
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-bold text-white mb-4">Chain Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Bitcoin</span>
                <span className="text-gray-400">$23.38 (71.68%)</span>
              </div>
              <div className="h-2 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: "71.68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Ethereum</span>
                <span className="text-gray-400">$23.38 (71.68%)</span>
              </div>
              <div className="h-2 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "71.68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Shiba</span>
                <span className="text-gray-400">$23.38 (71.68%)</span>
              </div>
              <div className="h-2 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: "71.68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Solana</span>
                <span className="text-gray-400">$23.38 (71.68%)</span>
              </div>
              <div className="h-2 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "71.68%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Tether</span>
                <span className="text-gray-400">$23.38 (71.68%)</span>
              </div>
              <div className="h-2 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "71.68%" }}></div>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all">
              View All
            </button>
          </div>
        </div>
      </div>

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
