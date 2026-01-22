"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaCreditCard, FaBitcoin, FaUniversity, FaWallet } from "react-icons/fa";

function DepositContent() {
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string>("card");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check for Stripe success/cancel
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccessMessage("Payment successful! Your deposit is being processed.");
      window.history.replaceState({}, "", "/dashboard/deposit");
    }
    if (searchParams.get("canceled") === "true") {
      alert("Payment was canceled. Please try again.");
      window.history.replaceState({}, "", "/dashboard/deposit");
    }
  }, [searchParams]);

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
    if (!amount || parseFloat(amount) < 50) {
      alert("Please enter a valid amount (min $50)");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("fizmo_token");

      // For card payments, use Stripe
      if (selectedMethod === "card") {
        const response = await fetch("/api/payments/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: "USD",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Redirect to Stripe Checkout
          window.location.href = data.url;
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create checkout session");
        }
      }
      // For crypto payments, use CoinGate
      else if (selectedMethod === "crypto") {
        const response = await fetch("/api/payments/coingate/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: "USD",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Redirect to CoinGate payment page
          window.location.href = data.paymentUrl;
        } else {
          const error = await response.json();
          alert(error.error || "Failed to create crypto payment");
        }
      }
      // For bank transfer, create pending deposit
      else if (selectedMethod === "bank") {
        const response = await fetch("/api/deposits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            paymentMethod: "BANK_TRANSFER",
          }),
        });

        if (response.ok) {
          alert("Bank transfer instructions have been sent to your email. Please complete the transfer within 24 hours.");
          setAmount("");
          await fetchData();
        } else {
          const error = await response.json();
          alert(error.error || "Failed to submit deposit");
        }
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
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-green-500">{successMessage}</p>
        </div>
      )}

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

// Wrap with Suspense for useSearchParams
export default function DepositPage() {
  return (
    <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
      <DepositContent />
    </Suspense>
  );
}
