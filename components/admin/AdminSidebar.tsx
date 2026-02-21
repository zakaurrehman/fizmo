"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useState } from "react";
import { IconType } from "react-icons";
import { FaChartBar, FaUsers, FaUser, FaBriefcase, FaExchangeAlt, FaDollarSign, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaChartLine, FaShieldAlt, FaFileAlt, FaCog, FaHeadset, FaServer, FaUsersCog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Logo } from "@/components/ui/Logo";

interface MenuItem {
  icon: IconType;
  label: string;
  href: string;
}

interface MenuSection {
  icon: IconType;
  label: string;
  items: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { icon: FaChartBar, label: "Dashboard", href: "/admin" },
  { icon: FaUsers, label: "Clients", href: "/admin/clients" },
  { icon: FaUser, label: "Client Profile", href: "/admin/client-profile" },
  { icon: FaBriefcase, label: "Accounts", href: "/admin/accounts" },
  { icon: FaExchangeAlt, label: "Transactions", href: "/admin/transactions" },
  { icon: FaDollarSign, label: "Deposits", href: "/admin/deposits" },
  { icon: FaMoneyBillWave, label: "Withdrawals", href: "/admin/withdrawals" },
  { icon: FaExclamationTriangle, label: "AML Monitoring", href: "/admin/aml" },
  { icon: FaHeadset, label: "Support Tickets", href: "/admin/support" },
  { icon: FaHandshake, label: "IB Management", href: "/admin/ib" },
  { icon: FaChartLine, label: "Reports & BI", href: "/admin/reports" },
  { icon: FaShieldAlt, label: "User Roles & Permissions", href: "/admin/roles" },
  { icon: FaFileAlt, label: "Audit Logs", href: "/admin/audit" },
  { icon: FaCog, label: "Settings", href: "/admin/settings" },
  { icon: FaServer, label: "MT4/MT5 Integration", href: "/admin/mt4-integration" },
];

const userManagementItems = [
  { label: "Add User", href: "/admin/user-management/add-user" },
  { label: "User List", href: "/admin/user-management/user-list" },
  { label: "Create MT5 Account", href: "/admin/user-management/create-account" },
  { label: "MT5 User List", href: "/admin/user-management/mt5-accounts" },
  { label: "Follow Up List", href: "/admin/user-management/follow-up" },
  { label: "Pending Documents List", href: "/admin/user-management/pending-docs" },
  { label: "Approved Documents List", href: "/admin/user-management/approved-docs" },
  { label: "Upload User Documents", href: "/admin/user-management/upload-docs" },
  { label: "Add Bank Details", href: "/admin/user-management/add-bank" },
  { label: "Bank Details List", href: "/admin/user-management/bank-list" },
  { label: "User Password List", href: "/admin/user-management/passwords" },
  { label: "Change User Password", href: "/admin/user-management/change-password" },
  { label: "Add Existing Client", href: "/admin/user-management/add-existing" },
  { label: "Change MT5 Password", href: "/admin/user-management/mt5-password" },
  { label: "Update MT5 Leverage", href: "/admin/user-management/mt5-leverage" },
  { label: "Resend Verification Mail", href: "/admin/user-management/resend-verification" },
  { label: "Resend MT5 Data Mail", href: "/admin/user-management/resend-mt5-data" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isUserMgmtActive = userManagementItems.some(item => pathname.startsWith(item.href));
  const [userMgmtOpen, setUserMgmtOpen] = useState(isUserMgmtActive);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-fizmo-dark-800 border-r border-fizmo-purple-500/20 min-h-screen flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-fizmo-purple-500/20">
          <Logo href="/admin" width={120} height={40} showText={true} text="Admin" />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Dashboard first */}
          {menuItems.slice(0, 1).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-fizmo-purple-500/20 text-white border-l-4 border-fizmo-purple-500"
                    : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* User Management collapsible section */}
          <div>
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-sm ${
                isUserMgmtActive
                  ? "bg-fizmo-purple-500/20 text-white"
                  : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaUsersCog className="w-5 h-5" />
                <span className="font-medium">User Management</span>
              </div>
              {userMgmtOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
            </button>

            {userMgmtOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-fizmo-purple-500/20 pl-3">
                {userManagementItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onClose()}
                      className={`block px-3 py-2 rounded-lg transition-all text-xs ${
                        isActive
                          ? "bg-fizmo-purple-500/20 text-white border-l-2 border-fizmo-purple-500"
                          : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining menu items */}
          {menuItems.slice(1).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-sm ${
                  isActive
                    ? "bg-fizmo-purple-500/20 text-white border-l-4 border-fizmo-purple-500"
                    : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-fizmo-purple-500/20">
          <div className="mb-3 px-4">
            <p className="text-xs text-gray-400">Admin User</p>
            <p className="text-white font-medium text-sm truncate">{user?.email}</p>
            <p className="text-xs text-fizmo-purple-400 mt-1">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
