"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function UserRolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/roles");
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
        // Auto-select first role
        if (data.roles && data.roles.length > 0 && !selectedRole) {
          setSelectedRole(data.roles[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function seedRoles() {
    if (!confirm("Initialize default roles? This will only work if no roles exist.")) {
      return;
    }

    try {
      const response = await fetch("/api/admin/roles/seed", {
        method: "POST",
      });

      if (response.ok) {
        alert("Default roles initialized!");
        fetchRoles();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to initialize roles");
      }
    } catch (error) {
      console.error("Failed to seed roles:", error);
      alert("Failed to initialize roles");
    }
  }

  async function deleteRole(roleId: string) {
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/roles?id=${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Role deleted successfully!");
        fetchRoles();
        setSelectedRole(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete role");
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      alert("Failed to delete role");
    }
  }

  // Permission categories for display
  const permissionCategories = [
    {
      name: "Client Management",
      permissions: [
        { id: "clients.view", label: "View Clients" },
        { id: "clients.edit", label: "Edit Clients" },
        { id: "clients.delete", label: "Delete Clients" },
      ],
    },
    {
      name: "Account Management",
      permissions: [
        { id: "accounts.view", label: "View Accounts" },
        { id: "accounts.edit", label: "Edit Accounts" },
        { id: "accounts.delete", label: "Delete Accounts" },
      ],
    },
    {
      name: "Transactions",
      permissions: [
        { id: "transactions.view", label: "View Transactions" },
        { id: "transactions.approve", label: "Approve Transactions" },
      ],
    },
    {
      name: "Deposits",
      permissions: [
        { id: "deposits.view", label: "View Deposits" },
        { id: "deposits.approve", label: "Approve Deposits" },
      ],
    },
    {
      name: "Withdrawals",
      permissions: [
        { id: "withdrawals.view", label: "View Withdrawals" },
        { id: "withdrawals.approve", label: "Approve Withdrawals" },
      ],
    },
    {
      name: "KYC/AML",
      permissions: [
        { id: "kyc.view", label: "View KYC Documents" },
        { id: "kyc.approve", label: "Approve KYC" },
        { id: "kyc.reject", label: "Reject KYC" },
        { id: "aml.view", label: "View AML Alerts" },
        { id: "aml.investigate", label: "Investigate AML Cases" },
      ],
    },
    {
      name: "Reports & Analytics",
      permissions: [
        { id: "reports.view", label: "View Reports" },
        { id: "reports.generate", label: "Generate Reports" },
        { id: "ledger.view", label: "View Ledger" },
      ],
    },
    {
      name: "Support",
      permissions: [
        { id: "tickets.view", label: "View Tickets" },
        { id: "tickets.respond", label: "Respond to Tickets" },
      ],
    },
    {
      name: "System Administration",
      permissions: [
        { id: "settings.view", label: "View Settings" },
        { id: "settings.edit", label: "Edit Settings" },
        { id: "audit.view", label: "View Audit Logs" },
        { id: "roles.view", label: "View Roles" },
        { id: "roles.edit", label: "Edit Roles" },
      ],
    },
  ];

  const activeRole = roles.find((r) => r.id === selectedRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Roles & Permissions</h1>
          <p className="text-gray-400">Manage roles and assign permissions to control system access</p>
        </div>
        <div className="flex space-x-3">
          {roles.length === 0 && (
            <Button variant="outline" onClick={seedRoles}>Initialize Default Roles</Button>
          )}
          <Button onClick={() => setShowCreateModal(true)}>Create New Role</Button>
        </div>
      </div>

      {roles.length === 0 ? (
        <div className="glassmorphic rounded-xl p-12 text-center">
          <p className="text-gray-400 mb-4">No roles found. Initialize default roles to get started.</p>
          <Button onClick={seedRoles}>Initialize Default Roles</Button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Roles</h3>
                <span className="text-2xl">🔐</span>
              </div>
              <p className="text-3xl font-bold text-white">{roles.length}</p>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Total Users</h3>
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">System Roles</h3>
                <span className="text-2xl">⚙️</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {roles.filter((r) => r.isSystem).length}
              </p>
            </div>

            <div className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-400 text-sm">Custom Roles</h3>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {roles.filter((r) => !r.isSystem).length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Roles List */}
            <div className="lg:col-span-1 glassmorphic rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Roles</h2>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.id
                        ? "bg-fizmo-purple-500/20 border-l-4 border-fizmo-purple-500"
                        : "bg-fizmo-dark-800 hover:bg-fizmo-dark-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold">{role.name}</h3>
                          {role.isSystem && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-500 text-xs">{role.userCount} users</span>
                      <span className="text-gray-500 text-xs">{role.permissions.length} permissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Details */}
            <div className="lg:col-span-2 space-y-6">
              {activeRole ? (
                <>
                  {/* Role Info */}
                  <div className="glassmorphic rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-2xl font-bold text-white">{activeRole.name}</h2>
                          {activeRole.isSystem && (
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                              System Role
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400">{activeRole.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        {!activeRole.isSystem && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRole(activeRole.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-fizmo-purple-500/20">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Users Assigned</p>
                        <p className="text-white font-bold text-lg">{activeRole.userCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Permissions</p>
                        <p className="text-white font-bold text-lg">{activeRole.permissions.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Created</p>
                        <p className="text-white font-bold text-lg">
                          {new Date(activeRole.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="glassmorphic rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Permissions</h3>
                    <div className="space-y-4">
                      {permissionCategories.map((category) => {
                        const categoryPermissions = category.permissions.filter((p) =>
                          activeRole.permissions.includes(p.id)
                        );

                        if (categoryPermissions.length === 0) return null;

                        return (
                          <div key={category.name} className="p-4 bg-fizmo-dark-800 rounded-lg">
                            <h4 className="text-white font-semibold mb-3">{category.name}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {category.permissions.map((permission) => {
                                const hasPermission = activeRole.permissions.includes(permission.id);
                                return (
                                  <label
                                    key={permission.id}
                                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                                      hasPermission ? "bg-fizmo-purple-500/10" : "opacity-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={hasPermission}
                                      disabled={activeRole.isSystem}
                                      className="rounded border-fizmo-purple-500"
                                      readOnly
                                    />
                                    <span className="text-gray-300 text-sm">{permission.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="glassmorphic rounded-xl p-12 text-center">
                  <p className="text-gray-400">Select a role to view details</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glassmorphic rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Role</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  placeholder="e.g. Support Manager"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Description</label>
                <input
                  type="text"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
                  placeholder="Brief description of this role"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Permissions</label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {permissionCategories.map((category) => (
                    <div key={category.name} className="p-3 bg-fizmo-dark-800 rounded-lg">
                      <h4 className="text-white font-semibold text-sm mb-2">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.permissions.map((perm) => (
                          <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newRolePermissions.includes(perm.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRolePermissions([...newRolePermissions, perm.id]);
                                } else {
                                  setNewRolePermissions(newRolePermissions.filter((p) => p !== perm.id));
                                }
                              }}
                              className="rounded border-fizmo-purple-500"
                            />
                            <span className="text-gray-300 text-sm">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!newRoleName.trim() || saving}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const res = await fetch("/api/admin/roles", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: newRoleName.trim(),
                          description: newRoleDescription.trim(),
                          permissions: newRolePermissions,
                        }),
                      });
                      if (res.ok) {
                        setShowCreateModal(false);
                        setNewRoleName("");
                        setNewRoleDescription("");
                        setNewRolePermissions([]);
                        fetchRoles();
                      } else {
                        const data = await res.json();
                        alert(data.error || "Failed to create role");
                      }
                    } catch {
                      alert("Failed to create role");
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {saving ? "Creating..." : "Create Role"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
