"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

function ClientProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("id");

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId);
    }
  }, [clientId]);

  async function fetchClient(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data.client);
      }
    } catch (error) {
      console.error("Failed to fetch client:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchClients() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/clients?search=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Failed to search clients:", error);
    } finally {
      setSearching(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading client profile...</p>
      </div>
    );
  }

  // If no client selected, show search
  if (!clientId || !client) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Profile</h1>
          <p className="text-gray-400">Search for a client to view their profile</p>
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchClients()}
              placeholder="Search by name, email, or client ID..."
              className="flex-1 px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
            />
            <Button onClick={searchClients} disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>

          {clients.length > 0 && (
            <div className="mt-4 space-y-2">
              {clients.map((c: any) => (
                <div
                  key={c.id}
                  onClick={() => router.push(`/admin/clients/${c.id}`)}
                  className="p-4 bg-fizmo-dark-800 rounded-lg cursor-pointer hover:bg-fizmo-dark-700 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-semibold">{c.firstName} {c.lastName}</p>
                    <p className="text-gray-400 text-sm">{c.email} • {c.clientId}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    c.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-500" :
                    c.kycStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    KYC: {c.kycStatus}
                  </span>
                </div>
              ))}
            </div>
          )}

          {clients.length === 0 && searchQuery && !searching && (
            <p className="text-gray-400 text-center mt-4">No clients found. Try a different search term.</p>
          )}
        </div>

        <div className="glassmorphic rounded-xl p-6 text-center">
          <p className="text-gray-400 mb-4">Or browse all clients</p>
          <Button onClick={() => router.push("/admin/clients")}>View All Clients</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.push("/admin/clients")} className="mb-4">
            ← Back to Clients
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {client.firstName} {client.lastName}
          </h1>
          <p className="text-gray-400">{client.email} • {client.id}</p>
        </div>
        <span className={`px-3 py-1 rounded text-sm ${
          client.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-500" :
          client.kycStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
          "bg-red-500/20 text-red-500"
        }`}>
          KYC: {client.kycStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
          <p className="text-2xl font-bold text-white">${client.statistics.totalBalance.toLocaleString()}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
          <p className="text-2xl font-bold text-green-500">${client.statistics.totalDeposits.toLocaleString()}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
          <p className="text-2xl font-bold text-red-500">${client.statistics.totalWithdrawals.toLocaleString()}</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Accounts</p>
          <p className="text-2xl font-bold text-white">{client.statistics.accountCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
          <div className="space-y-3">
            {[
              ["Full Name", `${client.firstName} ${client.lastName}`],
              ["Email", client.email],
              ["Phone", client.phone || "N/A"],
              ["Country", client.country || "N/A"],
              ["Labels", client.labels?.join(", ") || "None"],
              ["Registered", new Date(client.registeredAt).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Trading Accounts</h3>
          {client.accounts.length === 0 ? (
            <p className="text-gray-400">No accounts</p>
          ) : (
            <div className="space-y-3">
              {client.accounts.map((acc: any) => (
                <div key={acc.id} className="p-3 bg-fizmo-dark-800 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-fizmo-purple-400 font-mono text-sm">{acc.accountId}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      acc.accountType === "LIVE" ? "bg-green-500/20 text-green-500" : "bg-blue-500/20 text-blue-500"
                    }`}>{acc.accountType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Balance: <span className="text-white">${acc.balance.toLocaleString()}</span></span>
                    <span className="text-gray-400">Leverage: <span className="text-white">1:{acc.leverage}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => router.push(`/admin/clients/${clientId}`)}>
          View Full Client Profile
        </Button>
      </div>
    </div>
  );
}

export default function AdminClientProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96"><p className="text-gray-400">Loading...</p></div>}>
      <ClientProfileContent />
    </Suspense>
  );
}
