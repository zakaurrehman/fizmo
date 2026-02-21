"use client";

import { useState, useEffect } from "react";

export default function AddUserPage() {
  const [form, setForm] = useState({
    email: "", password: "", firstName: "", lastName: "", phone: "", country: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("fizmo_token");
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `User created! Client ID: ${data.clientId}` });
        setForm({ email: "", password: "", firstName: "", lastName: "", phone: "", country: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create user" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Add User</h1>
        <p className="text-gray-400">Create a new client account</p>
      </div>

      <div className="glassmorphic rounded-xl p-6 max-w-2xl">
        {message && (
          <div className={`mb-4 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="Last name" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password *</label>
            <input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="Min 8 characters" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Country</label>
              <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full bg-fizmo-dark-800 border border-fizmo-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-fizmo-purple-500" placeholder="US" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-fizmo-purple-500 hover:bg-fizmo-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 transition-all">
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
