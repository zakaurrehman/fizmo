"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { IconType } from "react-icons";
import { FaChartBar, FaUsers, FaUser, FaBriefcase, FaExchangeAlt, FaDollarSign, FaMoneyBillWave, FaExclamationTriangle, FaHandshake, FaChartLine, FaShieldAlt, FaFileAlt, FaCog } from "react-icons/fa";
import { Logo } from "@/components/ui/Logo";

interface MenuItem {
  icon: IconType;
  label: string;
  href: string;
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
  { icon: FaHandshake, label: "IB Management", href: "/admin/ib" },
  { icon: FaChartLine, label: "Reports & BI", href: "/admin/reports" },
  { icon: FaShieldAlt, label: "User Roles & Permissions", href: "/admin/roles" },
  { icon: FaFileAlt, label: "Audit Logs", href: "/admin/audit" },
  { icon: FaCog, label: "Settings", href: "/admin/settings" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          {menuItems.map((item) => {
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
