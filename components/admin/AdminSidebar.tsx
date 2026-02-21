"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useState } from "react";
import { IconType } from "react-icons";
import {
  FaChartBar, FaUsersCog, FaGift, FaHandshake, FaLayerGroup,
  FaExchangeAlt, FaBullhorn, FaEnvelope, FaNewspaper, FaBell,
  FaTrophy, FaChartLine, FaShieldAlt, FaTicketAlt, FaCog, FaUserShield,
  FaChevronDown, FaChevronUp,
} from "react-icons/fa";
import { Logo } from "@/components/ui/Logo";

interface SidebarLink {
  type: "link";
  icon: IconType;
  label: string;
  href: string;
}

interface SidebarSection {
  type: "section";
  icon: IconType;
  label: string;
  items: { label: string; href: string }[];
}

type SidebarItem = SidebarLink | SidebarSection;

const sidebarConfig: SidebarItem[] = [
  {
    type: "link",
    icon: FaChartBar,
    label: "Dashboard",
    href: "/admin",
  },
  {
    type: "section",
    icon: FaUsersCog,
    label: "User Management",
    items: [
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
    ],
  },
  {
    type: "section",
    icon: FaGift,
    label: "Bonus",
    items: [
      { label: "Bonus List", href: "/admin/bonus/list" },
      { label: "Add Bonus", href: "/admin/bonus/add" },
    ],
  },
  {
    type: "section",
    icon: FaHandshake,
    label: "IB Management",
    items: [
      { label: "IB Users", href: "/admin/ib-management/users" },
      { label: "IB Requests", href: "/admin/ib-management/requests" },
      { label: "IB Plan", href: "/admin/ib-management/plan" },
      { label: "Commission Group", href: "/admin/ib-management/commission-group" },
      { label: "Set IB Commission", href: "/admin/ib-management/set-commission" },
      { label: "Move client to IB", href: "/admin/ib-management/move-client" },
    ],
  },
  {
    type: "section",
    icon: FaLayerGroup,
    label: "Group Management",
    items: [
      { label: "Group List", href: "/admin/group-management/list" },
      { label: "Add Group", href: "/admin/group-management/add" },
    ],
  },
  {
    type: "section",
    icon: FaExchangeAlt,
    label: "Transaction",
    items: [
      { label: "Client Deposit", href: "/admin/transactions/client-deposit" },
      { label: "Client Withdraw", href: "/admin/transactions/client-withdraw" },
      { label: "IB Withdraw", href: "/admin/transactions/ib-withdraw" },
      { label: "Internal Transfer", href: "/admin/transactions/internal-transfer" },
      { label: "Pending Deposit", href: "/admin/transactions/pending-deposit" },
      { label: "Pending Withdraw", href: "/admin/transactions/pending-withdraw" },
      { label: "Pending IB Withdraw", href: "/admin/transactions/pending-ib-withdraw" },
    ],
  },
  {
    type: "section",
    icon: FaBullhorn,
    label: "Marketing",
    items: [
      { label: "Add Marketing", href: "/admin/marketing/add" },
      { label: "Marketing List", href: "/admin/marketing/list" },
      { label: "Assign Marketing Group", href: "/admin/marketing/assign-group" },
      { label: "Incentive Report", href: "/admin/marketing/incentive-report" },
      { label: "Marketing Withdraw Report", href: "/admin/marketing/withdraw-report" },
      { label: "Bulk Lead Upload", href: "/admin/marketing/bulk-upload" },
      { label: "Lead List", href: "/admin/marketing/leads" },
    ],
  },
  {
    type: "link",
    icon: FaEnvelope,
    label: "Send Email",
    href: "/admin/send-email",
  },
  {
    type: "link",
    icon: FaNewspaper,
    label: "News",
    href: "/admin/news",
  },
  {
    type: "section",
    icon: FaBell,
    label: "Notification",
    items: [
      { label: "Notification List", href: "/admin/notifications/list" },
      { label: "Send Notification", href: "/admin/notifications/send" },
    ],
  },
  {
    type: "section",
    icon: FaTrophy,
    label: "Rewards Management",
    items: [
      { label: "Rewards List", href: "/admin/rewards/list" },
      { label: "Add Reward", href: "/admin/rewards/add" },
    ],
  },
  {
    type: "section",
    icon: FaChartLine,
    label: "All Reports",
    items: [
      { label: "Deposit Report", href: "/admin/reports/deposits" },
      { label: "Withdraw Report", href: "/admin/reports/withdrawals" },
      { label: "IB Withdraw Report", href: "/admin/reports/ib-withdrawals" },
      { label: "Internal Transfer Report", href: "/admin/reports/transfers" },
      { label: "Wallet History Report", href: "/admin/reports/wallet-history" },
      { label: "Position Report", href: "/admin/reports/positions" },
      { label: "History Report", href: "/admin/reports/history" },
      { label: "Login Activity", href: "/admin/reports/login-activity" },
    ],
  },
  {
    type: "section",
    icon: FaShieldAlt,
    label: "Risk Management Reports",
    items: [
      { label: "Profit Risk Report", href: "/admin/risk/profit-risk" },
      { label: "Scalping Trade Report", href: "/admin/risk/scalping-trade" },
    ],
  },
  {
    type: "link",
    icon: FaTicketAlt,
    label: "Tickets",
    href: "/admin/support",
  },
  {
    type: "section",
    icon: FaCog,
    label: "Settings",
    items: [
      { label: "Deposit Bank Details", href: "/admin/settings/bank-details" },
      { label: "Rate Setting", href: "/admin/settings/rate" },
      { label: "Promotion List", href: "/admin/settings/promotions" },
    ],
  },
  {
    type: "section",
    icon: FaUserShield,
    label: "Sub Admin",
    items: [
      { label: "Create Sub Admin", href: "/admin/sub-admin/create" },
      { label: "Sub Admin List", href: "/admin/sub-admin/list" },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const activeSection = sidebarConfig.find(
    (item) =>
      item.type === "section" &&
      item.items.some((sub) => pathname.startsWith(sub.href))
  )?.label ?? null;

  const [openSection, setOpenSection] = useState<string | null>(activeSection);

  const toggleSection = (label: string) => {
    setOpenSection((prev) => (prev === label ? null : label));
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-fizmo-dark-800 border-r border-fizmo-purple-500/20 min-h-screen flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-5 border-b border-fizmo-purple-500/20">
          <Logo href="/admin" width={110} height={36} showText={true} text="Admin" />
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {sidebarConfig.map((item) => {
            if (item.type === "link") {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-[13px] ${
                    isActive
                      ? "bg-fizmo-purple-500 text-white"
                      : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </Link>
              );
            }

            const isExpanded = openSection === item.label;
            const isSectionActive = item.items.some((sub) =>
              pathname.startsWith(sub.href)
            );
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-[13px] ${
                    isSectionActive
                      ? "bg-fizmo-purple-500 text-white"
                      : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <FaChevronUp className="w-3 h-3 flex-shrink-0 ml-1" />
                  ) : (
                    <FaChevronDown className="w-3 h-3 flex-shrink-0 ml-1" />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-3 mt-0.5 mb-1 space-y-0.5 border-l border-fizmo-purple-500/30 pl-3">
                    {item.items.map((sub) => {
                      const isActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className={`block px-2 py-1.5 rounded-md transition-all text-[12px] ${
                            isActive
                              ? "bg-fizmo-purple-500/30 text-white"
                              : "text-gray-400 hover:bg-fizmo-dark-700 hover:text-white"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-fizmo-purple-500/20">
          <div className="mb-3 px-2">
            <p className="text-[11px] text-gray-400">Admin User</p>
            <p className="text-white font-medium text-[13px] truncate">{user?.email}</p>
            <p className="text-[11px] text-fizmo-purple-400 mt-0.5">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-[13px] font-medium"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
