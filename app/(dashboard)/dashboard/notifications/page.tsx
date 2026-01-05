"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }

  async function handleDelete(notificationId: string) {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "unread" && notif.isRead) return false;
    if (selectedFilter !== "all" && selectedFilter !== "unread" && notif.type !== selectedFilter) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "TRADE":
        return "📈";
      case "DEPOSIT":
        return "💰";
      case "WITHDRAWAL":
        return "💸";
      case "ACCOUNT":
        return "👤";
      case "SECURITY":
        return "🔐";
      case "SYSTEM":
        return "⚙️";
      default:
        return "📢";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-500";
      case "MEDIUM":
        return "text-yellow-500";
      case "LOW":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
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
            All ({notifications.length})
          </button>
          <button
            onClick={() => setSelectedFilter("unread")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "unread"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setSelectedFilter("TRADE")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "TRADE"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Trading
          </button>
          <button
            onClick={() => setSelectedFilter("DEPOSIT")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "DEPOSIT"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setSelectedFilter("WITHDRAWAL")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "WITHDRAWAL"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Withdrawals
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
          <button
            onClick={() => setSelectedFilter("SYSTEM")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === "SYSTEM"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg transition-all cursor-pointer ${
                !notif.isRead
                  ? "bg-fizmo-purple-500/10 border-l-4 border-fizmo-purple-500"
                  : "bg-fizmo-dark-800 hover:bg-fizmo-dark-700"
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-fizmo-dark-700 flex items-center justify-center flex-shrink-0 text-2xl">
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${!notif.isRead ? "text-white" : "text-gray-300"}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-fizmo-purple-500"></span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{formatDate(notif.createdAt)}</span>
                    <div className="flex space-x-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-fizmo-purple-400 hover:text-fizmo-purple-300 text-xs"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No notifications found</p>
            <p className="text-gray-500 text-sm mt-2">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="glassmorphic rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-fizmo-dark-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Trade Execution Alerts</p>
                <p className="text-gray-400 text-sm">Get notified when trades are executed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-fizmo-dark-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Deposit/Withdrawal Updates</p>
                <p className="text-gray-400 text-sm">Financial transaction notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-fizmo-dark-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Security Alerts</p>
                <p className="text-gray-400 text-sm">Login and security events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-fizmo-dark-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">System Announcements</p>
                <p className="text-gray-400 text-sm">Platform updates and maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fizmo-purple-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
