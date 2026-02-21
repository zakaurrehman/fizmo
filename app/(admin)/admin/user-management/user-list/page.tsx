"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserItem {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  user: { email: string; status: string; kycStatus: string; emailVerified: boolean; createdAt: string };
  _count: { accounts: number; deposits: number };
}

export default function UserListPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async (q = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const kycColor = (s: string) =>
    s === "APPROVED" ? "text-green-400" : s === "REJECTED" ? "text-red-400" : "text-yellow-400";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User List</h1>
        <p className="text-gray-400">All registered clients</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or client ID..."
          className="flex-1 bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" />
        <button type="submit" className="px-6 py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600">Search</button>
      </form>

      <div className="glassmorphic rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-fizmo-purple-500/20">
                <tr>
                  {["Client ID", "Name", "Email", "Status", "KYC", "Accounts", "Joined", "Action"].map(h => (
                    <th key={h} className="text-left text-gray-400 py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800">
                    <td className="py-3 px-4 text-gray-300 font-mono text-xs">{u.clientId}</td>
                    <td className="py-3 px-4 text-white">{u.firstName} {u.lastName}</td>
                    <td className="py-3 px-4 text-gray-400">{u.user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${u.user.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {u.user.status}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-xs font-semibold ${kycColor(u.user.kycStatus)}`}>{u.user.kycStatus}</td>
                    <td className="py-3 px-4 text-gray-400 text-center">{u._count.accounts}</td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/clients/${u.id}`} className="text-fizmo-purple-400 hover:text-fizmo-purple-300 text-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="text-center py-8 text-gray-400">No users found</div>}
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm">Total: {users.length} users</p>
    </div>
  );
}
