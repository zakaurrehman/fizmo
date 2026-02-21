"use client";

import { useState } from "react";

export default function SendEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage("");
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ to, subject, body }),
      });
      if (response.ok) {
        setMessage("Email sent successfully.");
        setTo("");
        setSubject("");
        setBody("");
      } else {
        setMessage("Failed to send email. API not yet available.");
      }
    } catch {
      setMessage("Failed to send email. API not yet available.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Send Email</h1>
        <p className="text-gray-400">Send an email to a client or admin</p>
      </div>
      <div className="glassmorphic rounded-xl p-6 max-w-2xl">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              placeholder="recipient@example.com"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Email subject"
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              placeholder="Email body..."
              className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 resize-none"
            />
          </div>
          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-red-400"}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-fizmo-purple-500 text-white rounded-lg hover:bg-fizmo-purple-600 transition-all disabled:opacity-50 font-medium"
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
