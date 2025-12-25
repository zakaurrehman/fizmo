"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaTrash } from "react-icons/fa";

export default function AdminClientsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteClient(clientId: string, clientName: string) {
    const confirmMessage = `Are you sure you want to delete client "${clientName}"?\n\nThis will:\n- Mark the client as DELETED\n- Invalidate all sessions\n- Prevent future login\n\nThis action can only be reversed by a super admin.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingClientId(clientId);

    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/admin/clients?id=${clientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Client deleted successfully: ${data.email}`);
        // Refresh the clients list
        await fetchClients();
      } else {
        alert(`Failed to delete client: ${data.error}`);
      }
    } catch (error: any) {
      console.error("Delete client error:", error);
      alert(`Error deleting client: ${error.message}`);
    } finally {
      setDeletingClientId(null);
    }
  }

  const filteredClients = clients.filter(
    (client) =>
      client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
          <p className="text-gray-400">Manage and monitor all client accounts</p>
        </div>
        <Button>+ Add New Client</Button>
      </div>

      {/* Search and Filters */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or client ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Suspended</option>
          </select>
          <select className="px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white">
            <option>All KYC Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-fizmo-purple-500/20">
                <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENT ID</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">NAME</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">EMAIL</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">BALANCE</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">KYC</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">LABELS</th>
                <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No clients found
                  </td>
                </tr>
              ) : (
                filteredClients.map((client: any) => (
                  <tr
                    key={client.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">
                      CL-{client.id.slice(0, 6)}
                    </td>
                    <td className="py-3 px-4 text-white text-sm">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">{client.email}</td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      ${client.totalBalance?.toLocaleString() || "0"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          client.status === "ACTIVE"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          client.kycStatus === "APPROVED"
                            ? "bg-green-500/20 text-green-500"
                            : client.kycStatus === "UNDER_REVIEW"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {client.kycStatus?.replace("_", " ") || "PENDING"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {client.accountsCount} accounts
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/clients/${client.id}`)}
                          className="text-fizmo-purple-400 hover:text-fizmo-purple-300"
                        >
                          View
                        </button>
                        <button className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button
                          onClick={() =>
                            handleDeleteClient(
                              client.id,
                              `${client.firstName} ${client.lastName}`
                            )
                          }
                          disabled={deletingClientId === client.id}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          title="Delete client"
                        >
                          <FaTrash className="text-xs" />
                          <span>{deletingClientId === client.id ? "Deleting..." : "Delete"}</span>
                        </button>
                      </div>
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
            Showing {filteredClients.length} of {clients.length} clients
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
    </div>
  );
}
