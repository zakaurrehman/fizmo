"use client";

import { useState } from "react";

export default function CreateSubAdminPage() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, role: "ADMIN" }),
      });
      if (response.ok) {
        setMessage("Sub admin created successfully.");
        setForm({ email: "", password: "", firstName: "", lastName: "" });
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to create sub admin.");
      }
    } catch {
      setMessage("Failed to create sub admin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Sub Admin</h1>
        <p className="text-gray-400">Create a new admin user account</p>
      </div>
      <div className="glassmorphic rounded-xl p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="First name"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Last name"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-400"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all disabled:opacity-50 font-medium"
          >
            {loading ? "Creating..." : "Create Sub Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
