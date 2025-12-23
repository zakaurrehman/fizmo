"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { KYCUpload } from "@/components/dashboard/KYCUpload";

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("personal");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-fizmo flex items-center justify-center">
            <span className="text-white text-3xl font-bold">SC</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">Sarah Connor</h2>
            <p className="text-gray-400 mb-2">sarah.connor@example.com</p>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm font-semibold">
                VERIFIED
              </span>
              <span className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-sm font-semibold">
                VIP
              </span>
            </div>
          </div>
          <Button variant="outline">Change Photo</Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTab("personal")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "personal"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Personal Info
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
            onClick={() => setSelectedTab("preferences")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "preferences"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setSelectedTab("verification")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "verification"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Verification
          </button>
        </div>
      </div>

      {/* Personal Info Tab */}
      {selectedTab === "personal" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Sarah" />
              <Input label="Last Name" defaultValue="Connor" />
              <Input label="Email Address" defaultValue="sarah.connor@example.com" type="email" />
              <Input label="Phone Number" defaultValue="+1 (555) 123-4567" />
              <Input label="Date of Birth" defaultValue="1985-03-15" type="date" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input label="Street Address" defaultValue="1234 Tech Noir St, Suite 500" />
              </div>
              <Input label="City" defaultValue="Los Angeles" />
              <Input label="State/Province" defaultValue="California" />
              <Input label="ZIP/Postal Code" defaultValue="90001" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {selectedTab === "security" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <Input label="Current Password" type="password" />
              <Input label="New Password" type="password" />
              <Input label="Confirm New Password" type="password" />
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-500 text-sm">
                  Password must be at least 8 characters long and contain uppercase, lowercase, and a number.
                </p>
              </div>
              <Button>Update Password</Button>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Two-Factor Authentication (2FA)</h3>
            <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg mb-4">
              <div>
                <p className="text-white font-medium">2FA Status</p>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm">Disabled</span>
                <Button size="sm">Enable 2FA</Button>
              </div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-500 text-sm">
                We strongly recommend enabling 2FA to protect your account from unauthorized access.
              </p>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Active Sessions</h3>
            <div className="space-y-3">
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">Windows • Chrome</p>
                    <p className="text-gray-400 text-sm">Los Angeles, USA • 192.168.1.100</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                    Current Session
                  </span>
                </div>
                <p className="text-gray-500 text-xs">Last active: Just now</p>
              </div>
              <div className="p-4 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white font-medium">iPhone • Safari</p>
                    <p className="text-gray-400 text-sm">Los Angeles, USA • 192.168.1.105</p>
                  </div>
                  <button className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-xs hover:bg-red-500/30">
                    Revoke
                  </button>
                </div>
                <p className="text-gray-500 text-xs">Last active: 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {selectedTab === "preferences" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>PST (GMT-8)</option>
                  <option>EST (GMT-5)</option>
                  <option>UTC (GMT+0)</option>
                  <option>CET (GMT+1)</option>
                  <option>JST (GMT+9)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency Display</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-gray-400 text-sm">Receive updates about your account via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Trade Notifications</p>
                  <p className="text-gray-400 text-sm">Alerts when your trades are executed</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Deposit/Withdrawal Notifications</p>
                  <p className="text-gray-400 text-sm">Updates on your financial transactions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Marketing Communications</p>
                  <p className="text-gray-400 text-sm">Promotions, news, and updates from Fizmo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Trading Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Leverage</label>
                <select className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
                  <option>1:50</option>
                  <option>1:100</option>
                  <option>1:200</option>
                  <option>1:500</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">Confirm Trades</p>
                  <p className="text-gray-400 text-sm">Require confirmation before executing trades</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Tab */}
      {selectedTab === "verification" && <KYCUpload />}
    </div>
  );
}
