"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserItem {
  id: string;
  clientId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  country: string | null;
  walletBalance: number;
  ibName: string;
  user: {
    email: string;
    status: string;
    twoFactorEnabled: boolean;
    createdAt: string;
  };
  createdAt: string;
}

export default function UserListPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (q = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(
        `/api/admin/users?search=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleBlock = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`Are you sure you want to ${newStatus === "SUSPENDED" ? "block" : "unblock"} this user?`)) return;
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(`/api/admin/clients/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update user status");
        return;
      }
      fetchUsers(search);
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(`/api/admin/clients?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
        return;
      }
      fetchUsers(search);
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
  };

  const handlePromoteIB = async (user: UserItem) => {
    if (!confirm(`Promote ${user.firstName || ""} ${user.lastName || ""} as IB?`)) return;
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch("/api/admin/ib", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.user.email,
          email: user.user.email,
          tier: "BRONZE",
          commissionRate: 10,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User promoted as IB successfully!");
      } else {
        alert(data.error || "Failed to promote as IB");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to promote as IB");
    }
  };

  const handleExportExcel = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Country", "Wallet Balance", "IB Name", "Registration Date", "Google 2FA"];
    const rows = users.map((u, i) => [
      i + 1,
      `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      u.user.email,
      u.phone || "",
      u.country || "",
      u.walletBalance,
      u.ibName || "",
      new Date(u.user.createdAt).toLocaleDateString(),
      u.user.twoFactorEnabled ? "Enabled" : "Disabled",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-list.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayed = users.slice(0, perPage);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">User List</h1>

      {/* Controls row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="bg-fizmo-dark-800 border border-fizmo-dark-700 text-white rounded px-2 py-1 text-sm"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">entries</span>
          <button
            onClick={handleExportExcel}
            className="px-4 py-1.5 bg-fizmo-purple-500 text-white text-sm rounded hover:bg-fizmo-purple-600 font-medium"
          >
            Excel
          </button>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Search:</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-fizmo-dark-800 border border-fizmo-dark-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-fizmo-purple-500 w-48"
          />
        </form>
      </div>

      {/* Table */}
      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {[
                    "ID", "Name", "Email", "Phone", "Country",
                    "Wallet Balance", "IB Name", "Registration Date",
                    "Google 2FA", "Marketing Name", "Action", "Create IB",
                  ].map((h) => (
                    <th key={h} className="text-left text-gray-400 py-3 px-3 text-xs font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((u, i) => (
                  <tr key={u.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-3 text-gray-300 text-center">{i + 1}</td>
                    <td className="py-3 px-3 text-white whitespace-nowrap">
                      {`${u.firstName || ""} ${u.lastName || ""}`.trim() || "-"}
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{u.user.email}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">{u.phone || "-"}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{u.country || "-"}</td>
                    <td className="py-3 px-3 text-gray-400 text-center">{u.walletBalance}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{u.ibName || "-"}</td>
                    <td className="py-3 px-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(u.user.createdAt).toISOString().split("T")[0]}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {u.user.twoFactorEnabled ? (
                        <span className="text-green-400 text-xs">Enabled</span>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-xs">-</td>
                    {/* Action buttons */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/clients/${u.id}`}
                          className="w-8 h-8 flex items-center justify-center bg-fizmo-purple-500 hover:bg-fizmo-purple-600 text-white rounded text-xs"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Link>
                        <button
                          onClick={() => handleBlock(u.id, u.user.status)}
                          className={`w-8 h-8 flex items-center justify-center rounded text-white text-xs ${u.user.status === "ACTIVE" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}`}
                          title={u.user.status === "ACTIVE" ? "Block" : "Unblock"}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                    {/* Promote as IB */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handlePromoteIB(u)}
                        className="px-3 py-1.5 bg-fizmo-purple-500 hover:bg-fizmo-purple-600 text-white rounded text-xs whitespace-nowrap font-medium"
                      >
                        Promote As IB
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-400">No users found</div>
            )}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">
        Showing {Math.min(perPage, users.length)} of {users.length} entries
      </p>
    </div>
  );
}
