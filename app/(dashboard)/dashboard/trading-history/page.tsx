"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Input } from "@/components/ui/Input";

interface Trade {
  id: string;
  ticket: string;
  symbol: string;
  type: string;
  volume: number;
  openPrice: number;
  closePrice?: number;
  openTime: string;
  closeTime?: string;
  profit?: number;
  commission?: number;
  swap?: number;
}

interface Summary {
  totalTrades: number;
  completedTrades: number;
  openTrades: number;
  totalProfit: number;
  winRate: number;
}

export default function TradingHistoryPage() {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetchTrades();
  }, [token]);

  const fetchTrades = async () => {
    try {
      const res = await fetch("/api/trades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTrades(data.data.trades);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrades = trades.filter((trade) => {
    const isOpen = !trade.closeTime;
    if (selectedTab === "open" && !isOpen) return false;
    if (selectedTab === "closed" && isOpen) return false;
    if (searchTerm && !JSON.stringify(trade).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
        <h1 className="text-3xl font-bold text-white mb-2">Trading History</h1>
        <p className="text-gray-400">View your open positions and closed trades</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Open Positions</p>
          <p className="text-2xl font-bold text-white">{summary?.openTrades || 0}</p>
          <p className="text-gray-400 text-sm">Active trades</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Trades</p>
          <p className="text-2xl font-bold text-white">{summary?.totalTrades || 0}</p>
          <p className="text-gray-400 text-sm">All time</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Profit/Loss</p>
          <p className={`text-2xl font-bold ${(summary?.totalProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${(summary?.totalProfit || 0).toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">Closed trades</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-green-500">{summary?.winRate || 0}%</p>
          <p className="text-gray-400 text-sm">Success rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <Input
          placeholder="Search symbol or ticket..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex gap-2">
          {[
            { key: "all", label: "All Trades" },
            { key: "open", label: "Open Positions" },
            { key: "closed", label: "Closed Trades" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab.key
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trades Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TICKET</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">SYMBOL</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">VOLUME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">OPEN PRICE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">CLOSE PRICE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">PROFIT/LOSS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">OPEN TIME</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                  <td className="py-3 px-4 text-white text-sm font-mono">{trade.ticket}</td>
                  <td className="py-3 px-4 text-white text-sm font-semibold">{trade.symbol}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${trade.type === "BUY" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{trade.volume}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{trade.openPrice.toFixed(5)}</td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {trade.closePrice ? trade.closePrice.toFixed(5) : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={trade.profit && trade.profit >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      ${(trade.profit || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(trade.openTime).toLocaleDateString()} {new Date(trade.openTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No trades found</p>
          </div>
        )}
      </div>
    </div>
  );
}
