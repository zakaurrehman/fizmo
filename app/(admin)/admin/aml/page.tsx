"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminAMLPage() {
  const [selectedTab, setSelectedTab] = useState("high-risk");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAMLData();
  }, []);

  async function fetchAMLData() {
    try {
      const response = await fetch("/api/admin/aml");
      if (response.ok) {
        const amlData = await response.json();
        setData(amlData);
      }
    } catch (error) {
      console.error("Failed to fetch AML data:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AML Monitoring</h1>
          <p className="text-gray-400">
            Anti-Money Laundering compliance monitoring and alerts
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Generate SAR Report</Button>
          <Button>Run Screening</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">High Risk Alerts</p>
          <p className="text-2xl font-bold text-red-500">
            {loading ? "..." : data?.statistics.highRiskAlerts || 0}
          </p>
          <p className="text-gray-400 text-sm">Requires action</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Medium Risk</p>
          <p className="text-2xl font-bold text-yellow-500">
            {loading ? "..." : data?.statistics.mediumRiskAlerts || 0}
          </p>
          <p className="text-gray-400 text-sm">Under review</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending Screening</p>
          <p className="text-2xl font-bold text-blue-500">
            {loading ? "..." : data?.statistics.pendingScreening || 0}
          </p>
          <p className="text-gray-400 text-sm">In queue</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Alerts (30d)</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : data?.statistics.totalAlerts || 0}
          </p>
          <p className="text-gray-400 text-sm">All alerts</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Low Risk</p>
          <p className="text-2xl font-bold text-green-500">
            {loading ? "..." : data?.statistics.lowRiskAlerts || 0}
          </p>
          <p className="text-gray-400 text-sm">Minimal concern</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab("high-risk")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "high-risk"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              High Risk ({data?.statistics.highRiskAlerts || 0})
            </button>
            <button
              onClick={() => setSelectedTab("all-alerts")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "all-alerts"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setSelectedTab("sanctions")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "sanctions"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Sanctions Screening
            </button>
            <button
              onClick={() => setSelectedTab("cleared")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "cleared"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Cleared
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white text-sm">
              <option>All Alert Types</option>
              <option>Large Transaction</option>
              <option>Pattern Matching</option>
              <option>Geographic Risk</option>
              <option>Rapid Turnover</option>
            </select>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* AML Alerts Table */}
      {(selectedTab === "high-risk" || selectedTab === "all-alerts") && (
        <div className="glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">AML Alerts</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">FLAGGED</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">RISK LEVEL</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ALERT TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DESCRIPTION</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      Loading alerts...
                    </td>
                  </tr>
                ) : !data?.alerts || data.alerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No AML alerts found
                    </td>
                  </tr>
                ) : (
                  data.alerts
                    .filter((alert: any) =>
                      selectedTab === "high-risk" ? alert.riskLevel === "HIGH" : true
                    )
                    .map((alert: any) => (
                    <tr
                      key={alert.id}
                      className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                    >
                      <td className="py-3 px-4 text-white text-sm">
                        {new Date(alert.flaggedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <p className="text-white font-medium">{alert.clientName}</p>
                        <p className="text-gray-400 text-xs">{alert.clientId}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            alert.riskLevel === "HIGH"
                              ? "bg-red-500/20 text-red-500"
                              : alert.riskLevel === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : "bg-green-500/20 text-green-500"
                          }`}
                        >
                          {alert.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{alert.alertType}</td>
                      <td className="py-3 px-4 text-white font-semibold text-sm">
                        {alert.currency} {alert.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm max-w-xs truncate">
                        {alert.description}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            alert.status === "ESCALATED"
                              ? "bg-red-500/20 text-red-500"
                              : alert.status === "UNDER_REVIEW"
                              ? "bg-blue-500/20 text-blue-500"
                              : alert.status === "CLEARED"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {alert.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded hover:bg-fizmo-purple-500/30 text-xs">
                            Investigate
                          </button>
                          {alert.status === "UNDER_REVIEW" && (
                            <button className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 text-xs">
                              Clear
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Warning Banner */}
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-500 text-sm">
              <strong>Regulatory Compliance:</strong> All high-risk alerts must be investigated
              within 24 hours. Suspicious Activity Reports (SARs) must be filed within 30 days
              of detection per FinCEN requirements.
            </p>
          </div>
        </div>
      )}

      {/* Sanctions Screening Table */}
      {selectedTab === "sanctions" && (
        <div className="glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Sanctions Screening Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">SCREENED AT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">MATCH TYPE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">LIST SOURCE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    <p className="mb-2">Sanctions screening requires integration with a compliance provider</p>
                    <p className="text-xs text-gray-500">Integrate with OFAC, WorldCheck, or EU Sanctions API to enable real-time screening</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-500 text-sm">
              <strong>Screening Sources:</strong> OFAC SDN List, EU Sanctions List, UN
              Consolidated List, UK HM Treasury List. Auto-screening runs daily at 02:00 UTC.
            </p>
          </div>
        </div>
      )}

      {/* Risk Assessment Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Risk Score Distribution</h3>
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">High Risk</span>
                  <span className="text-red-500 font-semibold">
                    {data?.riskDistribution.highRisk} clients (
                    {((data?.riskDistribution.highRisk / data?.riskDistribution.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(data?.riskDistribution.highRisk / data?.riskDistribution.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Medium Risk</span>
                  <span className="text-yellow-500 font-semibold">
                    {data?.riskDistribution.mediumRisk} clients (
                    {((data?.riskDistribution.mediumRisk / data?.riskDistribution.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${(data?.riskDistribution.mediumRisk / data?.riskDistribution.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Low Risk</span>
                  <span className="text-green-500 font-semibold">
                    {data?.riskDistribution.lowRisk} clients (
                    {((data?.riskDistribution.lowRisk / data?.riskDistribution.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${(data?.riskDistribution.lowRisk / data?.riskDistribution.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Compliance Actions</h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : data?.alerts && data.alerts.filter((a: any) => a.status === "ESCALATED" || a.status === "CLEARED").length > 0 ? (
              data.alerts
                .filter((a: any) => a.status === "ESCALATED" || a.status === "CLEARED")
                .slice(0, 5)
                .map((alert: any) => (
                  <div key={alert.id} className="p-3 bg-fizmo-dark-800 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-white text-sm font-semibold">{alert.alertType}</span>
                      <span className="text-xs text-gray-400">{new Date(alert.flaggedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{alert.clientName} - {alert.description}</p>
                  </div>
                ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">No compliance actions recorded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
