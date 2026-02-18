"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminIBPage() {
  const [selectedTab, setSelectedTab] = useState("active");
  const [ibs, setIbs] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingIB, setEditingIB] = useState<any>(null);
  const [ibForm, setIBForm] = useState({ name: "", email: "", tier: "BRONZE", commissionRate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIBs();
    fetchPayouts();
  }, []);

  async function fetchIBs() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/ib");
      if (response.ok) {
        const data = await response.json();
        setIbs(data.ibs || []);
      }
    } catch (error) {
      console.error("Failed to fetch IBs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPayouts() {
    try {
      const response = await fetch("/api/admin/ib/payouts");
      if (response.ok) {
        const data = await response.json();
        setPayouts(data.payouts || []);
      }
    } catch (error) {
      console.error("Failed to fetch payouts:", error);
    }
  }

  async function seedIBs() {
    try {
      const response = await fetch("/api/admin/ib/seed", {
        method: "POST",
      });

      if (response.ok) {
        alert("Default IBs initialized successfully!");
        fetchIBs();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to initialize IBs");
      }
    } catch (error) {
      console.error("Failed to seed IBs:", error);
      alert("Failed to initialize IBs");
    }
  }

  async function seedPayouts() {
    try {
      const response = await fetch("/api/admin/ib/payouts", {
        method: "PATCH",
      });

      if (response.ok) {
        alert("Default payouts initialized successfully!");
        fetchPayouts();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to initialize payouts");
      }
    } catch (error) {
      console.error("Failed to seed payouts:", error);
      alert("Failed to initialize payouts");
    }
  }

  async function processPayment(payoutId: string) {
    if (!confirm("Are you sure you want to process this payout?")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/ib/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payoutId }),
      });

      if (response.ok) {
        alert("Payout processed successfully!");
        fetchPayouts();
        fetchIBs(); // Refresh to update last payout dates
      } else {
        const data = await response.json();
        alert(data.error || "Failed to process payout");
      }
    } catch (error) {
      console.error("Failed to process payout:", error);
      alert("Failed to process payout");
    }
  }

  async function saveIB() {
    setSaving(true);
    try {
      if (editingIB) {
        // Update existing IB
        const res = await fetch("/api/admin/ib", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingIB.id,
            name: ibForm.name,
            email: ibForm.email,
            tier: ibForm.tier,
            commissionRate: ibForm.commissionRate ? Number(ibForm.commissionRate) : undefined,
          }),
        });
        if (res.ok) {
          closeModal();
          fetchIBs();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to update IB");
        }
      } else {
        // Create new IB
        const res = await fetch("/api/admin/ib", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: ibForm.name,
            email: ibForm.email,
            tier: ibForm.tier,
            commissionRate: ibForm.commissionRate ? Number(ibForm.commissionRate) : undefined,
          }),
        });
        if (res.ok) {
          closeModal();
          fetchIBs();
        } else {
          const data = await res.json();
          alert(data.error || "Failed to create IB");
        }
      }
    } catch (error) {
      alert("Failed to save IB");
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(ib: any) {
    setEditingIB(ib);
    setIBForm({ name: ib.name, email: ib.email, tier: ib.tier, commissionRate: String(ib.commissionRate) });
    setShowCreateModal(true);
  }

  function closeModal() {
    setShowCreateModal(false);
    setEditingIB(null);
    setIBForm({ name: "", email: "", tier: "BRONZE", commissionRate: "" });
  }

  // Calculate aggregate stats
  const totalIBs = ibs.length;
  const activeIBs = ibs.filter((ib) => ib.status === "ACTIVE").length;
  const totalVolume30d = ibs.reduce((sum, ib) => sum + ib.totalVolume, 0);
  const totalPendingCommission = ibs.reduce(
    (sum, ib) => sum + ib.pendingCommission,
    0
  );
  const paidPayouts30d = payouts.filter((p) => p.status === "PAID");
  const totalPaid30d = paidPayouts30d.reduce((sum, p) => sum + p.amount, 0);

  // Calculate tier distribution
  const platinumCount = ibs.filter((ib) => ib.tier === "PLATINUM").length;
  const goldCount = ibs.filter((ib) => ib.tier === "GOLD").length;
  const silverCount = ibs.filter((ib) => ib.tier === "SILVER").length;
  const bronzeCount = ibs.filter((ib) => ib.tier === "BRONZE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">IB Management</h1>
          <p className="text-gray-400">Manage Introducing Brokers and commission structures</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Process Payouts</Button>
          <Button onClick={() => { setIBForm({ name: "", email: "", tier: "BRONZE", commissionRate: "" }); setEditingIB(null); setShowCreateModal(true); }}>+ Add New IB</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total IBs</p>
          <p className="text-2xl font-bold text-white">{totalIBs}</p>
          <p className="text-gray-400 text-sm">
            {ibs.length === 0 ? (
              <button onClick={seedIBs} className="text-fizmo-purple-400 hover:underline">
                Initialize IBs
              </button>
            ) : (
              "All partners"
            )}
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Active IBs</p>
          <p className="text-2xl font-bold text-green-500">{activeIBs}</p>
          <p className="text-gray-400 text-sm">
            {totalIBs > 0 ? `${((activeIBs / totalIBs) * 100).toFixed(0)}% active rate` : "0%"}
          </p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Total Volume (30d)</p>
          <p className="text-2xl font-bold text-white">
            ${(totalVolume30d / 1000000).toFixed(1)}M
          </p>
          <p className="text-gray-400 text-sm">Trading volume</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Pending Commission</p>
          <p className="text-2xl font-bold text-yellow-500">
            ${totalPendingCommission.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">Unpaid commissions</p>
        </div>
        <div className="glassmorphic rounded-xl p-4">
          <p className="text-gray-400 text-sm mb-1">Paid (30d)</p>
          <p className="text-2xl font-bold text-green-500">
            ${totalPaid30d.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">{paidPayouts30d.length} payouts</p>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab("active")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "active"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Active ({activeIBs})
            </button>
            <button
              onClick={() => setSelectedTab("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "all"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              All IBs
            </button>
            <button
              onClick={() => setSelectedTab("payouts")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === "payouts"
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              Commission Payouts
            </button>
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white text-sm">
              <option>All Tiers</option>
              <option>Platinum</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Bronze</option>
            </select>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* IB Table */}
      {(selectedTab === "active" || selectedTab === "all") && (
        <div className="glassmorphic rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Introducing Brokers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">IB ID</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">NAME</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">TIER</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">COMMISSION</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">CLIENTS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">VOLUME (30d)</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">PENDING</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {ibs
                  .filter((ib) => (selectedTab === "active" ? ib.status === "ACTIVE" : true))
                  .map((ib) => (
                    <tr
                      key={ib.id}
                      className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                    >
                      <td className="py-3 px-4 text-fizmo-purple-400 font-mono text-sm">
                        {ib.ibId}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <p className="text-white font-medium">{ib.name}</p>
                        <p className="text-gray-400 text-xs">{ib.email}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            ib.tier === "PLATINUM"
                              ? "bg-purple-500/20 text-purple-400"
                              : ib.tier === "GOLD"
                              ? "bg-yellow-500/20 text-yellow-500"
                              : ib.tier === "SILVER"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-orange-500/20 text-orange-500"
                          }`}
                        >
                          {ib.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white text-sm">{ib.commissionRate}%</td>
                      <td className="py-3 px-4 text-sm">
                        <p className="text-white font-semibold">{ib.activeClients}</p>
                        <p className="text-gray-400 text-xs">{ib.clientsReferred} total</p>
                      </td>
                      <td className="py-3 px-4 text-white font-semibold text-sm">
                        ${(ib.totalVolume / 1000000).toFixed(2)}M
                      </td>
                      <td className="py-3 px-4 text-yellow-500 font-semibold text-sm">
                        ${ib.pendingCommission.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ib.status === "ACTIVE"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {ib.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300">
                            View
                          </button>
                          <button onClick={() => openEditModal(ib)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Tier Structure Info */}
          <div className="mt-6 p-4 bg-fizmo-purple-500/10 border border-fizmo-purple-500/30 rounded-lg">
            <h4 className="text-fizmo-purple-400 font-semibold mb-2">Commission Tiers</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-purple-400 font-semibold">Platinum (35%)</p>
                <p className="text-gray-400 text-xs">&gt;$10M volume/month</p>
              </div>
              <div>
                <p className="text-yellow-500 font-semibold">Gold (30%)</p>
                <p className="text-gray-400 text-xs">$5M - $10M/month</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold">Silver (25%)</p>
                <p className="text-gray-400 text-xs">$2M - $5M/month</p>
              </div>
              <div>
                <p className="text-orange-500 font-semibold">Bronze (20%)</p>
                <p className="text-gray-400 text-xs">&lt;$2M/month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Payouts Table */}
      {selectedTab === "payouts" && (
        <div className="glassmorphic rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Commission Payouts</h2>
            {payouts.length === 0 && (
              <Button onClick={seedPayouts} size="sm">
                Initialize Payouts
              </Button>
            )}
          </div>
          {payouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No payouts found</p>
              <Button onClick={seedPayouts}>Initialize Default Payouts</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead>
                <tr className="border-b border-fizmo-purple-500/20">
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">PERIOD</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">IB</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">AMOUNT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">STATUS</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">PAID AT</th>
                  <th className="text-left text-gray-400 py-3 px-4 text-sm">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout: any) => (
                  <tr
                    key={payout.id}
                    className="border-b border-fizmo-purple-500/10 hover:bg-fizmo-dark-800 transition-all"
                  >
                    <td className="py-3 px-4 text-white text-sm">{payout.period}</td>
                    <td className="py-3 px-4 text-sm">
                      <p className="text-white font-medium">{payout.ibName}</p>
                      <p className="text-gray-400 text-xs">{payout.ibId}</p>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold text-sm">
                      ${payout.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payout.status === "PAID"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {payout.paidAt || "Pending"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {payout.status === "PENDING" ? (
                        <button
                          onClick={() => processPayment(payout.id)}
                          className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 text-xs"
                        >
                          Process Payment
                        </button>
                      ) : (
                        <button className="text-fizmo-purple-400 hover:text-fizmo-purple-300">
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {/* Payout Schedule Info */}
          {payouts.length > 0 && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-500 text-sm">
                <strong>Payout Schedule:</strong> Commission payouts are processed on the 15th of
                each month for the previous month's trading volume. Minimum payout threshold: $100.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing IBs (30d)</h3>
          <div className="space-y-3">
            {ibs.slice(0, 3).map((ib, idx) => (
              <div key={ib.id} className="flex items-center justify-between p-3 bg-fizmo-dark-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx === 0 ? "bg-yellow-500/20" : idx === 1 ? "bg-gray-400/20" : "bg-orange-500/20"
                  }`}>
                    <span className={`font-bold ${
                      idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : "text-orange-500"
                    }`}>
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{ib.name}</p>
                    <p className="text-gray-400 text-xs">{ib.activeClients} active clients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${(ib.totalVolume / 1000000).toFixed(2)}M</p>
                  <p className="text-gray-400 text-xs">volume</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">IB Network Growth</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Platinum Tier</span>
                <span className="text-purple-400 font-semibold">{platinumCount} IBs</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: totalIBs > 0 ? `${(platinumCount / totalIBs) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Gold Tier</span>
                <span className="text-yellow-500 font-semibold">{goldCount} IBs</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: totalIBs > 0 ? `${(goldCount / totalIBs) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Silver Tier</span>
                <span className="text-gray-400 font-semibold">{silverCount} IBs</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-500 rounded-full"
                  style={{ width: totalIBs > 0 ? `${(silverCount / totalIBs) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Bronze Tier</span>
                <span className="text-orange-500 font-semibold">{bronzeCount} IBs</span>
              </div>
              <div className="h-3 bg-fizmo-dark-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: totalIBs > 0 ? `${(bronzeCount / totalIBs) * 100}%` : "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit IB Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glassmorphic rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingIB ? "Edit IB" : "Add New IB"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={ibForm.name}
                  onChange={(e) => setIBForm({ ...ibForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={ibForm.email}
                  onChange={(e) => setIBForm({ ...ibForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tier</label>
                <select
                  value={ibForm.tier}
                  onChange={(e) => setIBForm({ ...ibForm, tier: e.target.value })}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                >
                  <option value="BRONZE">Bronze (20%)</option>
                  <option value="SILVER">Silver (25%)</option>
                  <option value="GOLD">Gold (30%)</option>
                  <option value="PLATINUM">Platinum (35%)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  value={ibForm.commissionRate}
                  onChange={(e) => setIBForm({ ...ibForm, commissionRate: e.target.value })}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  placeholder="Leave blank for tier default"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!ibForm.name.trim() || !ibForm.email.trim() || saving}
                  onClick={saveIB}
                >
                  {saving ? "Saving..." : editingIB ? "Update IB" : "Create IB"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
