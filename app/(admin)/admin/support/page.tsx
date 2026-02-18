"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(ticketId: string, status: string) {
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status }),
      });
      if (res.ok) {
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status });
        }
      }
    } catch (error) {
      console.error("Failed to update ticket:", error);
    }
  }

  async function sendReply() {
    if (!selectedTicket || !replyMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, message: replyMessage }),
      });
      if (res.ok) {
        setReplyMessage("");
        // Refetch ticket messages
        const ticketRes = await fetch(`/api/support/${selectedTicket.id}`);
        if (ticketRes.ok) {
          const data = await ticketRes.json();
          setSelectedTicket(data.ticket);
        }
        fetchTickets();
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  }

  async function viewTicket(ticketId: string) {
    try {
      const res = await fetch(`/api/support/${ticketId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
      }
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    }
  }

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
    if (search) {
      const term = search.toLowerCase();
      const clientName = `${t.user?.client?.firstName || ""} ${t.user?.client?.lastName || ""}`.toLowerCase();
      return (
        t.ticketId.toLowerCase().includes(term) ||
        t.subject.toLowerCase().includes(term) ||
        clientName.includes(term) ||
        t.user?.email?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "bg-blue-500/20 text-blue-400";
      case "IN_PROGRESS": return "bg-yellow-500/20 text-yellow-500";
      case "WAITING_USER": return "bg-purple-500/20 text-purple-400";
      case "RESOLVED": return "bg-green-500/20 text-green-500";
      case "CLOSED": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-500/20 text-red-500";
      case "HIGH": return "bg-orange-500/20 text-orange-500";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-500";
      case "LOW": return "bg-green-500/20 text-green-500";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-gray-400">Manage and respond to customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Open</p>
          <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.inProgress}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Closed</p>
          <p className="text-2xl font-bold text-gray-400">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphic rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="flex space-x-2">
          {["ALL", "OPEN", "IN_PROGRESS", "WAITING_USER", "RESOLVED", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filterStatus === s
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white text-sm w-64"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="glassmorphic rounded-xl p-8 text-center">
              <p className="text-gray-400">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => viewTicket(ticket.id)}
                className={`glassmorphic rounded-xl p-4 cursor-pointer transition-all hover:border-fizmo-purple-500/50 ${
                  selectedTicket?.id === ticket.id ? "border-l-4 border-fizmo-purple-500" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-fizmo-purple-400 font-mono text-xs">{ticket.ticketId}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${statusColor(ticket.status)}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{ticket.subject}</h3>
                <p className="text-gray-400 text-xs mb-2">
                  {ticket.user?.client?.firstName} {ticket.user?.client?.lastName} - {ticket.user?.email}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-xs ${priorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="glassmorphic rounded-xl p-6 space-y-4">
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {selectedTicket.ticketId} | {selectedTicket.category} | Priority: {selectedTicket.priority}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateStatus(selectedTicket.id, e.target.value)}
                    className="px-3 py-1.5 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white text-sm"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_USER">Waiting User</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {(selectedTicket.messages || []).map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg ${
                      msg.isStaff
                        ? "bg-fizmo-purple-500/10 border border-fizmo-purple-500/30 ml-4"
                        : "bg-fizmo-dark-800 mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-semibold ${msg.isStaff ? "text-fizmo-purple-400" : "text-white"}`}>
                        {msg.isStaff ? "Staff" : "Client"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedTicket.status !== "CLOSED" && (
                <div className="border-t border-fizmo-purple-500/20 pt-4">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white text-sm resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={sendReply} disabled={!replyMessage.trim() || sending}>
                      {sending ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glassmorphic rounded-xl p-12 text-center">
              <p className="text-gray-400">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
