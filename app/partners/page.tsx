import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { FaMoneyBillWave, FaChartBar, FaBullseye, FaHandshake, FaCreditCard, FaChartLine } from "react-icons/fa";

export default function PartnersPage() {
  const benefits = [
    {
      icon: FaMoneyBillWave,
      title: "Competitive Commissions",
      description:
        "Earn up to 60% revenue share with our tiered commission structure. The more you refer, the more you earn.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FaChartBar,
      title: "Real-Time Dashboard",
      description:
        "Track your referrals, commissions, and performance metrics in real-time through our advanced IB portal.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaBullseye,
      title: "Marketing Support",
      description:
        "Access professional marketing materials, banners, landing pages, and promotional tools to grow faster.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FaHandshake,
      title: "Dedicated Support",
      description:
        "Get priority support from our partnership team to help you succeed and resolve issues quickly.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: FaCreditCard,
      title: "Fast Payouts",
      description:
        "Receive your commissions on time, every time. Multiple payout methods including bank transfer and crypto.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: FaChartLine,
      title: "Multi-Tier Structure",
      description:
        "Build your own network with our multi-level IB program. Earn from sub-affiliates and create passive income.",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const commissionTiers = [
    {
      tier: "Bronze",
      clients: "0-50",
      revenue: "30%",
      perks: ["Basic marketing materials", "Email support", "Monthly payouts"],
    },
    {
      tier: "Silver",
      clients: "51-150",
      revenue: "40%",
      perks: [
        "Advanced marketing suite",
        "Priority email support",
        "Bi-weekly payouts",
        "Dedicated IB manager",
      ],
      popular: true,
    },
    {
      tier: "Gold",
      clients: "151-500",
      revenue: "50%",
      perks: [
        "Custom landing pages",
        "24/7 priority support",
        "Weekly payouts",
        "Dedicated account manager",
        "Sub-affiliate commissions",
      ],
    },
    {
      tier: "Platinum",
      clients: "500+",
      revenue: "60%",
      perks: [
        "White-label solutions",
        "VIP support line",
        "Real-time payouts",
        "Personal relationship manager",
        "Multi-tier sub-affiliates",
        "Custom commission structure",
      ],
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Fill out our simple IB registration form and get approved within 24 hours.",
    },
    {
      number: "02",
      title: "Get Your Links",
      description: "Access your unique referral links and marketing materials from the IB portal.",
    },
    {
      number: "03",
      title: "Promote",
      description: "Share your links through your website, social media, or advertising channels.",
    },
    {
      number: "04",
      title: "Earn Commissions",
      description: "Get paid for every trade your referred clients make. Track everything in real-time.",
    },
  ];

  return (
    <div className="min-h-screen dark-navy-bg">
      <MarketingNav />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-12 lg:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
            Partner with Fizmo
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-6 lg:mb-8">
            Join our Introducing Broker (IB) program and earn competitive commissions by
            referring traders to our platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Become an IB
            </Link>
            <Link
              href="/contact"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto"
            >
              Contact Partnership Team
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-20">
          <div className="card-3d rounded-2xl p-4 lg:p-6 text-center hover-lift">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
              60%
            </div>
            <p className="text-gray-400 text-sm lg:text-base">Revenue Share</p>
          </div>
          <div className="card-3d rounded-2xl p-4 lg:p-6 text-center hover-lift">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
              $50M+
            </div>
            <p className="text-gray-400 text-sm lg:text-base">Paid to IBs</p>
          </div>
          <div className="card-3d rounded-2xl p-4 lg:p-6 text-center hover-lift">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
              2,500+
            </div>
            <p className="text-gray-400 text-sm lg:text-base">Active Partners</p>
          </div>
          <div className="card-3d rounded-2xl p-4 lg:p-6 text-center hover-lift">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-gray-400 text-sm lg:text-base">Support</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why Partner with Us</h3>
            <p className="text-base lg:text-lg text-gray-400">
              Everything you need to succeed as an introducing broker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <div key={index} className="card-3d rounded-2xl p-6 lg:p-8 hover-lift">
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-2xl lg:text-3xl mb-4 text-white`}
                  >
                    <BenefitIcon />
                  </div>
                  <h4 className="text-xl lg:text-2xl font-bold text-white mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Commission Structure
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Earn more as you grow. Our tiered system rewards your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {commissionTiers.map((tier, index) => (
              <div
                key={index}
                className={`${tier.popular ? "glassmorphic-glow ring-2 ring-fizmo-purple-500" : "card-3d"} rounded-2xl p-6 lg:p-8 relative hover-lift`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-fizmo text-white rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-2xl lg:text-3xl font-bold text-white mb-2">{tier.tier}</h4>
                  <p className="text-sm text-gray-400 mb-4">{tier.clients} clients</p>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent">
                    {tier.revenue}
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500">Revenue Share</p>
                </div>

                <div className="space-y-2">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start text-sm lg:text-base">
                      <svg
                        className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
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
                      <span className="text-gray-300">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8 mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h3>
            <p className="text-base lg:text-lg text-gray-400">
              Start earning in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-fizmo flex items-center justify-center text-2xl lg:text-3xl font-bold text-white mx-auto mb-4">
                  {step.number}
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm lg:text-base text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glassmorphic-glow rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Ready to Start Earning?
          </h3>
          <p className="text-base lg:text-xl text-gray-400 mb-6 lg:mb-8 max-w-2xl mx-auto">
            Join thousands of successful IBs earning passive income with Fizmo. Get started today
            with no upfront costs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Apply Now - It's Free
            </Link>
            <Link
              href="/contact"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto"
            >
              Talk to Partnership Team
            </Link>
          </div>
        </div>
      </main>

      <CurvedFooter />
    </div>
  );
}
