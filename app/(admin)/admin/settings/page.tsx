"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
  const [selectedTab, setSelectedTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save All Changes</Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTab("general")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "general"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setSelectedTab("trading")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "trading"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Trading
          </button>
          <button
            onClick={() => setSelectedTab("financial")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "financial"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Financial
          </button>
          <button
            onClick={() => setSelectedTab("security")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "security"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setSelectedTab("compliance")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "compliance"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Compliance
          </button>
          <button
            onClick={() => setSelectedTab("notifications")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "notifications"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setSelectedTab("integrations")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "integrations"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Integrations
          </button>
        </div>
      </div>

      {/* General Settings */}
      {selectedTab === "general" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Platform Information</h3>
            <div className="space-y-4">
              <Input label="Company Name" defaultValue="Fizmo Trading" />
              <Input label="Platform Name" defaultValue="Fizmo" />
              <Input label="Support Email" defaultValue="support@fizmo.com" type="email" />
              <Input label="Support Phone" defaultValue="+1 (555) 123-4567" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>UTC (GMT+0)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                  <option>CET (GMT+1)</option>
                  <option>JST (GMT+9)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Language</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Maintenance Mode</h3>
            <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
              <div>
                <p className="text-white font-medium">Enable Maintenance Mode</p>
                <p className="text-gray-400 text-sm">Temporarily disable client access for system updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Trading Settings */}
      {selectedTab === "trading" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Default Trading Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Leverage Options</label>
                <div className="grid grid-cols-4 gap-3">
                  {[50, 100, 200, 500].map((lev) => (
                    <label key={lev} className="flex items-center space-x-2 p-3 bg-fizmo-dark-800 rounded-lg cursor-pointer hover:bg-fizmo-dark-700">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-fizmo-purple-500 rounded" />
                      <span className="text-white">1:{lev}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Input label="Minimum Trade Size (Lots)" defaultValue="0.01" type="number" step="0.01" />
              <Input label="Maximum Trade Size (Lots)" defaultValue="100" type="number" />
              <Input label="Maximum Open Positions" defaultValue="200" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Margin Call Level (%)</label>
                <Input defaultValue="100" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stop Out Level (%)</label>
                <Input defaultValue="50" type="number" />
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Trading Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">24/7 Trading</p>
                  <p className="text-gray-400 text-sm">Allow trading at all times (crypto markets)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Weekend Trading</p>
                  <p className="text-gray-400 text-sm">Allow trading on weekends</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Settings */}
      {selectedTab === "financial" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Deposit Settings</h3>
            <div className="space-y-4">
              <Input label="Minimum Deposit (USD)" defaultValue="50" type="number" />
              <Input label="Maximum Deposit (USD)" defaultValue="100000" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Fee (%)</label>
                <Input defaultValue="2.0" type="number" step="0.1" />
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Auto-Approve Small Deposits</p>
                  <p className="text-gray-400 text-sm">Automatically approve deposits under $1,000</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Withdrawal Settings</h3>
            <div className="space-y-4">
              <Input label="Minimum Withdrawal (USD)" defaultValue="50" type="number" />
              <Input label="Maximum Daily Withdrawal (USD)" defaultValue="10000" type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Fee (USD)</label>
                <Input defaultValue="25" type="number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Processing Time (Business Days)</label>
                <Input defaultValue="1-3" />
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Require Admin Approval</p>
                  <p className="text-gray-400 text-sm">All withdrawals require manual approval</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Commission Settings</h3>
            <div className="space-y-4">
              <Input label="Default Commission per Lot (USD)" defaultValue="7.0" type="number" step="0.1" />
              <Input label="IB Commission Share (%)" defaultValue="30" type="number" />
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {selectedTab === "security" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Authentication</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Require 2FA for Admin Users</p>
                  <p className="text-gray-400 text-sm">Enforce two-factor authentication for all admin accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Require 2FA for Large Withdrawals</p>
                  <p className="text-gray-400 text-sm">Require 2FA for withdrawals over $5,000</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Password Policy</h3>
            <div className="space-y-4">
              <Input label="Minimum Password Length" defaultValue="8" type="number" />
              <Input label="Password Expiry (Days)" defaultValue="90" type="number" />
              <Input label="Max Failed Login Attempts" defaultValue="5" type="number" />
              <Input label="Account Lockout Duration (Minutes)" defaultValue="30" type="number" />
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-fizmo-purple-500 rounded" />
                  <span className="text-white">Require uppercase letter</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-fizmo-purple-500 rounded" />
                  <span className="text-white">Require lowercase letter</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-fizmo-purple-500 rounded" />
                  <span className="text-white">Require number</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-fizmo-purple-500 rounded" />
                  <span className="text-white">Require special character</span>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">IP Whitelisting</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable IP Whitelist for Admin Panel</p>
                  <p className="text-gray-400 text-sm">Restrict admin access to specific IP addresses</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <Input label="Allowed IP Addresses (comma-separated)" placeholder="192.168.1.0/24, 10.0.0.1" />
            </div>
          </div>
        </div>
      )}

      {/* Compliance Settings */}
      {selectedTab === "compliance" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">KYC Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Mandatory KYC for All Clients</p>
                  <p className="text-gray-400 text-sm">Require KYC verification before trading</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enhanced Due Diligence for High-Value Clients</p>
                  <p className="text-gray-400 text-sm">Require additional verification for deposits over $10,000</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">AML Settings</h3>
            <div className="space-y-4">
              <Input label="Large Transaction Threshold (USD)" defaultValue="10000" type="number" />
              <Input label="Daily Transaction Limit (USD)" defaultValue="50000" type="number" />
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Automatic Sanctions Screening</p>
                    <p className="text-gray-400 text-sm">Screen all clients against sanctions lists daily</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Transaction Pattern Monitoring</p>
                    <p className="text-gray-400 text-sm">Flag suspicious transaction patterns automatically</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Restricted Countries</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Block registrations and trading from specific jurisdictions</p>
              <textarea
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                rows={4}
                placeholder="Enter country codes separated by commas (e.g., US, KP, IR, SY)"
                defaultValue="KP, IR, SY, CU"
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {selectedTab === "notifications" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Email Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <span className="text-white">New Client Registration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <span className="text-white">Deposit Received</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <span className="text-white">Withdrawal Request</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <span className="text-white">Large Transaction Alert</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <span className="text-white">AML/Compliance Alert</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Admin Alert Recipients</h3>
            <Input label="Alert Email Addresses (comma-separated)" placeholder="admin1@fizmo.com, admin2@fizmo.com" />
          </div>
        </div>
      )}

      {/* Integrations Settings */}
      {selectedTab === "integrations" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Trading Platforms</h3>
            <div className="space-y-4">
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                      <span className="text-blue-500 font-bold">MT4</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">MetaTrader 4 Bridge</p>
                      <p className="text-green-500 text-sm">Connected</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <Input label="Server Address" defaultValue="mt4.fizmo.com:443" />
              </div>
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center">
                      <span className="text-purple-500 font-bold">MT5</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">MetaTrader 5 Bridge</p>
                      <p className="text-green-500 text-sm">Connected</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <Input label="Server Address" defaultValue="mt5.fizmo.com:443" />
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Payment Gateways</h3>
            <div className="space-y-4">
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center">
                      <span className="text-green-500">💳</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Stripe</p>
                      <p className="text-green-500 text-sm">Active</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <Input label="API Key" type="password" defaultValue="sk_live_••••••••••••••••" />
              </div>
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded flex items-center justify-center">
                      <span className="text-yellow-500">₿</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Crypto Payment Gateway</p>
                      <p className="text-green-500 text-sm">Active</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                <Input label="Wallet Address" defaultValue="bc1q••••••••••••••••••••••••••••" />
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">KYC Provider</h3>
            <div className="p-4 bg-fizmo-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                    <span className="text-blue-500">🔐</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Jumio Identity Verification</p>
                    <p className="text-green-500 text-sm">Active</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
              <Input label="API Token" type="password" defaultValue="••••••••••••••••••••••••" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
