"use client";

import { useState, useEffect } from "react";

interface UserRow {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  user: { id: string; email: string };
}

export default function ChangePasswordPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [form, setForm] = useState({ userId: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("fizmo_token");
    fetch("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setUsers(d.users || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    setLoading(true);
    setMsg("");
    const token = localStorage.getItem("fizmo_token");
    const res = await fetch("/api/admin/users/change-password", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    setMsg(res.ok ? "Password changed successfully." : d.error || "Failed to change password.");
    if (res.ok) setForm({ userId: "", newPassword: "" });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Change User Password</h1>
        <p className="text-gray-400">Directly set a new password for a user</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Select User</label>
            <select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required
              className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm">
              <option value="">Select user</option>
              {users.map(u => (
                <option key={u.id} value={u.user?.id}>{u.firstName} {u.lastName} — {u.user?.email}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">New Password</label>
            <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} required
              placeholder="Minimum 8 characters" className="w-full bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg px-3 py-2 text-white text-sm" />
          </div>

          {msg && <p className={`text-sm ${msg.includes("success") ? "text-green-400" : "text-red-400"}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all text-sm font-medium disabled:opacity-50">
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
