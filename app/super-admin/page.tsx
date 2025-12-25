"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBuilding, FaUserShield, FaUsers, FaPlus, FaTimes, FaCheck, FaPause, FaTrash, FaSignOutAlt } from "react-icons/fa";

interface Broker {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalUsers: number;
    totalClients: number;
    totalAccounts: number;
  };
}

interface Admin {
  id: string;
  email: string;
  role: string;
  kycStatus: string;
  createdAt: string;
  broker: {
    id: string;
    name: string;
    slug: string;
  } | null;
  profile: {
    firstName: string;
    lastName: string;
  } | null;
}

interface Client {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  kycStatus: string;
  createdAt: string;
  broker: {
    id: string;
    name: string;
    slug: string;
  } | null;
  accountsCount: number;
  totalBalance: number;
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"brokers" | "admins" | "clients">("brokers");
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBrokers();
  }, []);

  useEffect(() => {
    if (activeTab === "admins" && admins.length === 0) {
      fetchAdmins();
    } else if (activeTab === "clients" && clients.length === 0) {
      fetchClients();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("fizmo_token");
    router.push("/super-admin/login");
  };

  const fetchBrokers = async () => {
    try {
      const token = localStorage.getItem("fizmo_token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/brokers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setError("Authentication failed. Please login again.");
        setLoading(false);
        return;
      }

      if (res.status === 403) {
        setError("Access denied. SUPER_ADMIN role required.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch brokers (${res.status})`);
      }

      const data = await res.json();
      setBrokers(data.brokers);
    } catch (err: any) {
      console.error("Fetch brokers error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("fizmo_token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch("/api/super-admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch admins (${res.status})`);
      }

      const data = await res.json();
      setAdmins(data.admins);
    } catch (err: any) {
      console.error("Fetch admins error:", err);
      setError(err.message);
    }
  };

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("fizmo_token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const res = await fetch("/api/super-admin/clients?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch clients (${res.status})`);
      }

      const data = await res.json();
      setClients(data.clients);
    } catch (err: any) {
      console.error("Fetch clients error:", err);
      setError(err.message);
    }
  };

  const handleCreateBroker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const token = localStorage.getItem("fizmo_token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      const brokerData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        domain: formData.get("domain") || null,
      };

      const res = await fetch("/api/admin/brokers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brokerData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.details || "Failed to create broker");
        setIsSubmitting(false);
        return;
      }

      setSuccess("Broker created successfully!");
      setShowCreateModal(false);
      fetchBrokers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Create broker error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBrokerStatus = async (brokerId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch("/api/admin/brokers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: brokerId,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update broker");
        return;
      }

      setSuccess(`Broker ${newStatus.toLowerCase()} successfully!`);
      fetchBrokers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBroker = async (brokerId: string, brokerName: string) => {
    if (!confirm(`Are you sure you want to delete broker "${brokerName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(`/api/admin/brokers?id=${brokerId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete broker");
        return;
      }

      setSuccess("Broker deleted successfully!");
      fetchBrokers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminEmail}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(`/api/super-admin/delete-admin?id=${adminId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete admin");
        return;
      }

      setSuccess("Admin deleted successfully!");
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const token = localStorage.getItem("fizmo_token");

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      const adminData = {
        email: formData.get("email"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone") || "",
        country: formData.get("country") || "",
        brokerId: formData.get("brokerId"),
      };

      console.log("Creating admin with data:", { ...adminData, password: "[REDACTED]" });

      const res = await fetch("/api/super-admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(adminData),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        setError(data.error || data.details || "Failed to create admin");
        console.error("Create admin failed:", data);
        return;
      }

      setSuccess("Admin user created successfully!");
      setShowCreateAdminModal(false);
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error("Create admin error:", err);
      setError(err.message || "An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fizmo-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Super Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
            <p className="text-gray-400 text-sm lg:text-base">Platform-wide management and oversight</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="glassmorphic rounded-xl p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaTimes className="text-red-500" />
                <span className="text-white">{error}</span>
              </div>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-400">
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="glassmorphic rounded-xl p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaCheck className="text-green-500" />
                <span className="text-white">{success}</span>
              </div>
              <button onClick={() => setSuccess("")} className="text-green-500 hover:text-green-400">
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="glassmorphic rounded-xl p-1 inline-flex gap-2">
          <button
            onClick={() => setActiveTab("brokers")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              activeTab === "brokers"
                ? "bg-gradient-fizmo text-white"
                : "text-gray-400 hover:text-white hover:bg-fizmo-dark-800"
            }`}
          >
            <FaBuilding />
            <span>Brokers ({brokers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              activeTab === "admins"
                ? "bg-gradient-fizmo text-white"
                : "text-gray-400 hover:text-white hover:bg-fizmo-dark-800"
            }`}
          >
            <FaUserShield />
            <span>All Admins ({admins.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("clients")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
              activeTab === "clients"
                ? "bg-gradient-fizmo text-white"
                : "text-gray-400 hover:text-white hover:bg-fizmo-dark-800"
            }`}
          >
            <FaUsers />
            <span>All Clients ({clients.length})</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "brokers" && (
          <div className="space-y-4">
            {/* Brokers Header */}
            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Broker Management</h2>
                  <p className="text-gray-400 text-sm">Create and manage all brokers on the platform</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Create Broker</span>
                </button>
              </div>
            </div>

            {/* Brokers List */}
            <div className="glassmorphic rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-fizmo-purple-500/20">
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">BROKER</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">DOMAIN</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">STATUS</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">STATISTICS</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brokers.map((broker) => (
                      <tr
                        key={broker.id}
                        className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800/50 transition-all"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-white font-medium">{broker.name}</div>
                            <div className="text-gray-400 text-sm">Slug: {broker.slug}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300">{broker.domain || "—"}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              broker.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : broker.status === "SUSPENDED"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {broker.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm space-y-1">
                            <div className="text-gray-300">Users: {broker.stats.totalUsers}</div>
                            <div className="text-gray-300">Clients: {broker.stats.totalClients}</div>
                            <div className="text-gray-300">Accounts: {broker.stats.totalAccounts}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {broker.status === "ACTIVE" ? (
                              <button
                                onClick={() => handleUpdateBrokerStatus(broker.id, "SUSPENDED")}
                                className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                                title="Suspend"
                              >
                                <FaPause />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateBrokerStatus(broker.id, "ACTIVE")}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                title="Activate"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBroker(broker.id, broker.name)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={broker.stats.totalUsers > 0}
                              title={
                                broker.stats.totalUsers > 0
                                  ? "Cannot delete broker with users"
                                  : "Delete broker"
                              }
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {brokers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No brokers found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "admins" && (
          <div className="space-y-4">
            {/* Admins Header */}
            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">All Admin Users Across All Brokers</h2>
                  <p className="text-gray-400 text-sm">View and create admin users for all brokers</p>
                </div>
                <button
                  onClick={() => setShowCreateAdminModal(true)}
                  className="px-4 py-2 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Create Admin</span>
                </button>
              </div>
            </div>

            {/* Admins List */}
            <div className="glassmorphic rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-fizmo-purple-500/20">
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">ADMIN</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">EMAIL</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">ROLE</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">BROKER</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">CREATED</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800/50 transition-all"
                      >
                        <td className="py-4 px-6">
                          <div className="text-white font-medium">
                            {admin.profile
                              ? `${admin.profile.firstName} ${admin.profile.lastName}`
                              : "—"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300">{admin.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              admin.role === "SUPER_ADMIN"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {admin.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-white">{admin.broker ? admin.broker.name : "—"}</div>
                            <div className="text-gray-400 text-sm">
                              {admin.broker ? admin.broker.slug : ""}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 text-sm">
                            {new Date(admin.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={admin.role === "SUPER_ADMIN"}
                            title={admin.role === "SUPER_ADMIN" ? "Cannot delete SUPER_ADMIN" : "Delete admin"}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {admins.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No admin users found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="space-y-4">
            {/* Clients Header */}
            <div className="glassmorphic rounded-xl p-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">All Clients Across All Brokers</h2>
                <p className="text-gray-400 text-sm">View all client accounts on the platform</p>
              </div>
            </div>

            {/* Clients List */}
            <div className="glassmorphic rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-fizmo-purple-500/20">
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">CLIENT ID</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">NAME</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">EMAIL</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">BROKER</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">STATUS</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">ACCOUNTS</th>
                      <th className="text-left text-gray-400 py-4 px-6 text-sm font-medium">BALANCE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800/50 transition-all"
                      >
                        <td className="py-4 px-6">
                          <div className="text-white font-medium">{client.clientId}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-white font-medium">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-gray-400 text-sm">{client.country}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300">{client.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-white">{client.broker ? client.broker.name : "—"}</div>
                            <div className="text-gray-400 text-sm">
                              {client.broker ? client.broker.slug : ""}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              client.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300">{client.accountsCount}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white font-semibold">
                            ${client.totalBalance.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {clients.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No clients found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Broker Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glassmorphic rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create New Broker</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateBroker} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Broker Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Acme Trading"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  placeholder="e.g., acme-trading"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domain (optional)
                </label>
                <input
                  type="text"
                  name="domain"
                  placeholder="e.g., acme.fizmo.com"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-gray-300 rounded-lg hover:bg-fizmo-dark-700 transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Broker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glassmorphic rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create New Admin User</h3>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Broker *
                </label>
                <select
                  name="brokerId"
                  required
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                >
                  <option value="">Select a broker</option>
                  {brokers.map((broker) => (
                    <option key={broker.id} value={broker.id}>
                      {broker.name} ({broker.slug})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  The broker this admin will manage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@example.com"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="John"
                    className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Doe"
                    className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country (optional)
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="United States"
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-fizmo-purple-500 focus:ring-2 focus:ring-fizmo-purple-500/20 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="flex-1 px-4 py-2 bg-fizmo-dark-800 text-gray-300 rounded-lg hover:bg-fizmo-dark-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
