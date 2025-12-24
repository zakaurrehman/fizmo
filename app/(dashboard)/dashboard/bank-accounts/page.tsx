"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaUniversity, FaCheckCircle, FaTimesCircle, FaTrash, FaStar } from "react-icons/fa";

interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string | null;
  swiftCode: string | null;
  iban: string | null;
  country: string;
  currency: string;
  isVerified: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export default function BankAccountsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    iban: "",
    country: "",
    currency: "USD",
    isPrimary: false,
  });

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  async function fetchBankAccounts() {
    try {
      const response = await fetch("/api/bank-accounts");
      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data.bankAccounts || []);
      }
    } catch (error) {
      console.error("Failed to fetch bank accounts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBankAccount() {
    if (
      !formData.bankName ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.country
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Bank account added successfully! Awaiting admin verification.");
        setFormData({
          bankName: "",
          accountHolderName: "",
          accountNumber: "",
          routingNumber: "",
          swiftCode: "",
          iban: "",
          country: "",
          currency: "USD",
          isPrimary: false,
        });
        setShowAddForm(false);
        await fetchBankAccounts();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add bank account");
      }
    } catch (error) {
      console.error("Failed to add bank account:", error);
      alert("Failed to add bank account");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteBankAccount(id: string) {
    if (!confirm("Are you sure you want to delete this bank account?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bank-accounts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Bank account deleted successfully");
        await fetchBankAccounts();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete bank account");
      }
    } catch (error) {
      console.error("Failed to delete bank account:", error);
      alert("Failed to delete bank account");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bank Accounts</h1>
          <p className="text-gray-400">Manage your bank accounts for deposits and withdrawals</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Bank Account"}
        </Button>
      </div>

      {/* Add Bank Account Form */}
      {showAddForm && (
        <div className="glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add New Bank Account</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bank Name *"
              placeholder="e.g., Chase Bank"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            />
            <Input
              label="Account Holder Name *"
              placeholder="Full name as per bank records"
              value={formData.accountHolderName}
              onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            />
            <Input
              label="Account Number *"
              placeholder="1234567890"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            />
            <Input
              label="Routing Number (US)"
              placeholder="021000021"
              value={formData.routingNumber}
              onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
            />
            <Input
              label="SWIFT/BIC Code (International)"
              placeholder="CHASUS33"
              value={formData.swiftCode}
              onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
            />
            <Input
              label="IBAN (European)"
              placeholder="GB29NWBK60161331926819"
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            />
            <Input
              label="Country *"
              placeholder="United States"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
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
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrimary}
                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-white">Set as primary account</span>
            </label>
          </div>

          <div className="mt-6 flex space-x-4">
            <Button onClick={handleAddBankAccount} loading={submitting} className="flex-1">
              Add Bank Account
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            * Required fields. Bank account must be verified by admin before you can use it for
            withdrawals.
          </p>
        </div>
      )}

      {/* Bank Accounts List */}
      <div className="glassmorphic rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Bank Accounts</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : bankAccounts.length === 0 ? (
          <div className="text-center py-8">
            <FaUniversity className="text-5xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bank accounts added yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Add a bank account to enable bank transfer deposits and withdrawals
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="bg-fizmo-dark-800 rounded-lg p-4 border border-fizmo-purple-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUniversity className="text-fizmo-purple-400" />
                      <h3 className="text-lg font-bold text-white">{account.bankName}</h3>
                      {account.isPrimary && (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs">
                          <FaStar className="text-xs" />
                          <span>Primary</span>
                        </span>
                      )}
                      {account.isVerified ? (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                          <FaCheckCircle />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs">
                          <FaTimesCircle />
                          <span>Pending Verification</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                      <div>
                        <p className="text-gray-400">Account Holder</p>
                        <p className="text-white font-medium">{account.accountHolderName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Account Number</p>
                        <p className="text-white font-medium font-mono">
                          ****{account.accountNumber.slice(-4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Country</p>
                        <p className="text-white font-medium">{account.country}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Currency</p>
                        <p className="text-white font-medium">{account.currency}</p>
                      </div>
                      {account.routingNumber && (
                        <div>
                          <p className="text-gray-400">Routing Number</p>
                          <p className="text-white font-medium font-mono">{account.routingNumber}</p>
                        </div>
                      )}
                      {account.swiftCode && (
                        <div>
                          <p className="text-gray-400">SWIFT Code</p>
                          <p className="text-white font-medium font-mono">{account.swiftCode}</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Added on {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteBankAccount(account.id)}
                    className="ml-4 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-500"
                    title="Delete bank account"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-3">Important Information</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Bank accounts must be verified by our admin team before you can use them for withdrawals</li>
          <li>Account holder name must match your registered name on the platform</li>
          <li>You can add multiple bank accounts but only one can be set as primary</li>
          <li>Ensure all banking details are accurate to avoid delays in processing</li>
          <li>International transfers require SWIFT/BIC code</li>
          <li>European transfers require IBAN</li>
        </ul>
      </div>
    </div>
  );
}
