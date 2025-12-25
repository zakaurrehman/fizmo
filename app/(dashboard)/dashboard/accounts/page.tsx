"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AccountsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    accountType: "DEMO",
    currency: "USD",
    leverage: "100",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount() {
    setCreating(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAccounts();
        setShowCreateModal(false);
        setFormData({ accountType: "DEMO", currency: "USD", leverage: "100" });
      } else {
        const error = await response.json();
        console.error("Failed to create account:", error);
        alert(`Failed to create account: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to create account:", error);
      alert("An error occurred while creating the account");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Accounts</h1>
          <p className="text-gray-400">Manage your trading accounts</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ Create New Account</Button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center text-gray-400 py-8">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 py-8">
            No accounts found. Create your first account to get started!
          </div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="glassmorphic rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{account.accountId}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        account.accountType === "LIVE"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {account.accountType}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Leverage: 1:{account.leverage} | Status: {account.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Balance</p>
                  <p className="text-2xl font-bold text-white">
                    ${account.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Equity</p>
                  <p className="text-2xl font-bold text-white">
                    ${account.equity.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  Deposit
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glassmorphic rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Account</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                >
                  <option value="DEMO">Demo Account</option>
                  <option value="LIVE">Live Account</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Leverage</label>
                <select
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  value={formData.leverage}
                  onChange={(e) => setFormData({ ...formData, leverage: e.target.value })}
                >
                  <option value="50">1:50</option>
                  <option value="100">1:100</option>
                  <option value="200">1:200</option>
                  <option value="500">1:500</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
                disabled={creating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAccount} className="flex-1" loading={creating}>
                Create Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
