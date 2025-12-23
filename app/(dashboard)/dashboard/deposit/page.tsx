"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaCreditCard, FaBitcoin, FaUniversity, FaWallet } from "react-icons/fa";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: FaCreditCard, available: true },
    { id: "crypto", name: "Cryptocurrency", icon: FaBitcoin, available: true },
    { id: "bank", name: "Bank Transfer", icon: FaUniversity, available: true },
    { id: "ewallet", name: "E-Wallet", icon: FaWallet, available: false },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [accountsRes, depositsRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/deposits"),
      ]);

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);
        if (accountsData.accounts?.length > 0) {
          setSelectedAccount(accountsData.accounts[0].id);
        }
      }

      if (depositsRes.ok) {
        const depositsData = await depositsRes.json();
        setDeposits(depositsData.deposits || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit() {
    if (!selectedAccount || !amount || parseFloat(amount) < 50) {
      alert("Please select an account and enter a valid amount (min $50)");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount,
          amount: parseFloat(amount),
          paymentMethod: selectedMethod,
        }),
      });

      if (response.ok) {
        alert("Deposit request submitted successfully!");
        setAmount("");
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit deposit");
      }
    } catch (error) {
      console.error("Failed to create deposit:", error);
      alert("Failed to submit deposit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-gray-400">Add funds to your trading account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit Form */}
        <div className="lg:col-span-2 glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Select Payment Method</h2>

          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {paymentMethods.map((method) => {
              const MethodIcon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => method.available && setSelectedMethod(method.id)}
                  disabled={!method.available}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? "border-fizmo-purple-500 bg-fizmo-purple-500/10"
                      : "border-fizmo-purple-500/20 hover:border-fizmo-purple-500/40"
                  } ${!method.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="text-3xl mb-2 flex items-center justify-center text-fizmo-purple-400">
                    <MethodIcon />
                  </div>
                  <p className="text-white font-medium">{method.name}</p>
                  {!method.available && (
                    <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <Input
              label="Amount (USD)"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* Quick Amount Buttons */}
            <div className="flex space-x-2">
              {[100, 500, 1000, 5000].map((value) => (
                <button
                  key={value}
                  onClick={() => setAmount(value.toString())}
                  className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all"
                >
                  ${value}
                </button>
              ))}
            </div>

            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deposit to Account
              </label>
              <select
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                {accounts.length === 0 ? (
                  <option>No accounts available</option>
                ) : (
                  accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountId} ({account.accountType})
                    </option>
                  ))
                )}
              </select>
            </div>

            <Button className="w-full" onClick={handleDeposit} loading={submitting}>
              Proceed to Payment
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Minimum deposit: $50 | Maximum deposit: $50,000
            </p>
          </div>
        </div>

        {/* Recent Deposits */}
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Deposits</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-400 py-4">Loading...</div>
            ) : deposits.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No deposits yet</div>
            ) : (
              deposits.slice(0, 5).map((deposit: any) => (
                <div key={deposit.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold">${deposit.amount.toLocaleString()}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        deposit.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-500"
                          : deposit.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{deposit.paymentMethod}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(deposit.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
