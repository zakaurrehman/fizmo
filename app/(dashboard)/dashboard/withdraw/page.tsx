"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaCreditCard, FaBitcoin, FaUniversity, FaWallet } from "react-icons/fa";

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const withdrawalMethods = [
    { id: "card", name: "Credit/Debit Card", icon: FaCreditCard, available: true, fee: "2%" },
    { id: "crypto", name: "Cryptocurrency", icon: FaBitcoin, available: true, fee: "1%" },
    { id: "bank", name: "Bank Transfer", icon: FaUniversity, available: true, fee: "$25" },
    { id: "ewallet", name: "E-Wallet", icon: FaWallet, available: false, fee: "1.5%" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const headers = { Authorization: `Bearer ${token}` };
      const [accountsRes, withdrawalsRes] = await Promise.all([
        fetch("/api/accounts", { headers }),
        fetch("/api/withdrawals", { headers }),
      ]);

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);
        if (accountsData.accounts?.length > 0) {
          setSelectedAccount(accountsData.accounts[0].id);
        }
      }

      if (withdrawalsRes.ok) {
        const withdrawalsData = await withdrawalsRes.json();
        setWithdrawals(withdrawalsData.withdrawals || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdrawal() {
    if (!selectedAccount || !amount || parseFloat(amount) < 50) {
      alert("Please select an account and enter a valid amount (min $50)");
      return;
    }

    const account = accounts.find((acc) => acc.id === selectedAccount);
    if (account && parseFloat(amount) > account.balance) {
      alert("Insufficient balance");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          accountId: selectedAccount,
          amount: parseFloat(amount),
          paymentMethod: selectedMethod,
          paymentDetails,
        }),
      });

      if (response.ok) {
        alert("Withdrawal request submitted successfully!");
        setAmount("");
        setPaymentDetails("");
        await fetchData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to submit withdrawal");
      }
    } catch (error) {
      console.error("Failed to create withdrawal:", error);
      alert("Failed to submit withdrawal");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedAccountData = accounts.find((acc) => acc.id === selectedAccount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
        <p className="text-gray-400">Withdraw funds from your trading account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 glassmorphic rounded-xl p-6">
          {/* Available Balance */}
          <div className="bg-fizmo-dark-800 rounded-xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-white">
              {loading
                ? "Loading..."
                : selectedAccountData
                ? `$${selectedAccountData.balance.toLocaleString()}`
                : "$0.00"}
            </p>
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Select Withdrawal Method</h2>

          {/* Withdrawal Methods */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {withdrawalMethods.map((method) => {
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
                  <p className="text-xs text-gray-400 mt-1">Fee: {method.fee}</p>
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
              {[100, 500, 1000, "All"].map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setAmount(
                      value === "All"
                        ? selectedAccountData?.balance.toString() || "0"
                        : value.toString()
                    )
                  }
                  className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all"
                >
                  {value === "All" ? value : `$${value}`}
                </button>
              ))}
            </div>

            {/* Account Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Withdraw from Account
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
                      {account.accountId} ({account.accountType}) - $
                      {account.balance.toLocaleString()}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Payment Details */}
            {selectedMethod === "card" && (
              <div>
                <Input
                  label="Card Number"
                  placeholder="**** **** **** 1234"
                  type="text"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                />
              </div>
            )}

            {selectedMethod === "crypto" && (
              <div>
                <Input
                  label="Wallet Address"
                  placeholder="Enter your wallet address"
                  type="text"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                />
              </div>
            )}

            {selectedMethod === "bank" && (
              <div>
                <Input
                  label="Bank Details (Bank Name, Account Number, IBAN/SWIFT)"
                  placeholder="Enter bank details"
                  type="text"
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                />
              </div>
            )}

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-500 text-sm">
                ⚠️ Withdrawals are processed within 1-3 business days. Fees may apply depending
                on the withdrawal method.
              </p>
            </div>

            <Button className="w-full" onClick={handleWithdrawal} loading={submitting}>
              Request Withdrawal
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Minimum withdrawal: $50 | Maximum withdrawal: $10,000 per day
            </p>
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Withdrawals</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center text-gray-400 py-4">Loading...</div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center text-gray-400 py-4">No withdrawals yet</div>
            ) : (
              withdrawals.slice(0, 5).map((withdrawal: any) => (
                <div key={withdrawal.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-bold">
                      ${withdrawal.amount.toLocaleString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        withdrawal.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-500"
                          : withdrawal.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{withdrawal.paymentMethod}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(withdrawal.createdAt).toLocaleString()}
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
