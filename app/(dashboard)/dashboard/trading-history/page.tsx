"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TradingHistoryPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock trading data
  const trades = [
    {
      id: "1",
      ticket: "8542185",
      openTime: "2024-12-21 14:30:15",
      closeTime: "2024-12-21 18:45:22",
      symbol: "EUR/USD",
      type: "BUY",
      volume: 0.5,
      openPrice: 1.08452,
      closePrice: 1.08598,
      sl: 1.08200,
      tp: 1.08800,
      commission: 3.5,
      swap: -0.82,
      profit: 73.0,
      status: "CLOSED",
    },
    {
      id: "2",
      ticket: "8542186",
      openTime: "2024-12-21 16:20:10",
      closeTime: null,
      symbol: "GBP/USD",
      type: "SELL",
      volume: 0.3,
      openPrice: 1.26850,
      closePrice: 1.26920,
      sl: 1.27200,
      tp: 1.26500,
      commission: 0.0,
      swap: 0.0,
      profit: -21.0,
      status: "OPEN",
    },
    {
      id: "3",
      ticket: "8542180",
      openTime: "2024-12-21 10:15:45",
      closeTime: "2024-12-21 12:30:18",
      symbol: "BTC/USD",
      type: "BUY",
      volume: 0.1,
      openPrice: 43250.50,
      closePrice: 43580.20,
      sl: 42800.00,
      tp: 44000.00,
      commission: 5.0,
      swap: 0.0,
      profit: 329.7,
      status: "CLOSED",
    },
    {
      id: "4",
      ticket: "8542175",
      openTime: "2024-12-20 15:45:30",
      closeTime: "2024-12-20 20:10:55",
      symbol: "GOLD",
      type: "BUY",
      volume: 0.2,
      openPrice: 2045.80,
      closePrice: 2038.20,
      sl: 2030.00,
      tp: 2060.00,
      commission: 2.5,
      swap: -0.45,
      profit: -15.2,
      status: "CLOSED",
    },
    {
      id: "5",
      ticket: "8542190",
      openTime: "2024-12-21 18:00:00",
      closeTime: null,
      symbol: "USD/JPY",
      type: "BUY",
      volume: 0.4,
      openPrice: 149.850,
      closePrice: 149.920,
      sl: 149.500,
      tp: 150.300,
      commission: 0.0,
      swap: 0.0,
      profit: 28.0,
      status: "OPEN",
    },
  ];

  const filteredTrades = trades.filter((trade) => {
    if (selectedTab === "open" && trade.status !== "OPEN") return false;
    if (selectedTab === "closed" && trade.status !== "CLOSED") return false;
    if (searchTerm && !JSON.stringify(trade).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const openTrades = trades.filter((t) => t.status === "OPEN");
  const closedTrades = trades.filter((t) => t.status === "CLOSED");
  const totalProfit = closedTrades.reduce((sum, t) => sum + t.profit, 0);
  const winRate = closedTrades.length > 0
    ? (closedTrades.filter((t) => t.profit > 0).length / closedTrades.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading History</h1>
          <p className="text-gray-400">View your open positions and closed trades</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Open Positions</p>
          <p className="text-2xl font-bold text-white">{openTrades.length}</p>
          <p className="text-gray-400 text-sm">Active trades</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{trades.length}</p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Profit/Loss</p>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${totalProfit.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">Closed trades</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-green-500">{winRate.toFixed(1)}%</p>
          <p className="text-gray-400 text-sm">Success rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by symbol, ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Symbols</option>
            <option>EUR/USD</option>
            <option>GBP/USD</option>
            <option>BTC/USD</option>
            <option>GOLD</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </div>

      {/* Trade Status Tabs */}
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
            All Trades ({trades.length})
          </button>
          <button
            onClick={() => setSelectedTab("open")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "open"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Open Positions ({openTrades.length})
          </button>
          <button
            onClick={() => setSelectedTab("closed")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "closed"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Closed Trades ({closedTrades.length})
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TICKET</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">OPEN TIME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">SYMBOL</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">VOLUME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">OPEN PRICE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">CLOSE PRICE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">SL/TP</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">PROFIT/LOSS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                >
                  <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">
                    #{trade.ticket}
                  </td>
                  <td className="py-3 px-4 text-white text-sm">{trade.openTime}</td>
                  <td className="py-3 px-4 text-white font-semibold text-sm">{trade.symbol}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        trade.type === "BUY"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white text-sm">{trade.volume} lots</td>
                  <td className="py-3 px-4 text-white text-sm">{trade.openPrice.toFixed(5)}</td>
                  <td className="py-3 px-4 text-white text-sm">
                    {trade.closePrice ? trade.closePrice.toFixed(5) : "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    <div className="text-xs">
                      <div>SL: {trade.sl.toFixed(5)}</div>
                      <div>TP: {trade.tp.toFixed(5)}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <p
                      className={`font-bold ${
                        trade.profit >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.profit >= 0 ? "+" : ""}${trade.profit.toFixed(2)}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        trade.status === "OPEN"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No trades found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {filteredTrades.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-fizmo-purple-500/20">
            <p className="text-gray-400 text-sm">Showing {filteredTrades.length} trades</p>
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

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Performance by Symbol</h3>
          <div className="space-y-3">
            {[
              { symbol: "EUR/USD", trades: 1, profit: 73.0 },
              { symbol: "BTC/USD", trades: 1, profit: 329.7 },
              { symbol: "GBP/USD", trades: 1, profit: -21.0 },
              { symbol: "GOLD", trades: 1, profit: -15.2 },
            ].map((item) => (
              <div key={item.symbol} className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">{item.symbol}</span>
                  <span
                    className={`font-bold ${
                      item.profit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${item.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.trades} trades</span>
                  <span
                    className={`${item.profit >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {item.profit >= 0 ? "+" : ""}{((item.profit / Math.abs(item.profit)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trading Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <span className="text-gray-400">Total Volume Traded</span>
              <span className="text-white font-bold">1.5 lots</span>
            </div>
            <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <span className="text-gray-400">Average Trade Duration</span>
              <span className="text-white font-bold">3h 45m</span>
            </div>
            <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <span className="text-gray-400">Best Trade</span>
              <span className="text-green-500 font-bold">+$329.70</span>
            </div>
            <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <span className="text-gray-400">Worst Trade</span>
              <span className="text-red-500 font-bold">-$21.00</span>
            </div>
            <div className="flex justify-between p-3 bg-fizmo-dark-800 rounded-lg">
              <span className="text-gray-400">Total Commission Paid</span>
              <span className="text-white font-bold">$11.00</span>
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
            <h4 className="text-white font-semibold mb-2">Trading History Sync</h4>
            <p className="text-gray-400 text-sm">
              Your trading history is automatically synchronized from your MT4/MT5 trading account.
              Trades are updated in real-time. Historical data is retained for up to 12 months.
              For older records, please contact support to request an export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
