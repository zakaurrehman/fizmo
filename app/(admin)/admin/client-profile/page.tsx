"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminClientProfilePage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock client data
  const client = {
    clientId: "CL-100234",
    firstName: "Sarah",
    lastName: "Connor",
    email: "sarah.connor@example.com",
    phone: "+1 (555) 123-4567",
    country: "United States",
    city: "Los Angeles",
    address: "1234 Tech Noir St, Suite 500",
    zipCode: "90001",
    dateOfBirth: "1985-03-15",
    status: "ACTIVE",
    kycStatus: "APPROVED",
    joinDate: "2024-01-15",
    lastLogin: "2024-12-21 14:30",
    ipAddress: "192.168.1.100",
    riskScore: 2.5,
    totalDeposits: 45000.0,
    totalWithdrawals: 12500.0,
    netDeposit: 32500.0,
    currentBalance: 15420.5,
    totalVolume: 2850000.0,
    labels: ["VIP", "High Volume"],
  };

  const accounts = [
    {
      accountId: "MT5-100234",
      type: "LIVE",
      platform: "MT5",
      balance: 10500.5,
      equity: 10625.75,
      leverage: 100,
      status: "ACTIVE",
      createdAt: "2024-01-15",
    },
    {
      accountId: "MT5-100235",
      type: "DEMO",
      platform: "MT5",
      balance: 50000.0,
      equity: 51250.8,
      leverage: 100,
      status: "ACTIVE",
      createdAt: "2024-02-01",
    },
  ];

  const transactions = [
    {
      id: "1",
      type: "DEPOSIT",
      amount: 2500.0,
      method: "Credit Card",
      status: "COMPLETED",
      date: "2024-12-21 10:42",
    },
    {
      id: "2",
      type: "WITHDRAWAL",
      amount: 300.0,
      method: "Bank Transfer",
      status: "COMPLETED",
      date: "2024-12-20 16:45",
    },
    {
      id: "3",
      type: "DEPOSIT",
      amount: 5000.0,
      method: "Cryptocurrency",
      status: "COMPLETED",
      date: "2024-12-18 09:15",
    },
  ];

  const kycDocuments = [
    {
      id: "1",
      type: "Government ID",
      status: "APPROVED",
      uploadedAt: "2024-01-15 14:20",
      reviewedBy: "Admin User",
    },
    {
      id: "2",
      type: "Proof of Address",
      status: "APPROVED",
      uploadedAt: "2024-01-15 14:25",
      reviewedBy: "Admin User",
    },
    {
      id: "3",
      type: "Selfie Verification",
      status: "APPROVED",
      uploadedAt: "2024-01-15 14:30",
      reviewedBy: "Admin User",
    },
  ];

  const activityLog = [
    { id: "1", action: "Login", details: "Successful login from 192.168.1.100", timestamp: "2024-12-21 14:30" },
    { id: "2", action: "Deposit", details: "Deposited $2,500 via Credit Card", timestamp: "2024-12-21 10:42" },
    { id: "3", action: "Trade Opened", details: "EUR/USD Long 0.5 lots", timestamp: "2024-12-21 09:15" },
    { id: "4", action: "Withdrawal", details: "Withdrew $300 via Bank Transfer", timestamp: "2024-12-20 16:45" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {client.firstName} {client.lastName}
            </h1>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm font-semibold">
              {client.status}
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm font-semibold">
              KYC: {client.kycStatus}
            </span>
          </div>
          <p className="text-gray-400">{client.clientId} • Joined {client.joinDate}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Send Email</Button>
          <Button variant="outline">Edit Client</Button>
          <Button>Manage Account</Button>
        </div>
      </div>

      {/* Client Labels */}
      <div className="glassmorphic rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Labels:</span>
          {client.labels.map((label, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-sm"
            >
              {label}
            </span>
          ))}
          <button className="px-3 py-1 border border-fizmo-purple-500/30 text-fizmo-purple-400 rounded text-sm hover:bg-fizmo-purple-500/10">
            + Add Label
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "overview"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab("accounts")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "accounts"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Accounts
          </button>
          <button
            onClick={() => setSelectedTab("transactions")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "transactions"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setSelectedTab("kyc")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "kyc"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            KYC Documents
          </button>
          <button
            onClick={() => setSelectedTab("activity")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "activity"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Activity Log
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-white">${client.currentBalance.toLocaleString()}</p>
              <p className="text-green-500 text-sm">Across all accounts</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Net Deposit</p>
              <p className="text-2xl font-bold text-green-500">${client.netDeposit.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">Lifetime</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-white">${(client.totalVolume / 1000000).toFixed(2)}M</p>
              <p className="text-gray-400 text-sm">Trading volume</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Risk Score</p>
              <p className="text-2xl font-bold text-green-500">{client.riskScore}/10</p>
              <p className="text-gray-400 text-sm">Low risk</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name</span>
                  <span className="text-white font-medium">
                    {client.firstName} {client.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white font-medium">{client.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-white font-medium">{client.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date of Birth</span>
                  <span className="text-white font-medium">{client.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country</span>
                  <span className="text-white font-medium">{client.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="text-white font-medium text-right">{client.address}</span>
                </div>
              </div>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Client ID</span>
                  <span className="text-fizmo-purple-400 font-mono">{client.clientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Join Date</span>
                  <span className="text-white font-medium">{client.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Login</span>
                  <span className="text-white font-medium">{client.lastLogin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span className="text-white font-mono">{client.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                    {client.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                    {client.kycStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Financial Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Deposits</p>
                <p className="text-2xl font-bold text-green-500">${client.totalDeposits.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-500">${client.totalWithdrawals.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Net Position</p>
                <p className="text-2xl font-bold text-white">${client.netDeposit.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accounts Tab */}
      {selectedTab === "accounts" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trading Accounts</h3>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.accountId} className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-fizmo-purple-400 font-mono font-bold">
                      {account.accountId}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      account.type === "LIVE"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {account.type}
                    </span>
                    <span className="text-white font-semibold">{account.platform}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-xs hover:bg-fizmo-purple-500/30">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30">
                      Manage
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Balance</p>
                    <p className="text-white font-bold">${account.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Equity</p>
                    <p className="text-green-500 font-bold">${account.equity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Leverage</p>
                    <p className="text-white font-bold">1:{account.leverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Created</p>
                    <p className="text-white">{account.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {selectedTab === "transactions" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">METHOD</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-fizmo-purple-500/10">
                    <td className="py-3 px-4 text-white text-sm">{tx.date}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.type === "DEPOSIT"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-red-500/20 text-red-500"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">${tx.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{tx.method}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300 text-sm">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KYC Documents Tab */}
      {selectedTab === "kyc" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">KYC Documents</h3>
          <div className="space-y-3">
            {kycDocuments.map((doc) => (
              <div key={doc.id} className="p-4 bg-fizmo-dark-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{doc.type}</p>
                  <p className="text-gray-400 text-sm">
                    Uploaded: {doc.uploadedAt} • Reviewed by: {doc.reviewedBy}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm">
                    {doc.status}
                  </span>
                  <button className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-sm hover:bg-fizmo-purple-500/30">
                    View Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log Tab */}
      {selectedTab === "activity" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Activity Log</h3>
          <div className="space-y-3">
            {activityLog.map((activity) => (
              <div key={activity.id} className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.details}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
