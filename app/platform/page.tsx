import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { FaChartLine, FaShieldAlt, FaHandshake, FaChartBar, FaBolt, FaCreditCard, FaBitcoin, FaSearch, FaEnvelope, FaMobileAlt } from "react-icons/fa";

export default function PlatformPage() {
  const modules = [
    {
      title: "Trader's Room",
      description: "Complete client portal for traders to manage accounts, deposits, withdrawals, and track their trading performance in real-time.",
      icon: FaChartLine,
      features: [
        "Live & Demo account management",
        "Instant deposit & withdrawal processing",
        "Real-time transaction history",
        "Trading performance analytics",
        "Multi-currency support",
        "KYC & profile management",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Admin Back Office",
      description: "Comprehensive broker management dashboard for monitoring clients, transactions, compliance, and overall business operations.",
      icon: FaShieldAlt,
      features: [
        "Client & account management",
        "Deposit/withdrawal approvals",
        "AML monitoring & compliance",
        "User roles & permissions",
        "Real-time reports & analytics",
        "Audit logs & system settings",
      ],
      color: "from-pink-500 to-red-500",
    },
    {
      title: "IB Management",
      description: "Powerful introducing broker (IB) and affiliate management system with automated commission tracking and payouts.",
      icon: FaHandshake,
      features: [
        "Multi-tier IB hierarchies",
        "Automated commission calculations",
        "Real-time referral tracking",
        "Custom commission structures",
        "IB performance dashboards",
        "Payout management system",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Reporting & BI",
      description: "Advanced business intelligence and reporting tools with customizable dashboards and data export capabilities.",
      icon: FaChartBar,
      features: [
        "Customizable report builder",
        "Real-time data visualization",
        "Fund flow analysis charts",
        "Client growth analytics",
        "Trading volume metrics",
        "Export to CSV/PDF/Excel",
      ],
      color: "from-green-500 to-emerald-500",
    },
  ];

  const integrations = [
    { name: "MT4/MT5 Bridge", icon: FaBolt, status: "Ready" },
    { name: "Stripe Payments", icon: FaCreditCard, status: "Ready" },
    { name: "Crypto Wallets", icon: FaBitcoin, status: "Ready" },
    { name: "KYC Providers", icon: FaSearch, status: "Ready" },
    { name: "Email Service", icon: FaEnvelope, status: "Ready" },
    { name: "SMS Gateway", icon: FaMobileAlt, status: "Ready" },
  ];

  return (
    <div className="min-h-screen dark-navy-bg">
      <MarketingNav />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-12 lg:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
            Complete Forex CRM Platform
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-6 lg:mb-8">
            Everything you need to run a successful forex brokerage. Four powerful modules
            working together seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Start Free Trial
            </Link>
            <button className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto">
              Request Demo
            </button>
          </div>
        </div>

        {/* Platform Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-20">
          {modules.map((module, index) => {
            const ModuleIcon = module.icon;
            return (
              <div
                key={index}
                className="glassmorphic-glow rounded-2xl p-6 lg:p-8 hover-lift"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl lg:text-3xl text-white`}
                  >
                    <ModuleIcon />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {module.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-400">{module.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-fizmo-purple-400 uppercase">
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-sm lg:text-base">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Integrations Section */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8 mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready-to-Use Integrations
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Connect with industry-leading services out of the box
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integration, index) => {
              const IntegrationIcon = integration.icon;
              return (
                <div
                  key={index}
                  className="card-3d p-4 lg:p-6 text-center hover-lift"
                >
                  <div className="text-3xl lg:text-4xl mb-3 flex items-center justify-center text-fizmo-purple-400">
                    <IntegrationIcon />
                  </div>
                  <p className="text-white font-medium text-sm lg:text-base mb-2">
                    {integration.name}
                  </p>
                  <span className="inline-block px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                    {integration.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8 mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Built with Modern Technology
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Enterprise-grade stack for reliability and performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-fizmo-dark-800 rounded-xl flex items-center justify-center text-3xl lg:text-4xl">
                ⚛️
              </div>
              <h4 className="text-white font-semibold text-sm lg:text-base">Next.js 16</h4>
              <p className="text-gray-500 text-xs lg:text-sm">React Framework</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-fizmo-dark-800 rounded-xl flex items-center justify-center text-3xl lg:text-4xl">
                🗄️
              </div>
              <h4 className="text-white font-semibold text-sm lg:text-base">PostgreSQL</h4>
              <p className="text-gray-500 text-xs lg:text-sm">Database</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-fizmo-dark-800 rounded-xl flex items-center justify-center text-3xl lg:text-4xl">
                🔷
              </div>
              <h4 className="text-white font-semibold text-sm lg:text-base">TypeScript</h4>
              <p className="text-gray-500 text-xs lg:text-sm">Type Safety</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-fizmo-dark-800 rounded-xl flex items-center justify-center text-3xl lg:text-4xl">
                🔐
              </div>
              <h4 className="text-white font-semibold text-sm lg:text-base">JWT Auth</h4>
              <p className="text-gray-500 text-xs lg:text-sm">Security</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="glassmorphic-glow rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Ready to Transform Your Brokerage?
          </h3>
          <p className="text-base lg:text-xl text-gray-400 mb-6 lg:mb-8 max-w-2xl mx-auto">
            Join modern forex brokers using Fizmo to streamline operations and scale their
            business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      <CurvedFooter />
    </div>
  );
}
