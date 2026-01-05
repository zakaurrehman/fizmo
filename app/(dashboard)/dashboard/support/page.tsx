"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SupportPage() {
  const [selectedTab, setSelectedTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/support", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTicket() {
    if (!subject || !message) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          category,
          priority,
          message,
        }),
      });

      if (response.ok) {
        await fetchTickets();
        setSubject("");
        setMessage("");
        setCategory("GENERAL");
        setPriority("MEDIUM");
        setSelectedTab("tickets");
      } else {
        const error = await response.json();
        alert(`Failed to create ticket: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to create ticket:", error);
      alert("An error occurred while creating the ticket");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendReply(ticketId: string) {
    if (!replyMessage) return;

    try {
      const token = localStorage.getItem("fizmo_token");
      const response = await fetch(`/api/support/${ticketId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: replyMessage,
        }),
      });

      if (response.ok) {
        setReplyMessage("");
        // Refresh ticket details
        fetchTickets();
      } else {
        const error = await response.json();
        alert(`Failed to send reply: ${error.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("An error occurred while sending the reply");
    }
  }


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500/20 text-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-500/20 text-yellow-500";
      case "RESOLVED":
        return "bg-blue-500/20 text-blue-500";
      case "CLOSED":
        return "bg-gray-500/20 text-gray-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-500";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-500";
      case "LOW":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "TRADING":
        return "📈";
      case "DEPOSIT":
        return "💰";
      case "WITHDRAWAL":
        return "💸";
      case "KYC":
        return "🆔";
      case "ACCOUNT":
        return "👤";
      case "TECHNICAL":
        return "🔧";
      default:
        return "💬";
    }
  };

  const activeTicket = selectedTicket ? tickets.find((t) => t.id === selectedTicket) : null;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
        <p className="text-gray-400">Get help with your account, trading, and technical issues</p>
      </div>

      {/* Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedTab("tickets")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "tickets"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            My Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setSelectedTab("new")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "new"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            Create Ticket
          </button>
          <button
            onClick={() => setSelectedTab("faq")}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedTab === "faq"
                ? "bg-fizmo-purple-500 text-white"
                : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
            }`}
          >
            FAQ
          </button>
        </div>
      </div>

      {/* My Tickets Tab */}
      {selectedTab === "tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1 glassmorphic rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Tickets</h2>
            {loading ? (
              <div className="text-center text-gray-400 py-8">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No tickets yet.</p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setSelectedTab("new")}
                >
                  Create First Ticket
                </Button>
              </div>
            ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedTicket === ticket.id
                      ? "bg-fizmo-purple-500/20 border-l-4 border-fizmo-purple-500"
                      : "bg-fizmo-dark-800 hover:bg-fizmo-dark-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getCategoryIcon(ticket.category)}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{ticket.subject}</p>
                        <p className="text-gray-400 text-xs">{ticket.ticketId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">Updated: {formatDate(ticket.updatedAt)}</p>
                </div>
              ))}
            </div>
            )}
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2 glassmorphic rounded-xl p-6">
            {activeTicket ? (
              <div className="space-y-6">
                {/* Ticket Header */}
                <div className="border-b border-fizmo-purple-500/20 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{activeTicket.subject}</h2>
                      <p className="text-gray-400 text-sm">{activeTicket.ticketId}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded text-sm ${getStatusBadge(activeTicket.status)}`}>
                        {activeTicket.status}
                      </span>
                      <span className={`px-3 py-1 rounded text-sm ${getPriorityBadge(activeTicket.priority)}`}>
                        {activeTicket.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Category: {activeTicket.category}</span>
                    <span>Created: {formatDate(activeTicket.createdAt)}</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {activeTicket.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.isStaff
                          ? "bg-fizmo-purple-500/10 border-l-4 border-fizmo-purple-500"
                          : "bg-fizmo-dark-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">
                          {msg.isStaff ? "Support Team" : "You"}
                        </span>
                        <span className="text-gray-500 text-xs">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {activeTicket.status !== "RESOLVED" && activeTicket.status !== "CLOSED" && (
                  <div className="border-t border-fizmo-purple-500/20 pt-4">
                    <textarea
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 min-h-24 resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <Button variant="outline" size="sm">
                        Attach File
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Close Ticket
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendReply(activeTicket.id)}
                          disabled={!replyMessage}
                        >
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolved Message */}
                {activeTicket.status === "RESOLVED" && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-500 text-sm">
                      This ticket has been resolved. If you need further assistance, please create a new ticket.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 py-12">
                <p>Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Ticket Tab */}
      {selectedTab === "new" && (
        <div className="max-w-3xl mx-auto glassmorphic rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Ticket</h2>
          <div className="space-y-6">
            <Input
              label="Subject"
              placeholder="Brief description of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
              >
                <option value="GENERAL">General Inquiry</option>
                <option value="TRADING">Trading Issue</option>
                <option value="DEPOSIT">Deposit Issue</option>
                <option value="WITHDRAWAL">Withdrawal Issue</option>
                <option value="KYC">KYC/Verification</option>
                <option value="ACCOUNT">Account Management</option>
                <option value="TECHNICAL">Technical Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
              >
                <option value="LOW">Low - General Question</option>
                <option value="MEDIUM">Medium - Issue Affecting Usage</option>
                <option value="HIGH">High - Urgent Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 min-h-40 resize-none"
              />
            </div>

            <div className="p-4 bg-fizmo-dark-800 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="file" className="hidden" />
                <div className="w-10 h-10 rounded-full bg-fizmo-purple-500/20 flex items-center justify-center">
                  <span className="text-fizmo-purple-400 text-xl">📎</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Attach Files (Optional)</p>
                  <p className="text-gray-400 text-xs">PDF, JPG, PNG up to 10MB</p>
                </div>
              </label>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Response Time:</strong> Our support team typically responds within 2-4 hours during business hours (Mon-Fri, 9AM-6PM UTC).
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedTab("tickets")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!subject || !message || submitting}
                loading={submitting}
                onClick={handleCreateTicket}
              >
                Submit Ticket
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {selectedTab === "faq" && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Account & Verification</h3>
            <div className="space-y-3">
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  How long does KYC verification take?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  KYC verification typically takes 1-2 business days. You'll receive an email notification once your documents have been reviewed.
                </p>
              </details>
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  Can I have multiple trading accounts?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  Yes! You can create multiple MT4/MT5 accounts under your client profile. Each account can have different settings and leverage.
                </p>
              </details>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Deposits & Withdrawals</h3>
            <div className="space-y-3">
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  What payment methods do you accept?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  We accept Credit/Debit Cards, Bank Wire Transfers, and Cryptocurrency (BTC, ETH, USDT). Processing times vary by method.
                </p>
              </details>
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  How long do withdrawals take?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  Withdrawals are processed within 1-3 business days. Card withdrawals may take 3-5 days, while crypto withdrawals are usually completed within 24 hours.
                </p>
              </details>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Trading</h3>
            <div className="space-y-3">
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  What is the maximum leverage available?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  Maximum leverage is 1:500 for most instruments. This can be adjusted in your account settings. Higher leverage increases both potential profits and risks.
                </p>
              </details>
              <details className="p-4 bg-fizmo-dark-800 rounded-lg">
                <summary className="text-white font-medium cursor-pointer">
                  What are the trading hours?
                </summary>
                <p className="text-gray-400 text-sm mt-3">
                  Forex markets are open 24/5 from Sunday 5PM EST to Friday 5PM EST. Individual instruments may have different trading hours.
                </p>
              </details>
            </div>
          </div>

          <div className="glassmorphic rounded-xl p-6 bg-gradient-to-r from-fizmo-purple-500/10 to-fizmo-pink-500/10">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="text-white font-bold mb-2">Still Need Help?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help!
                </p>
                <Button onClick={() => setSelectedTab("new")}>Create Support Ticket</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
