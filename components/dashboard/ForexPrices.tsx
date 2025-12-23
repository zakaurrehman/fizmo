"use client";

import { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaMinus, FaSync } from "react-icons/fa";

interface ForexPrice {
  symbol: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
  change: string;
  changePercent: string;
  lastUpdated: string;
}

export function ForexPrices() {
  const [prices, setPrices] = useState<ForexPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch prices from API
  const fetchPrices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/prices", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        setPrices(data.prices || []);
        setLastUpdate(new Date());
        setError(null);
      } else {
        setError("Failed to fetch prices");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and set up auto-refresh every 30 seconds
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (changePercent: string) => {
    const change = parseFloat(changePercent);
    if (change > 0) return <FaArrowUp className="text-green-500" />;
    if (change < 0) return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  const getTrendColor = (changePercent: string) => {
    const change = parseFloat(changePercent);
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-gray-400";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin text-fizmo-purple-400 text-2xl">
            <FaSync />
          </div>
          <span className="ml-3 text-gray-400">Loading forex prices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glassmorphic rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPrices}
            className="px-4 py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="glassmorphic rounded-xl p-6">
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">
            No forex prices available. Prices will update automatically every 15 minutes.
          </p>
          <button
            onClick={fetchPrices}
            className="px-4 py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 flex items-center space-x-2 mx-auto"
          >
            <FaSync />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphic rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Live Forex Prices</h3>
          <p className="text-sm text-gray-400">
            {lastUpdate && `Last updated: ${formatTime(lastUpdate)}`}
          </p>
        </div>
        <button
          onClick={fetchPrices}
          className="p-2 bg-fizmo-dark-800 hover:bg-fizmo-dark-700 rounded-lg transition-colors text-fizmo-purple-400"
        >
          <FaSync className="text-lg" />
        </button>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.map((price) => {
          const changePercent = parseFloat(price.changePercent);
          const isPositive = changePercent > 0;
          const isNegative = changePercent < 0;

          return (
            <div
              key={price.symbol}
              className="bg-fizmo-dark-800 rounded-lg p-4 hover:bg-fizmo-dark-700 transition-colors"
            >
              {/* Symbol */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-white">{price.symbol}</h4>
                <div className="text-xl">{getTrendIcon(price.changePercent)}</div>
              </div>

              {/* Exchange Rate */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">
                  {parseFloat(price.exchangeRate).toFixed(5)}
                </div>
              </div>

              {/* Change */}
              <div className={`flex items-center space-x-2 ${getTrendColor(price.changePercent)}`}>
                <span className="text-sm font-medium">
                  {isPositive ? "+" : ""}
                  {parseFloat(price.change).toFixed(5)}
                </span>
                <span className="text-sm">
                  ({isPositive ? "+" : ""}
                  {parseFloat(price.changePercent).toFixed(2)}%)
                </span>
              </div>

              {/* Bid/Ask */}
              <div className="mt-3 pt-3 border-t border-fizmo-dark-700 text-xs text-gray-400 flex justify-between">
                <span>Bid: {parseFloat(price.bidPrice).toFixed(5)}</span>
                <span>Ask: {parseFloat(price.askPrice).toFixed(5)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="mt-6 pt-4 border-t border-fizmo-dark-700 text-sm text-gray-400">
        <p>
          Prices update automatically every 15 minutes • Data provided by Alpha Vantage
        </p>
      </div>
    </div>
  );
}
