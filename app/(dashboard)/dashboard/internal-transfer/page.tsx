"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function InternalTransferPage() {
  const [fromAccount, setFromAccount] = useState("MT5-100234");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");

  // Mock account data
  const accounts = [
    { accountId: "MT5-100234", type: "LIVE", balance: 10500.5, currency: "USD" },
    { accountId: "MT5-100235", type: "DEMO", balance: 50000.0, currency: "USD" },
    { accountId: "MT4-100236", type: "LIVE", balance: 2500.75, currency: "EUR" },
  ];

  // Mock transfer history
  const transferHistory = [
    {
      id: "1",
      from: "MT5-100234",
      to: "MT5-100235",
      amount: 1000.0,
      currency: "USD",
      date: "2024-12-15 14:30",
      status: "COMPLETED",
    },
    {
      id: "2",
      from: "MT5-100235",
      to: "MT5-100234",
      amount: 500.0,
      currency: "USD",
      date: "2024-12-10 09:15",
      status: "COMPLETED",
    },
    {
      id: "3",
      from: "MT4-100236",
      to: "MT5-100234",
      amount: 250.0,
      currency: "EUR",
      date: "2024-12-05 16:45",
      status: "COMPLETED",
    },
  ];

  const selectedFromAccount = accounts.find((acc) => acc.accountId === fromAccount);
  const selectedToAccount = accounts.find((acc) => acc.accountId === toAccount);

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

          <div className="space-y-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                From Account
              </label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
              >
                {accounts.map((acc) => (
                  <option key={acc.accountId} value={acc.accountId}>
                    {acc.accountId} ({acc.type}) - {acc.currency} {acc.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              {selectedFromAccount && (
                <p className="text-gray-400 text-sm mt-2">
                  Available Balance: {selectedFromAccount.currency}{" "}
                  {selectedFromAccount.balance.toLocaleString()}
                </p>
              )}
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To Account
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
              >
                <option value="">Select destination account</option>
                {accounts
                  .filter((acc) => acc.accountId !== fromAccount)
                  .map((acc) => (
                    <option key={acc.accountId} value={acc.accountId}>
                      {acc.accountId} ({acc.type}) - {acc.currency}{" "}
                      {acc.balance.toLocaleString()}
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
              {selectedFromAccount && (
                <div className="flex space-x-2 mt-3">
                  {[25, 50, 75, 100].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() =>
                        setAmount(
                          ((selectedFromAccount.balance * percentage) / 100).toFixed(2)
                        )
                      }
                      className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-sm"
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Transfer Summary */}
            {selectedFromAccount && selectedToAccount && amount && (
              <div className="p-4 bg-fizmo-dark-800 rounded-lg space-y-3">
                <h3 className="text-white font-semibold">Transfer Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">From</span>
                    <span className="text-white">
                      {selectedFromAccount.accountId} ({selectedFromAccount.type})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">To</span>
                    <span className="text-white">
                      {selectedToAccount.accountId} ({selectedToAccount.type})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white font-bold">
                      {selectedFromAccount.currency} {parseFloat(amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transfer Fee</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-fizmo-purple-500/20">
                    <div className="flex justify-between">
                      <span className="text-gray-400">New Balance (From)</span>
                      <span className="text-white">
                        {selectedFromAccount.currency}{" "}
                        {(selectedFromAccount.balance - parseFloat(amount || "0")).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">New Balance (To)</span>
                    <span className="text-white">
                      {selectedToAccount.currency}{" "}
                      {(selectedToAccount.balance + parseFloat(amount || "0")).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-500 text-sm">
                <strong>Important:</strong> Internal transfers are instant and free of charge.
                Make sure you have selected the correct accounts before confirming the transfer.
                Transfers cannot be reversed once completed.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              className="w-full"
              disabled={!fromAccount || !toAccount || !amount || parseFloat(amount) <= 0}
            >
              Confirm Transfer
            </Button>
          </div>
        </div>

        {/* Account Balances & Transfer History */}
        <div className="space-y-6">
          {/* Account Balances */}
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Accounts</h3>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.accountId} className="p-4 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{account.accountId}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        account.type === "LIVE"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {account.type}
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
            <div className="space-y-3">
              {transferHistory.map((transfer) => (
                <div key={transfer.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white text-sm">
                        {transfer.from} → {transfer.to}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{transfer.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        {transfer.currency} {transfer.amount.toLocaleString()}
                      </p>
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                        {transfer.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Limits Info */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-500 text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Transfer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Processing Time</p>
                <p className="text-white font-semibold">Instant</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Transfer Fee</p>
                <p className="text-green-500 font-semibold">FREE</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Daily Limit</p>
                <p className="text-white font-semibold">Unlimited</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Internal transfers between your own accounts are processed instantly without any fees.
              You can transfer between Live and Demo accounts, or between different platform
              accounts (MT4/MT5). Currency conversion is handled automatically at the current
              exchange rate if transferring between accounts with different currencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
