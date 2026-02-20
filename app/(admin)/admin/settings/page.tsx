"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
  const [selectedTab, setSelectedTab] = useState("general");
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || {});
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      // Convert grouped settings back to flat array
      const settingsArray = Object.values(settings).flat();
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (response.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function seedSettings() {
    if (!confirm("Initialize default settings? This will only work if no settings exist.")) {
      return;
    }

    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Default settings initialized!");
        fetchSettings();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to initialize settings");
      }
    } catch (error) {
      console.error("Failed to seed settings:", error);
      alert("Failed to initialize settings");
    }
  }

  function getSettingValue(category: string, key: string, defaultValue: any = "") {
    const categorySettings = settings[category];
    if (!categorySettings) return defaultValue;
    const setting = categorySettings.find((s: any) => s.key === key);
    return setting?.value ?? defaultValue;
  }

  function updateSettingValue(category: string, key: string, value: any) {
    setSettings((prev: any) => {
      const categorySettings = prev[category] || [];
      const settingIndex = categorySettings.findIndex((s: any) => s.key === key);

      if (settingIndex >= 0) {
        const updated = [...categorySettings];
        updated[settingIndex] = { ...updated[settingIndex], value };
        return { ...prev, [category]: updated };
      }
      return prev;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={seedSettings}>Initialize Defaults</Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
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
        </div>
      </div>

      {/* General Settings */}
      {selectedTab === "general" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Platform Information</h3>
            <div className="space-y-4">
              <Input
                label="Company Name"
                value={getSettingValue("General", "company_name", "Fizmo Trading")}
                onChange={(e) => updateSettingValue("General", "company_name", e.target.value)}
              />
              <Input
                label="Platform Name"
                value={getSettingValue("General", "platform_name", "Fizmo")}
                onChange={(e) => updateSettingValue("General", "platform_name", e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Zone</label>
                <select
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  value={getSettingValue("General", "timezone", "UTC")}
                  onChange={(e) => updateSettingValue("General", "timezone", e.target.value)}
                >
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="EST">EST (GMT-5)</option>
                  <option value="PST">PST (GMT-8)</option>
                  <option value="CET">CET (GMT+1)</option>
                  <option value="JST">JST (GMT+9)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default Language</label>
                <select
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  value={getSettingValue("General", "default_language", "en")}
                  onChange={(e) => updateSettingValue("General", "default_language", e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
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
              <Input
                label="Default Leverage"
                type="number"
                value={getSettingValue("Trading", "default_leverage", 100)}
                onChange={(e) => updateSettingValue("Trading", "default_leverage", parseFloat(e.target.value))}
              />
              <Input
                label="Maximum Leverage"
                type="number"
                value={getSettingValue("Trading", "max_leverage", 500)}
                onChange={(e) => updateSettingValue("Trading", "max_leverage", parseFloat(e.target.value))}
              />
              <Input
                label="Margin Call Level (%)"
                type="number"
                value={getSettingValue("Trading", "margin_call_level", 80)}
                onChange={(e) => updateSettingValue("Trading", "margin_call_level", parseFloat(e.target.value))}
              />
              <Input
                label="Stop Out Level (%)"
                type="number"
                value={getSettingValue("Trading", "stop_out_level", 50)}
                onChange={(e) => updateSettingValue("Trading", "stop_out_level", parseFloat(e.target.value))}
              />
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
              <Input
                label="Minimum Deposit ($)"
                type="number"
                value={getSettingValue("Financial", "min_deposit", 50)}
                onChange={(e) => updateSettingValue("Financial", "min_deposit", parseFloat(e.target.value))}
              />
              <Input
                label="Maximum Deposit ($)"
                type="number"
                value={getSettingValue("Financial", "max_deposit", 50000)}
                onChange={(e) => updateSettingValue("Financial", "max_deposit", parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Withdrawal Settings</h3>
            <div className="space-y-4">
              <Input
                label="Minimum Withdrawal ($)"
                type="number"
                value={getSettingValue("Financial", "min_withdrawal", 10)}
                onChange={(e) => updateSettingValue("Financial", "min_withdrawal", parseFloat(e.target.value))}
              />
              <Input
                label="Withdrawal Fee (%)"
                type="number"
                step="0.1"
                value={getSettingValue("Financial", "withdrawal_fee_percent", 0)}
                onChange={(e) => updateSettingValue("Financial", "withdrawal_fee_percent", parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {selectedTab === "security" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Password Policy</h3>
            <div className="space-y-4">
              <Input
                label="Minimum Password Length"
                type="number"
                value={getSettingValue("Security", "password_min_length", 8)}
                onChange={(e) => updateSettingValue("Security", "password_min_length", parseFloat(e.target.value))}
              />
              <Input
                label="Session Timeout (seconds)"
                type="number"
                value={getSettingValue("Security", "session_timeout", 3600)}
                onChange={(e) => updateSettingValue("Security", "session_timeout", parseFloat(e.target.value))}
              />
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-fizmo-purple-500 rounded"
                    checked={getSettingValue("Security", "require_uppercase", true)}
                    onChange={(e) => updateSettingValue("Security", "require_uppercase", e.target.checked)}
                  />
                  <span className="text-white">Require uppercase letter</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-fizmo-purple-500 rounded"
                    checked={getSettingValue("Security", "require_number", true)}
                    onChange={(e) => updateSettingValue("Security", "require_number", e.target.checked)}
                  />
                  <span className="text-white">Require number</span>
                </label>
              </div>
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={getSettingValue("Compliance", "kyc_required", true)}
                    onChange={(e) => updateSettingValue("Compliance", "kyc_required", e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
                </label>
              </div>
              <Input
                label="KYC Documents Required"
                type="number"
                value={getSettingValue("Compliance", "kyc_documents_required", 2)}
                onChange={(e) => updateSettingValue("Compliance", "kyc_documents_required", parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
