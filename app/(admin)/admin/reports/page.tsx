"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminReportsPage() {
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  async function fetchReports() {
    setLoading(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/admin/reports?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const reportData = await response.json();
        setData(reportData);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reports & Business Intelligence</h1>
          <p className="text-gray-400">Analytics, insights, and reporting tools</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline">Schedule Report</Button>
          <Button>Export All</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Revenue ({dateRange})</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : `$${data?.quickStats.totalRevenue.toLocaleString() || 0}`}
          </p>
          <p
            className={`text-sm ${
              (data?.quickStats.revenueGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {loading
              ? "..."
              : `${data?.quickStats.revenueGrowth >= 0 ? "+" : ""}${data?.quickStats.revenueGrowth.toFixed(1)}% vs prev period`}
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Net Deposits ({dateRange})</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : `$${data?.quickStats.netDeposits.toLocaleString() || 0}`}
          </p>
          <p
            className={`text-sm ${
              (data?.quickStats.netDepositsGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {loading
              ? "..."
              : `${data?.quickStats.netDepositsGrowth >= 0 ? "+" : ""}${data?.quickStats.netDepositsGrowth.toFixed(1)}%`}
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Trading Volume ({dateRange})</p>
          <p className="text-2xl font-bold text-white">Coming Soon</p>
          <p className="text-gray-500 text-sm">No data yet</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active Clients</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : data?.clients.activeClients.toLocaleString() || 0}
          </p>
          <p
            className={`text-sm ${
              (data?.clients.clientsGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {loading
              ? "..."
              : `${data?.clients.clientsGrowth >= 0 ? "+" : ""}${data?.clients.clientsGrowth.toFixed(1)}%`}
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Avg Revenue/Client</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : `$${data?.quickStats.avgRevenuePerClient.toFixed(0) || 0}`}
          </p>
          <p className="text-gray-500 text-sm">Per active client</p>
        </div>
      </div>

      {/* Report Categories */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedReport("revenue")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedReport === "revenue"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Revenue Analysis
          </button>
          <button
            onClick={() => setSelectedReport("client")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedReport === "client"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Client Analytics
          </button>
          <button
            onClick={() => setSelectedReport("trading")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedReport === "trading"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Trading Performance
          </button>
          <button
            onClick={() => setSelectedReport("financial")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedReport === "financial"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Financial Summary
          </button>
          <button
            onClick={() => setSelectedReport("compliance")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedReport === "compliance"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Compliance
          </button>
        </div>
      </div>

      {/* Revenue Analysis Report */}
      {selectedReport === "revenue" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Net Deposits ({dateRange})</h3>
              {loading ? (
                <p className="text-gray-400 text-center">Loading...</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Total Deposits</span>
                      <span className="text-green-500 font-semibold">
                        ${data?.financial?.totalDeposits?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Total Withdrawals</span>
                      <span className="text-red-500 font-semibold">
                        ${data?.financial?.totalWithdrawals?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div
                      className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: data?.financial?.totalDeposits > 0
                            ? `${Math.min((data.financial.totalWithdrawals / data.financial.totalDeposits) * 100, 100)}%`
                            : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Net Deposits</span>
                      <span className="text-white font-semibold">
                        ${data?.financial?.netDeposits?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Key Metrics</h3>
              {loading ? (
                <p className="text-gray-400 text-center">Loading...</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                    <span className="text-gray-400">Avg Revenue/Client</span>
                    <span className="text-white font-bold">
                      ${data?.quickStats?.avgRevenuePerClient?.toFixed(0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                    <span className="text-gray-400">Total Balance (All Clients)</span>
                    <span className="text-white font-bold">
                      ${data?.financial?.totalBalance?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                    <span className="text-gray-400">Total Equity</span>
                    <span className="text-white font-bold">
                      ${data?.financial?.totalEquity?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Client Analytics Report */}
      {selectedReport === "client" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Client Growth</h3>
              <div className="h-64 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
                <p className="text-gray-400">Area Chart: Client acquisition (Coming Soon)</p>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Client Status</h3>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-400 text-center">Loading...</p>
                ) : (
                  <>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Active Clients</span>
                        <span className="text-green-500 font-semibold">
                          {data?.clients.activeClients} (
                          {((data?.clients.activeClients / data?.clients.totalClients) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${(data?.clients.activeClients / data?.clients.totalClients) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Total Clients</span>
                        <span className="text-white font-semibold">{data?.clients.totalClients}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">New Clients ({dateRange})</span>
                        <span className="text-blue-500 font-semibold">
                          {data?.clients.newClients} (+
                          {data?.clients.clientsGrowth.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Client Metrics Summary</h3>
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Avg Lifetime Value</p>
                  <p className="text-3xl font-bold text-white">
                    ${data?.clients.avgLifetimeValue.toFixed(0) || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Avg Deposit</p>
                  <p className="text-3xl font-bold text-white">
                    ${data?.clients.avgDepositPerClient.toFixed(0) || 0}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Total Clients</p>
                  <p className="text-3xl font-bold text-green-500">{data?.clients.totalClients}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-2">Active Clients</p>
                  <p className="text-3xl font-bold text-purple-500">
                    {data?.clients.activeClients}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Trading Performance Report */}
      {selectedReport === "trading" && (
        <div className="glassmorphic rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-2">Trading Performance data requires MT4/MT5 integration</p>
          <p className="text-gray-500 text-sm">Live trade data will appear here once the trading platform is connected.</p>
        </div>
      )}

      {/* Financial Summary Report */}
      {selectedReport === "financial" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Deposits ({dateRange})</p>
              <p className="text-2xl font-bold text-green-500">
                {loading ? "..." : `$${data?.financial.totalDeposits.toLocaleString() || 0}`}
              </p>
              <p
                className={`text-sm ${
                  (data?.financial.depositsGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {loading
                  ? "..."
                  : `${data?.financial.depositsGrowth >= 0 ? "+" : ""}${data?.financial.depositsGrowth.toFixed(1)}%`}
              </p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Withdrawals ({dateRange})</p>
              <p className="text-2xl font-bold text-red-500">
                {loading ? "..." : `$${data?.financial.totalWithdrawals.toLocaleString() || 0}`}
              </p>
              <p
                className={`text-sm ${
                  (data?.financial.withdrawalsGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {loading
                  ? "..."
                  : `${data?.financial.withdrawalsGrowth >= 0 ? "+" : ""}${data?.financial.withdrawalsGrowth.toFixed(1)}%`}
              </p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Net Deposits ({dateRange})</p>
              <p className="text-2xl font-bold text-white">
                {loading ? "..." : `$${data?.financial.netDeposits.toLocaleString() || 0}`}
              </p>
              <p
                className={`text-sm ${
                  (data?.financial.netDepositsGrowth || 0) >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {loading
                  ? "..."
                  : `${data?.financial.netDepositsGrowth >= 0 ? "+" : ""}${data?.financial.netDepositsGrowth.toFixed(1)}%`}
              </p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Client Balance (Total)</p>
              <p className="text-2xl font-bold text-white">
                {loading ? "..." : `$${data?.financial.totalBalance.toLocaleString() || 0}`}
              </p>
              <p className="text-gray-500 text-sm">Total Equity: ${loading ? "..." : data?.financial.totalEquity.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Cash Flow Analysis</h3>
            <div className="h-80 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
              <p className="text-gray-400">Bar Chart: Deposits vs Withdrawals (Placeholder)</p>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Financial Summary</h3>
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Total Deposits</span>
                  <span className="text-green-500 font-bold">${data?.financial?.totalDeposits?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Total Withdrawals</span>
                  <span className="text-red-500 font-bold">${data?.financial?.totalWithdrawals?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Net Deposits</span>
                  <span className="text-white font-bold">${data?.financial?.netDeposits?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Total Balance</span>
                  <span className="text-white font-bold">${data?.financial?.totalBalance?.toLocaleString() || 0}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Compliance Report */}
      {selectedReport === "compliance" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">KYC Pending</p>
              <p className="text-2xl font-bold text-yellow-500">
                {loading ? "..." : data?.compliance.kycPending}
              </p>
              <p className="text-gray-400 text-sm">Awaiting review</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">KYC Under Review</p>
              <p className="text-2xl font-bold text-white">
                {loading ? "..." : data?.compliance.kycUnderReview}
              </p>
              <p className="text-gray-400 text-sm">Being processed</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">KYC Rejected</p>
              <p className="text-2xl font-bold text-red-500">
                {loading ? "..." : data?.compliance.kycRejected}
              </p>
              <p className="text-gray-400 text-sm">Needs resubmission</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Compliance Score</p>
              <p className="text-2xl font-bold text-green-500">
                {loading ? "..." : `${data?.compliance.complianceScore}%`}
              </p>
              <p className="text-green-500 text-sm">
                {parseFloat(data?.compliance.complianceScore || "0") >= 90
                  ? "Excellent"
                  : "Good"}
              </p>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">KYC Status Overview</h3>
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Approved</span>
                    <span className="text-green-500 font-semibold">
                      {data?.compliance.kycApproved} (
                      {((data?.compliance.kycApproved / data?.clients.totalClients) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(data?.compliance.kycApproved / data?.clients.totalClients) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Under Review</span>
                    <span className="text-yellow-500 font-semibold">
                      {data?.compliance.kycUnderReview} (
                      {((data?.compliance.kycUnderReview / data?.clients.totalClients) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${(data?.compliance.kycUnderReview / data?.clients.totalClients) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Rejected</span>
                    <span className="text-red-500 font-semibold">
                      {data?.compliance.kycRejected} (
                      {((data?.compliance.kycRejected / data?.clients.totalClients) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${(data?.compliance.kycRejected / data?.clients.totalClients) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Pending</span>
                    <span className="text-blue-500 font-semibold">
                      {data?.compliance.kycPending} (
                      {((data?.compliance.kycPending / data?.clients.totalClients) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(data?.compliance.kycPending / data?.clients.totalClients) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">KYC Overview</h3>
            {loading ? (
              <p className="text-gray-400 text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-500">{data?.compliance?.kycApproved || 0}</p>
                </div>
                <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">{data?.compliance?.kycPending || 0}</p>
                </div>
                <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Under Review</p>
                  <p className="text-2xl font-bold text-blue-500">{data?.compliance?.kycUnderReview || 0}</p>
                </div>
                <div className="text-center p-4 bg-fizmo-dark-800 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-500">{data?.compliance?.kycRejected || 0}</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
