"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  async function fetchClientDetails() {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data.client);
      }
    } catch (error) {
      console.error("Failed to fetch client details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading client details...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-400 mb-4">Client not found</div>
        <Button onClick={() => router.push("/admin/clients")}>Back to Clients</Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "accounts", label: "Accounts" },
    { id: "transactions", label: "Transactions" },
    { id: "kyc", label: "KYC Documents" },
    { id: "activity", label: "Activity Log" },
  ];

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
          <p className="text-gray-400">{client.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            client.kycStatus === "VERIFIED" ? "bg-green-500/20 text-green-400" :
            client.kycStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            KYC: {client.kycStatus}
          </span>
          <Button>Edit Client</Button>
        </div>
      </div>

      <div className="border-b border-gray-800">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "overview" && <OverviewTab client={client} />}
        {activeTab === "accounts" && <AccountsTab accounts={client.accounts} />}
        {activeTab === "transactions" && <TransactionsTab transactions={client.transactions} />}
        {activeTab === "kyc" && <KYCTab documents={client.kycDocuments} />}
        {activeTab === "activity" && <ActivityTab client={client} />}
      </div>
    </div>
  );
}

function OverviewTab({ client }: { client: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="modern-card p-6">
          <div className="text-sm text-gray-400 mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-white">
            ${client.statistics.totalBalance.toLocaleString()}
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="text-sm text-gray-400 mb-1">Total Deposits</div>
          <div className="text-2xl font-bold text-green-400">
            ${client.statistics.totalDeposits.toLocaleString()}
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="text-sm text-gray-400 mb-1">Total Withdrawals</div>
          <div className="text-2xl font-bold text-red-400">
            ${client.statistics.totalWithdrawals.toLocaleString()}
          </div>
        </div>
        <div className="modern-card p-6">
          <div className="text-sm text-gray-400 mb-1">Net Deposits</div>
          <div className="text-2xl font-bold text-purple-400">
            ${client.statistics.netDeposits.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="modern-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-400">Full Name</div>
            <div className="text-white">{client.firstName} {client.lastName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Email</div>
            <div className="text-white">{client.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Phone</div>
            <div className="text-white">{client.phone || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Country</div>
            <div className="text-white">{client.country || "N/A"}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Registered</div>
            <div className="text-white">{new Date(client.registeredAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div className="modern-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Account Summary</h3>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-400">Total Accounts</div>
            <div className="text-2xl font-bold text-white">{client.statistics.accountCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Equity</div>
            <div className="text-xl font-bold text-purple-400">${client.statistics.totalEquity.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total Transactions</div>
            <div className="text-xl font-bold text-cyan-400">{client.statistics.transactionCount}</div>
          </div>
        </div>
      </div>

      <div className="modern-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Labels & Tags</h3>
        <div className="flex flex-wrap gap-2">
          {client.labels && client.labels.length > 0 ? (
            client.labels.map((label: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                {label}
              </span>
            ))
          ) : (
            <div className="text-gray-400 text-sm">No labels assigned</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountsTab({ accounts }: { accounts: any[] }) {
  return (
    <div className="modern-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">Trading Accounts</h3>
      {accounts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No accounts found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Account ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Balance</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Equity</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Leverage</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-sm font-medium text-white">{account.accountId}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      account.accountType === "LIVE" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {account.accountType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-white">${account.balance.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm text-white">${account.equity.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center text-sm text-gray-300">1:{account.leverage}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      account.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-400">{new Date(account.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TransactionsTab({ transactions }: { transactions: any[] }) {
  return (
    <div className="modern-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
      {transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No transactions found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Method</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={`${tx.type}-${tx.id}`} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-sm text-gray-400">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === "DEPOSIT" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{tx.paymentMethod}</td>
                  <td className={`py-3 px-4 text-right text-sm font-medium ${
                    tx.type === "DEPOSIT" ? "text-green-400" : "text-red-400"
                  }`}>
                    {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                      tx.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KYCTab({ documents }: { documents: any[] }) {
  return (
    <div className="modern-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">KYC Documents</h3>
      {documents.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No documents uploaded</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-800 rounded-lg p-4 hover:bg-gray-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{doc.documentType}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  doc.status === "APPROVED" ? "bg-green-500/20 text-green-400" :
                  doc.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {doc.status}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-3">
                Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
              </div>
              <Button variant="outline" className="w-full">View Document</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityTab({ client }: { client: any }) {
  const activities = [
    { date: client.registeredAt, action: "Account Created", description: "Client registered on the platform" },
    ...client.transactions.map((tx: any) => ({
      date: tx.timestamp,
      action: tx.type === "DEPOSIT" ? "Deposit Request" : "Withdrawal Request",
      description: `${tx.type} of $${tx.amount.toLocaleString()} via ${tx.paymentMethod} - ${tx.status}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="modern-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">Activity Log</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="border-l-2 border-purple-500/30 pl-4 py-2">
            <div className="text-sm text-gray-400">{new Date(activity.date).toLocaleString()}</div>
            <div className="text-white font-medium">{activity.action}</div>
            <div className="text-sm text-gray-400">{activity.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
