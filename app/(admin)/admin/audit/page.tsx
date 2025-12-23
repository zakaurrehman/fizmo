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
      const response = await fetch(`/api/admin/audit?category=${selectedFilter}`);
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

  // Fallback mock audit log data for non-financial events
  const mockAuditLogs = [
    {
      id: "1",
      timestamp: "2024-12-21 14:35:22",
      user: "admin@fizmo.com",
      userId: "USR-10001",
      action: "CLIENT_STATUS_CHANGE",
      entity: "Client",
      entityId: "CL-100237",
      details: "Changed client status from ACTIVE to SUSPENDED",
      ipAddress: "192.168.1.50",
      severity: "HIGH",
      category: "ACCOUNT_MANAGEMENT",
    },
    {
      id: "2",
      timestamp: "2024-12-21 14:30:15",
      user: "sarah.connor@example.com",
      userId: "CL-100234",
      action: "LOGIN_SUCCESS",
      entity: "Session",
      entityId: "SES-45820",
      details: "User logged in successfully",
      ipAddress: "192.168.1.100",
      severity: "INFO",
      category: "AUTHENTICATION",
    },
    {
      id: "3",
      timestamp: "2024-12-21 14:25:48",
      user: "compliance@fizmo.com",
      userId: "USR-10003",
      action: "KYC_APPROVED",
      entity: "KYC Document",
      entityId: "KYC-88245",
      details: "Approved Government ID for client CL-100245",
      ipAddress: "192.168.1.55",
      severity: "MEDIUM",
      category: "COMPLIANCE",
    },
    {
      id: "4",
      timestamp: "2024-12-21 14:20:30",
      user: "admin@fizmo.com",
      userId: "USR-10001",
      action: "WITHDRAWAL_APPROVED",
      entity: "Withdrawal",
      entityId: "TX-2024122100146",
      details: "Approved withdrawal of $10,000 for client CL-100235",
      ipAddress: "192.168.1.50",
      severity: "HIGH",
      category: "FINANCIAL",
    },
    {
      id: "5",
      timestamp: "2024-12-21 14:15:12",
      user: "john.wick@example.com",
      userId: "CL-100235",
      action: "DEPOSIT_CREATED",
      entity: "Deposit",
      entityId: "TX-2024122100145",
      details: "Created deposit request for $2,500 via Credit Card",
      ipAddress: "192.168.1.105",
      severity: "MEDIUM",
      category: "FINANCIAL",
    },
    {
      id: "6",
      timestamp: "2024-12-21 14:10:45",
      user: "admin@fizmo.com",
      userId: "USR-10001",
      action: "USER_ROLE_CHANGED",
      entity: "User",
      entityId: "USR-10005",
      details: "Changed user role from CLIENT to ADMIN",
      ipAddress: "192.168.1.50",
      severity: "CRITICAL",
      category: "SECURITY",
    },
    {
      id: "7",
      timestamp: "2024-12-21 14:05:20",
      user: "system",
      userId: "SYSTEM",
      action: "PASSWORD_RESET",
      entity: "User",
      entityId: "CL-100236",
      details: "Password reset link sent to ellen.ripley@example.com",
      ipAddress: "N/A",
      severity: "MEDIUM",
      category: "AUTHENTICATION",
    },
    {
      id: "8",
      timestamp: "2024-12-21 14:00:05",
      user: "admin@fizmo.com",
      userId: "USR-10001",
      action: "ACCOUNT_CREATED",
      entity: "Trading Account",
      entityId: "MT5-100240",
      details: "Created new MT5 Live account for client CL-100240",
      ipAddress: "192.168.1.50",
      severity: "MEDIUM",
      category: "ACCOUNT_MANAGEMENT",
    },
    {
      id: "9",
      timestamp: "2024-12-21 13:55:30",
      user: "unknown",
      userId: "N/A",
      action: "LOGIN_FAILED",
      entity: "Session",
      entityId: "N/A",
      details: "Failed login attempt for email: hacker@malicious.com (Invalid credentials)",
      ipAddress: "45.142.214.85",
      severity: "HIGH",
      category: "SECURITY",
    },
    {
      id: "10",
      timestamp: "2024-12-21 13:50:15",
      user: "compliance@fizmo.com",
      userId: "USR-10003",
      action: "SAR_FILED",
      entity: "Compliance Report",
      entityId: "SAR-2024-008",
      details: "Filed Suspicious Activity Report for client CL-100248",
      ipAddress: "192.168.1.55",
      severity: "CRITICAL",
      category: "COMPLIANCE",
    },
  ];

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
          <Button variant="outline">Export Logs</Button>
          <Button>Advanced Search</Button>
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
          <Button variant="outline">Clear Filters</Button>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-fizmo-purple-500/20">
          <p className="text-gray-400 text-sm">
            Showing {filteredLogs.length} of {data?.total || 0} events
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
              Previous
            </button>
            <button className="px-3 py-1 bg-fizmo-purple-500 text-white rounded">1</button>
            <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
              2
            </button>
            <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
              3
            </button>
            <button className="px-3 py-1 bg-fizmo-dark-800 text-white rounded hover:bg-fizmo-dark-700">
              Next
            </button>
          </div>
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
          <h3 className="text-xl font-bold text-white mb-4">Security Alerts (24h)</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-red-500 font-semibold text-sm">Multiple Failed Logins</span>
                <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs">CRITICAL</span>
              </div>
              <p className="text-gray-400 text-xs">
                5 failed login attempts from IP 45.142.214.85 in 10 minutes
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-yellow-500 font-semibold text-sm">Unusual Access Pattern</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs">HIGH</span>
              </div>
              <p className="text-gray-400 text-xs">
                Admin user accessed system from new location (Moscow, Russia)
              </p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-yellow-500 font-semibold text-sm">Permission Escalation</span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded text-xs">HIGH</span>
              </div>
              <p className="text-gray-400 text-xs">
                User role changed from CLIENT to ADMIN for USR-10005
              </p>
            </div>
          </div>
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
