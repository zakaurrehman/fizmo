"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Account {
  id: string;
  accountId: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
}

interface Transfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  createdAt: string;
}

export default function InternalTransferPage() {
  const { token } = useAuth();
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [accRes, trfRes] = await Promise.all([
        fetch("/api/accounts", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/transfers", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const accData = await accRes.json();
      const trfData = await trfRes.json();

      if (accData.accounts) {
        const activeAccounts = accData.accounts.filter((a: Account) => a.status === "ACTIVE");
        setAccounts(activeAccounts);
        if (activeAccounts.length > 0) setFromAccount(activeAccounts[0].id);
      }
      if (trfData.transfers) {
        setTransfers(trfData.transfers);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setError("");
    setSuccess("");

    if (!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0) {
      setError("Please fill in all fields");
      return;
    }

    if (fromAccount === toAccount) {
      setError("Cannot transfer to the same account");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromAccountId: fromAccount,
          toAccountId: toAccount,
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Transfer failed");
      }

      setSuccess(`Transfer of $${parseFloat(amount).toLocaleString()} completed successfully!`);
      setAmount("");
      fetchData(); // Refresh balances
    } catch (err: any) {
      setError(err.message || "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedFrom = accounts.find((a) => a.id === fromAccount);
  const selectedTo = accounts.find((a) => a.id === toAccount);

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
        <h1 className="text-3xl font-bold text-white mb-2">Internal Transfer</h1>
        <p className="text-gray-400">Transfer funds between your trading accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2 glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Transfer Funds</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-500 text-sm">{success}</p>
            </div>
          )}

          {accounts.length < 2 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">You need at least 2 accounts to make transfers.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* From Account */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Account</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountId} ({acc.accountType}) - {acc.currency} {acc.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
                {selectedFrom && (
                  <p className="text-gray-400 text-sm mt-2">
                    Available Balance: {selectedFrom.currency} {selectedFrom.balance.toLocaleString()}
                  </p>
                )}
              </div>

              {/* To Account */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To Account</label>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                >
                  <option value="">Select destination account</option>
                  {accounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountId} ({acc.accountType}) - {acc.currency} {acc.balance.toLocaleString()}
                      </option>
                    ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <Input
                  label="Transfer Amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {selectedFrom && (
                  <div className="flex space-x-2 mt-3">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setAmount(((selectedFrom.balance * pct) / 100).toFixed(2))}
                        className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-sm"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Transfer Summary */}
              {selectedFrom && selectedTo && amount && parseFloat(amount) > 0 && (
                <div className="p-4 bg-fizmo-dark-800 rounded-lg space-y-3">
                  <h3 className="text-white font-semibold">Transfer Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">From</span>
                      <span className="text-white">{selectedFrom.accountId} ({selectedFrom.accountType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">To</span>
                      <span className="text-white">{selectedTo.accountId} ({selectedTo.accountType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount</span>
                      <span className="text-white font-bold">{selectedFrom.currency} {parseFloat(amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transfer Fee</span>
                      <span className="text-green-500">FREE</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-500 text-sm">
                  <strong>Important:</strong> Internal transfers are instant and free of charge.
                  Transfers cannot be reversed once completed.
                </p>
              </div>

              {/* Submit */}
              <Button
                className="w-full"
                onClick={handleTransfer}
                loading={submitting}
                disabled={!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0}
              >
                Confirm Transfer
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Balances */}
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Accounts</h3>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{account.accountId}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        account.accountType === "LIVE"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {account.accountType}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {account.currency} {account.balance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Transfers</h3>
            {transfers.length === 0 ? (
              <p className="text-gray-400 text-sm">No transfers yet</p>
            ) : (
              <div className="space-y-3">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white text-sm">
                          {transfer.fromAccount} → {transfer.toAccount}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(transfer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">${transfer.amount.toLocaleString()}</p>
                        <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                          COMPLETED
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
