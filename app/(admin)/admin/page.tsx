"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { LineChart } from "@/components/charts/LineChart";
import { BarChart } from "@/components/charts/BarChart";
import { FaUsers, FaArrowDown, FaMoneyBillWave, FaDollarSign, FaExclamationTriangle, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fizmo_token");
    router.push("/admin-login");
  };

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  // Format data for charts
  const fundFlowData =
    dashboardData?.fundFlowData?.map((item: any) => ({
      name: item.month,
      value: item.revenue,
    })) || [];

  const clientGrowthData =
    dashboardData?.clientGrowthData?.map((item: any) => ({
      name: item.month,
      value: item.clients,
    })) || [];

  const kpis = dashboardData?.kpis || {
    totalClients: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    netRevenue: 0,
    activeTraders: 0,
    pendingAlerts: 0,
  };

  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Admin Back Office</h1>
            {dashboardData?.broker && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold border border-blue-500/30">
                {dashboardData.broker.name}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm lg:text-base">Broker management and monitoring dashboard</p>
        </div>
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-fizmo-dark-800 rounded-lg">
            <FaUserCircle className="text-blue-400 text-xl" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Clients"
          value={loading ? "..." : kpis.totalClients.toLocaleString()}
          icon={<FaUsers />}
          trend="up"
          change={`${kpis.activeTraders} active`}
        />
        <KPICard
          title="Deposits (24h)"
          value={loading ? "..." : `$${(kpis.totalDeposits / 1000).toFixed(1)}k`}
          icon={<FaArrowDown className="rotate-180" />}
          trend="up"
          change="Last 24 hours"
        />
        <KPICard
          title="Withdrawals"
          value={loading ? "..." : `$${(kpis.totalWithdrawals / 1000).toFixed(1)}k`}
          icon={<FaMoneyBillWave />}
          trend="down"
          change="Last 24 hours"
        />
        <KPICard
          title="Net Revenue"
          value={loading ? "..." : `$${(kpis.netRevenue / 1000).toFixed(1)}k`}
          icon={<FaDollarSign />}
          trend={kpis.netRevenue >= 0 ? "up" : "down"}
          change="Last 24 hours"
        />
        <KPICard
          title="Pending Alerts"
          value={loading ? "..." : kpis.pendingAlerts.toString()}
          icon={<FaExclamationTriangle />}
          trend="up"
          change="Requires attention"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Fund Flow Analysis */}
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-white">Fund Flow Analysis</h2>
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
              <button className="px-2 sm:px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-xs sm:text-sm whitespace-nowrap">
                Line
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
                Bar
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
                24H
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
                7D
              </button>
              <button className="px-2 sm:px-3 py-1 text-gray-400 hover:bg-fizmo-dark-700 rounded text-xs sm:text-sm whitespace-nowrap">
                30D
              </button>
            </div>
          </div>
          <LineChart data={fundFlowData} color="#a855f7" height={256} />
        </div>

        {/* Client Growth */}
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <h2 className="text-lg lg:text-xl font-bold text-white mb-4">Client Growth</h2>
          <BarChart data={clientGrowthData} color="#ec4899" height={256} />
        </div>
      </div>

      {/* Alerts and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Pending Alerts */}
        <div className="lg:col-span-2 glassmorphic rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-white">Pending Items</h2>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded text-sm">
              {kpis.pendingAlerts} items
            </span>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : kpis.pendingAlerts === 0 ? (
            <div className="text-center text-gray-400 py-8">No pending alerts</div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-fizmo-dark-800 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-500">
                      PENDING
                    </span>
                    <p className="text-white font-semibold">
                      Pending Deposits & Withdrawals
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {kpis.pendingAlerts} transaction(s) awaiting admin review and approval.
                </p>
                <div className="flex space-x-2">
                  <a
                    href="/admin/deposits"
                    className="px-3 py-1 bg-fizmo-purple-500 text-white rounded text-sm hover:bg-fizmo-purple-600 transition-all"
                  >
                    Review Deposits
                  </a>
                  <a
                    href="/admin/withdrawals"
                    className="px-3 py-1 bg-fizmo-dark-700 text-gray-400 rounded text-sm hover:bg-fizmo-dark-600 transition-all"
                  >
                    Review Withdrawals
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="glassmorphic rounded-xl p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-xl font-bold text-white">System Status</h2>
            <button className="text-fizmo-purple-400 text-sm hover:text-fizmo-purple-300">
              ⚙️
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">MT4 / MT5 Bridge</p>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <p className="text-xs text-gray-400">Latency: 24ms</p>
            </div>

            <div className="p-3 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">Payment Gateway</p>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <p className="text-xs text-gray-400">Stripe / Crypto</p>
            </div>

            <div className="p-3 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-medium">KYC Provider</p>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <p className="text-xs text-gray-400">Sumsub API</p>
            </div>

            <button className="w-full mt-4 px-4 py-2 text-fizmo-purple-400 hover:bg-fizmo-dark-700 rounded-lg transition-all text-sm">
              View System Health Page →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glassmorphic rounded-xl p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg lg:text-xl font-bold text-white">Recent Activity</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search Client ID..."
              className="px-2 lg:px-3 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded text-white text-xs lg:text-sm placeholder-gray-500"
            />
            <button className="px-2 lg:px-3 py-2 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700 text-xs lg:text-sm whitespace-nowrap">
              Filter
            </button>
            <button className="px-2 lg:px-3 py-2 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700 text-xs lg:text-sm whitespace-nowrap">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">TIME</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">TYPE</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">CLIENT NAME</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">AMOUNT</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">CURRENCY</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">STATUS</th>
                <th className="text-left text-gray-400 py-3 px-2 lg:px-4 text-xs lg:text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">
                    Loading...
                  </td>
                </tr>
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-8">
                    No recent activity
                  </td>
                </tr>
              ) : (
                recentActivity.map((activity: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-2 lg:px-4 text-white text-xs lg:text-sm">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-white text-xs lg:text-sm">{activity.type}</td>
                    <td className="py-3 px-2 lg:px-4 text-white text-xs lg:text-sm">
                      {activity.clientName}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-white font-semibold text-xs lg:text-sm">
                      ${activity.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-gray-400 text-xs lg:text-sm">
                      {activity.accountId}
                    </td>
                    <td className="py-3 px-2 lg:px-4 text-xs lg:text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activity.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-500"
                            : activity.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
