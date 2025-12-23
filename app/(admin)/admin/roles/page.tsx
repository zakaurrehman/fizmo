"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function UserRolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>("admin");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock roles data
  const roles = [
    {
      id: "admin",
      name: "Admin",
      description: "Full system access with all permissions",
      userCount: 5,
      permissions: [
        "clients.view",
        "clients.edit",
        "clients.delete",
        "accounts.view",
        "accounts.edit",
        "accounts.delete",
        "transactions.view",
        "transactions.approve",
        "deposits.view",
        "deposits.approve",
        "withdrawals.view",
        "withdrawals.approve",
        "reports.view",
        "reports.generate",
        "settings.view",
        "settings.edit",
        "audit.view",
        "roles.view",
        "roles.edit",
      ],
      createdAt: "2024-01-15",
      isSystem: true,
    },
    {
      id: "support",
      name: "Support Agent",
      description: "Customer support with limited financial access",
      userCount: 12,
      permissions: [
        "clients.view",
        "accounts.view",
        "transactions.view",
        "deposits.view",
        "withdrawals.view",
        "tickets.view",
        "tickets.respond",
      ],
      createdAt: "2024-02-10",
      isSystem: false,
    },
    {
      id: "compliance",
      name: "Compliance Officer",
      description: "AML/KYC monitoring and compliance oversight",
      userCount: 3,
      permissions: [
        "clients.view",
        "kyc.view",
        "kyc.approve",
        "kyc.reject",
        "aml.view",
        "aml.investigate",
        "transactions.view",
        "reports.view",
        "audit.view",
      ],
      createdAt: "2024-01-20",
      isSystem: false,
    },
    {
      id: "accountant",
      name: "Accountant",
      description: "Financial reporting and reconciliation",
      userCount: 2,
      permissions: [
        "transactions.view",
        "deposits.view",
        "withdrawals.view",
        "reports.view",
        "reports.generate",
        "ledger.view",
      ],
      createdAt: "2024-02-01",
      isSystem: false,
    },
  ];

  // Mock users assigned to roles
  const usersInRole = {
    admin: [
      { id: "1", name: "John Smith", email: "john@fizmo.com", assignedAt: "2024-01-15" },
      { id: "2", name: "Sarah Johnson", email: "sarah@fizmo.com", assignedAt: "2024-02-01" },
      { id: "3", name: "Mike Wilson", email: "mike@fizmo.com", assignedAt: "2024-03-10" },
    ],
    support: [
      { id: "4", name: "Emma Brown", email: "emma@fizmo.com", assignedAt: "2024-02-15" },
      { id: "5", name: "David Lee", email: "david@fizmo.com", assignedAt: "2024-03-01" },
    ],
    compliance: [
      { id: "6", name: "Lisa Anderson", email: "lisa@fizmo.com", assignedAt: "2024-01-25" },
    ],
    accountant: [
      { id: "7", name: "Tom Martinez", email: "tom@fizmo.com", assignedAt: "2024-02-05" },
    ],
  };

  // Permission categories
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
  const assignedUsers = selectedRole ? usersInRole[selectedRole as keyof typeof usersInRole] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Roles & Permissions</h1>
          <p className="text-gray-400">Manage roles and assign permissions to control system access</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Create New Role</Button>
      </div>

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
                      <>
                        <Button variant="outline" size="sm">
                          Edit Role
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </>
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
                    <p className="text-white font-bold text-lg">{activeRole.createdAt}</p>
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

              {/* Assigned Users */}
              <div className="glassmorphic rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Assigned Users</h3>
                  <Button variant="outline" size="sm">
                    Assign User
                  </Button>
                </div>
                <div className="space-y-2">
                  {assignedUsers.length > 0 ? (
                    assignedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 text-xs">
                            Assigned: {user.assignedAt}
                          </span>
                          {!activeRole.isSystem && (
                            <button className="text-red-400 hover:text-red-300 text-sm">
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No users assigned to this role
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail */}
              <div className="glassmorphic rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Changes</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-fizmo-dark-800 rounded-lg">
                    <span className="text-2xl">👤</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">User assigned to role</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Mike Wilson was assigned to {activeRole.name} role
                      </p>
                      <p className="text-gray-500 text-xs mt-1">2024-03-10 14:30 by admin@fizmo.com</p>
                    </div>
                  </div>

                  {!activeRole.isSystem && (
                    <div className="flex items-start space-x-3 p-3 bg-fizmo-dark-800 rounded-lg">
                      <span className="text-2xl">✏️</span>
                      <div className="flex-1">
                        <p className="text-white text-sm">Permissions updated</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Added 2 new permissions to {activeRole.name} role
                        </p>
                        <p className="text-gray-500 text-xs mt-1">2024-02-15 10:15 by admin@fizmo.com</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 bg-fizmo-dark-800 rounded-lg">
                    <span className="text-2xl">➕</span>
                    <div className="flex-1">
                      <p className="text-white text-sm">Role created</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {activeRole.name} role was created
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{activeRole.createdAt} by admin@fizmo.com</p>
                    </div>
                  </div>
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

      {/* Create Role Modal (placeholder) */}
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
              <Input label="Role Name" placeholder="e.g., Sales Manager" />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of this role..."
                  className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 min-h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Permissions
                </label>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {permissionCategories.map((category) => (
                    <div key={category.name} className="p-4 bg-fizmo-dark-800 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">{category.name}</h4>
                      <div className="space-y-2">
                        {category.permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-fizmo-purple-500"
                            />
                            <span className="text-gray-300 text-sm">{permission.label}</span>
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
                <Button className="flex-1">Create Role</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
