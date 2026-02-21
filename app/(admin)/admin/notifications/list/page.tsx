"use client";

import { useState, useEffect } from "react";

export default function NotificationListPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem("fizmo_token");
        const response = await fetch("/api/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Notification List</h1>
        <p className="text-gray-400">View all system notifications</p>
      </div>
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No notifications found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">DATE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TITLE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">MESSAGE</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">READ</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification: any) => (
                  <tr
                    key={notification.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">
                      {new Date(notification.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white font-medium text-sm">{notification.title}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{notification.message}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          notification.isRead
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
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
