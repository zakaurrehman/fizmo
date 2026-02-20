"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminAuditPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedFilter]);

  async function fetchAuditLogs() {
    setLoading(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/admin/audit?category=${selectedFilter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const auditData = await response.json();
        setData(auditData);
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleExportLogs() {
    const headers = ["Timestamp", "User", "User ID", "Action", "Entity", "Entity ID", "Details", "IP Address", "Severity"];
    const rows = filteredLogs.map((log: any) => [
      new Date(log.timestamp).toLocaleString(),
      log.user || "",
      log.userId || "",
      log.action || "",
      log.entity || "",
      log.entityId || "",
      (log.details || "").replace(/,/g, ";"),
      log.ipAddress || "",
      log.severity || "",
    ]);
    const csv = [headers, ...rows].map((r: any[]) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedFilter("all");
  }

  const auditLogs = data?.logs || [];

  const filteredLogs = auditLogs.filter((log: any) => {
    if (searchTerm && !JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-gray-400">Complete system activity and security audit trail</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExportLogs}>Export Logs</Button>
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Events (24h)</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : data?.stats.totalEvents24h || 0}
          </p>
          <p className="text-gray-400 text-sm">All activities</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Critical Events</p>
          <p className="text-2xl font-bold text-red-500">
            {loading ? "..." : data?.stats.criticalEvents || 0}
          </p>
          <p className="text-gray-400 text-sm">Requires review</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">High Severity</p>
          <p className="text-2xl font-bold text-yellow-500">
            {loading ? "..." : data?.stats.highEvents || 0}
          </p>
          <p className="text-gray-400 text-sm">Important events</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Medium Severity</p>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : data?.stats.mediumEvents || 0}
          </p>
          <p className="text-gray-400 text-sm">Normal activity</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Financial Events</p>
          <p className="text-2xl font-bold text-blue-500">
            {loading ? "..." : data?.stats.financialActions || 0}
          </p>
          <p className="text-gray-400 text-sm">Transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search logs by user, action, entity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Severity</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Info</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Users</option>
            <option>Admin Users</option>
            <option>Clients</option>
            <option>System</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "all"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setSelectedFilter("AUTHENTICATION")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "AUTHENTICATION"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setSelectedFilter("FINANCIAL")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "FINANCIAL"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Financial
          </button>
          <button
            onClick={() => setSelectedFilter("ACCOUNT_MANAGEMENT")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "ACCOUNT_MANAGEMENT"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Account Management
          </button>
          <button
            onClick={() => setSelectedFilter("COMPLIANCE")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "COMPLIANCE"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Compliance
          </button>
          <button
            onClick={() => setSelectedFilter("SECURITY")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "SECURITY"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">TIMESTAMP</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">USER</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTION</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">ENTITY</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">DETAILS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">IP ADDRESS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">SEVERITY</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: any) => (
                  <tr
                    key={log.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  <td className="py-3 px-4 text-sm">
                    <p className="text-white font-medium">{log.user}</p>
                    <p className="text-gray-400 text-xs">{log.userId}</p>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-xs font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <p className="text-white">{log.entity}</p>
                    <p className="text-gray-400 text-xs font-mono">{log.entityId}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm font-mono">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        log.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-500"
                          : log.severity === "HIGH"
                          ? "bg-orange-500/20 text-orange-500"
                          : log.severity === "MEDIUM"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300">
                      Details
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="mt-6 pt-4 border-t border-fizmo-purple-500/20">
          <p className="text-gray-400 text-sm">
            Showing {filteredLogs.length} of {data?.total || 0} events
          </p>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Actions</h3>
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : (
            <div className="space-y-3">
              {data?.topActions?.slice(0, 5).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{item.action}</p>
                    <p className="text-gray-400 text-xs">System activity</p>
                  </div>
                  <span className="text-white font-bold">{item.count}</span>
                </div>
              )) || (
                <p className="text-gray-400 text-center">No data available</p>
              )}
            </div>
          )}
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Critical & High Events</h3>
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : (
            <div className="space-y-3">
              {auditLogs
                .filter((log: any) => log.severity === "CRITICAL" || log.severity === "HIGH")
                .slice(0, 5)
                .map((log: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      log.severity === "CRITICAL"
                        ? "bg-red-500/10 border-red-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-semibold text-sm ${
                          log.severity === "CRITICAL" ? "text-red-500" : "text-yellow-500"
                        }`}
                      >
                        {log.action}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          log.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{log.details}</p>
                  </div>
                ))}
              {auditLogs.filter((log: any) => log.severity === "CRITICAL" || log.severity === "HIGH").length === 0 && (
                <p className="text-gray-400 text-center py-4">No critical or high severity events</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-500 text-xl">ℹ️</span>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Audit Log Retention Policy</h4>
            <p className="text-gray-400 text-sm">
              All audit logs are retained for a minimum of 7 years in compliance with regulatory requirements.
              Logs are immutable and cryptographically signed to ensure integrity. Critical events trigger
              automatic alerts to compliance team. Unauthorized access or modification attempts are logged
              and reported immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
