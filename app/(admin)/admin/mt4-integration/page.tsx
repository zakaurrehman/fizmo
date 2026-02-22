"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface Account {
  accountId: string;
  mt4Login: number | null;
  totalTrades: number;
  winRate: number;
  lastSyncAt: string | null;
  tradesInDb: number;
}

interface SyncStatus {
  totalAccounts: number;
  accounts: Account[];
}

export default function MT4IntegrationPage() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch sync status on mount
  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/mt4-sync", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch sync status");
      const data = await response.json();
      setSyncStatus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncing(true);
      setError(null);
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/mt4-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ syncAll: true }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSuccess(`Synced ${data.results.length} accounts successfully`);
      await fetchSyncStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncAccount = async (accountId: string, mt4Login: number | null) => {
    if (!mt4Login) {
      setError("MT4 login not configured for this account");
      return;
    }

    try {
      setSyncing(true);
      setError(null);
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/mt4-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ accountId, mt4Login }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setSuccess(data.message);
      await fetchSyncStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">MT4/MT5 Integration</h1>
        <p className="text-gray-400">Manage and sync trades from MT4/MT5 server</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
          {success}
        </div>
      )}

      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Sync Trades</h2>
            <p className="text-gray-400">
              Synchronize trades from MT4/MT5 server to your database
            </p>
          </div>
          <Button
            onClick={handleSyncAll}
            disabled={syncing || loading}
            className="bg-fizmo-purple-500 hover:bg-fizmo-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync All Accounts"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="glassmorphic rounded-xl p-6">
          <div className="text-center py-8 text-gray-400">Loading sync status...</div>
        </div>
      ) : syncStatus ? (
        <div className="glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  <th className="text-left text-gray-400 py-3 px-4">Account ID</th>
                  <th className="text-left text-gray-400 py-3 px-4">MT4 Login</th>
                  <th className="text-right text-gray-400 py-3 px-4">Total Trades</th>
                  <th className="text-right text-gray-400 py-3 px-4">Win Rate</th>
                  <th className="text-left text-gray-400 py-3 px-4">Last Sync</th>
                  <th className="text-center text-gray-400 py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {syncStatus.accounts.map((account) => (
                  <tr key={account.accountId} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-purple-500/5">
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">{account.accountId}</td>
                    <td className="py-3 px-4 text-gray-300">{account.mt4Login || <span className="text-gray-500">Not configured</span>}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{account.totalTrades}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{account.winRate.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {account.lastSyncAt
                        ? new Date(account.lastSyncAt).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() =>
                          handleSyncAccount(account.accountId, account.mt4Login)
                        }
                        disabled={syncing || !account.mt4Login}
                        className="text-sm px-3 py-1 rounded-lg bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 text-fizmo-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sync
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Total Accounts: {syncStatus.totalAccounts}
          </div>
        </div>
      ) : null}

      <div className="glassmorphic rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
        <div className="bg-fizmo-dark-800 p-4 rounded-lg text-sm font-mono text-gray-400">
          <div>Server: 51.195.4.87:443</div>
          <div>API Version: 1290</div>
          <div>Status: <span className="text-green-400">Connected</span></div>
        </div>
      </div>
    </div>
  );
}
