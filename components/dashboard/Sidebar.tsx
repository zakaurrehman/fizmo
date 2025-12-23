"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { IconType } from "react-icons";
import { FaHome, FaBriefcase, FaDollarSign, FaMoneyBillWave, FaChartBar, FaChartLine, FaExchangeAlt, FaUser, FaBell, FaComments } from "react-icons/fa";

interface MenuItem {
  icon: IconType;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: FaHome, label: "Dashboard", href: "/dashboard" },
  { icon: FaBriefcase, label: "Accounts", href: "/dashboard/accounts" },
  { icon: FaDollarSign, label: "Deposit", href: "/dashboard/deposit" },
  { icon: FaMoneyBillWave, label: "Withdraw", href: "/dashboard/withdraw" },
  { icon: FaChartBar, label: "Transactions", href: "/dashboard/transactions" },
  { icon: FaChartLine, label: "Trading History", href: "/dashboard/trading-history" },
  { icon: FaExchangeAlt, label: "Internal Transfer", href: "/dashboard/internal-transfer" },
  { icon: FaUser, label: "KYC & Profile", href: "/dashboard/profile" },
  { icon: FaBell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: FaComments, label: "Support / Tickets", href: "/dashboard/support" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-fizmo bg-clip-text text-transparent">
              Fizmo
            </h1>
          </Link>
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
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
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
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="text-white font-medium truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
