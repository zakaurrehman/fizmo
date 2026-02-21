"use client";

import { useState, useEffect } from "react";

export default function LoginActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/audit", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Login Activity</h1>
        <p className="text-gray-400">View all user login and activity audit logs</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No activity logs found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTION</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">USER</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ENTITY</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr
                    key={log.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-500">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white text-sm">{log.user}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{log.entity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
