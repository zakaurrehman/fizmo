"use client";

import { useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useProtectedRoute();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fizmo-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-dark">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-0 z-30 bg-fizmo-dark-800/95 backdrop-blur-sm border-b border-fizmo-purple-500/20">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold bg-gradient-fizmo bg-clip-text text-transparent">
              Fizmo
            </h2>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-fizmo-dark-700 text-white hover:bg-fizmo-dark-600 transition-all"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="container mx-auto p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
