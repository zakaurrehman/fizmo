"use client";

import { useState, useEffect } from "react";

export default function RateSettingPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings || []);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Rate Setting</h1>
        <p className="text-gray-400">Configure system rate and fee settings</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading settings...</div>
        ) : settings.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No settings found</div>
        ) : (
          <div className="space-y-4">
            {settings.map((setting: any) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg border border-fizmo-purple-500/20"
              >
                <div>
                  <p className="text-white font-medium text-sm">{setting.key}</p>
                </div>
                <div>
                  <p className="text-fizmo-purple-400 font-mono text-sm">{setting.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
