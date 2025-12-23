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
      const response = await fetch(`/api/admin/reports?range=${dateRange}`);
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
              <h3 className="text-xl font-bold text-white mb-4">Revenue Breakdown (30d)</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Trading Commissions</span>
                    <span className="text-white font-semibold">$485,200 (54.4%)</span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "54.4%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Spreads</span>
                    <span className="text-white font-semibold">$285,100 (31.9%)</span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "31.9%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Deposit/Withdrawal Fees</span>
                    <span className="text-white font-semibold">$89,450 (10.0%)</span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "10.0%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Inactivity Fees</span>
                    <span className="text-white font-semibold">$32,700 (3.7%)</span>
                  </div>
                  <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "3.7%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
                <p className="text-gray-400">Line Chart: Revenue over time (Placeholder)</p>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Revenue Sources</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-fizmo-purple-500/20">
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">SOURCE</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">REVENUE</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">% OF TOTAL</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">GROWTH</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white">Forex Trading</td>
                    <td className="py-3 px-4 text-white font-semibold">$542,300</td>
                    <td className="py-3 px-4 text-gray-400">60.8%</td>
                    <td className="py-3 px-4 text-green-500">+22.5%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white">Crypto Trading</td>
                    <td className="py-3 px-4 text-white font-semibold">$228,050</td>
                    <td className="py-3 px-4 text-gray-400">25.6%</td>
                    <td className="py-3 px-4 text-green-500">+18.3%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white">Commodities</td>
                    <td className="py-3 px-4 text-white font-semibold">$89,400</td>
                    <td className="py-3 px-4 text-gray-400">10.0%</td>
                    <td className="py-3 px-4 text-green-500">+8.7%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white">Indices</td>
                    <td className="py-3 px-4 text-white font-semibold">$32,700</td>
                    <td className="py-3 px-4 text-gray-400">3.6%</td>
                    <td className="py-3 px-4 text-red-500">-2.1%</td>
                  </tr>
                </tbody>
              </table>
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
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Total Volume (30d)</h3>
              <p className="text-4xl font-bold text-white mb-2">$128.5M</p>
              <p className="text-green-500 text-sm mb-4">+24.1% vs prev period</p>
              <div className="h-32 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
                <p className="text-gray-400 text-sm">Mini Chart (Placeholder)</p>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Total Trades (30d)</h3>
              <p className="text-4xl font-bold text-white mb-2">45,820</p>
              <p className="text-green-500 text-sm mb-4">+18.7% vs prev period</p>
              <div className="h-32 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
                <p className="text-gray-400 text-sm">Mini Chart (Placeholder)</p>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Avg Trade Size</h3>
              <p className="text-4xl font-bold text-white mb-2">$2,804</p>
              <p className="text-green-500 text-sm mb-4">+4.5% vs prev period</p>
              <div className="h-32 flex items-center justify-center bg-fizmo-dark-800 rounded-lg">
                <p className="text-gray-400 text-sm">Mini Chart (Placeholder)</p>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Top Traded Instruments</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-fizmo-purple-500/20">
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">INSTRUMENT</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">VOLUME</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">TRADES</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">AVG SIZE</th>
                    <th className="text-left text-gray-400 py-3 px-4 text-sm">TREND</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white font-semibold">EUR/USD</td>
                    <td className="py-3 px-4 text-white">$42.5M</td>
                    <td className="py-3 px-4 text-gray-400">18,245</td>
                    <td className="py-3 px-4 text-gray-400">$2,330</td>
                    <td className="py-3 px-4 text-green-500">+15.2%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white font-semibold">BTC/USD</td>
                    <td className="py-3 px-4 text-white">$28.2M</td>
                    <td className="py-3 px-4 text-gray-400">8,542</td>
                    <td className="py-3 px-4 text-gray-400">$3,301</td>
                    <td className="py-3 px-4 text-green-500">+42.8%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white font-semibold">GBP/USD</td>
                    <td className="py-3 px-4 text-white">$18.4M</td>
                    <td className="py-3 px-4 text-gray-400">7,825</td>
                    <td className="py-3 px-4 text-gray-400">$2,351</td>
                    <td className="py-3 px-4 text-green-500">+8.5%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white font-semibold">GOLD</td>
                    <td className="py-3 px-4 text-white">$15.8M</td>
                    <td className="py-3 px-4 text-gray-400">5,420</td>
                    <td className="py-3 px-4 text-gray-400">$2,914</td>
                    <td className="py-3 px-4 text-green-500">+12.3%</td>
                  </tr>
                  <tr className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white font-semibold">USD/JPY</td>
                    <td className="py-3 px-4 text-white">$12.6M</td>
                    <td className="py-3 px-4 text-gray-400">5,788</td>
                    <td className="py-3 px-4 text-gray-400">$2,177</td>
                    <td className="py-3 px-4 text-red-500">-3.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Payment Method Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-white">Credit/Debit Card</span>
                  <span className="text-white font-bold">42%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-white">Cryptocurrency</span>
                  <span className="text-white font-bold">36%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-white">Bank Transfer</span>
                  <span className="text-white font-bold">14%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-white">E-Wallet</span>
                  <span className="text-white font-bold">8%</span>
                </div>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Transaction Fees (30d)</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Deposit Fees Collected</span>
                  <span className="text-green-500 font-bold">$4,820</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Withdrawal Fees Collected</span>
                  <span className="text-green-500 font-bold">$3,630</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-gray-400">Payment Gateway Costs</span>
                  <span className="text-red-500 font-bold">-$2,145</span>
                </div>
                <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                  <span className="text-white font-semibold">Net Fee Revenue</span>
                  <span className="text-white font-bold">$6,305</span>
                </div>
              </div>
            </div>
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
            <h3 className="text-xl font-bold text-white mb-4">Recent Compliance Actions</h3>
            <div className="space-y-3">
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-semibold">
                      SAR FILED
                    </span>
                    <p className="text-white font-semibold mt-2">Suspicious Transaction Pattern</p>
                    <p className="text-gray-400 text-sm">Client CL-100248 - Multiple transactions below threshold</p>
                  </div>
                  <span className="text-gray-500 text-xs">2024-12-21 10:15</span>
                </div>
              </div>
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs font-semibold">
                      ACCOUNT FROZEN
                    </span>
                    <p className="text-white font-semibold mt-2">Sanctions List Match</p>
                    <p className="text-gray-400 text-sm">Client CL-100260 - OFAC SDN list match pending review</p>
                  </div>
                  <span className="text-gray-500 text-xs">2024-12-21 08:30</span>
                </div>
              </div>
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-semibold">
                      CLEARED
                    </span>
                    <p className="text-white font-semibold mt-2">Enhanced Due Diligence Completed</p>
                    <p className="text-gray-400 text-sm">Client CL-100245 - High value transaction cleared</p>
                  </div>
                  <span className="text-gray-500 text-xs">2024-12-20 16:45</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
