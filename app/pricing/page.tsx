import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$499",
      period: "/month",
      description: "Perfect for new brokers getting started",
      features: [
        "Up to 100 active clients",
        "Trader's Room portal",
        "Basic admin dashboard",
        "Email support",
        "1 GB storage",
        "Standard reporting",
        "MT4/MT5 integration",
        "Basic KYC support",
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Professional",
      price: "$1,299",
      period: "/month",
      description: "For growing brokerages with advanced needs",
      features: [
        "Up to 500 active clients",
        "Full Trader's Room",
        "Complete admin back office",
        "Priority email & chat support",
        "10 GB storage",
        "Advanced analytics & BI",
        "MT4/MT5 + cTrader integration",
        "Full KYC/AML suite",
        "IB management system",
        "Custom branding",
        "API access",
        "99.9% uptime SLA",
      ],
      cta: "Get Started",
      popular: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large brokerages",
      features: [
        "Unlimited clients",
        "White-label solution",
        "Dedicated infrastructure",
        "24/7 phone & priority support",
        "Unlimited storage",
        "Custom reports & dashboards",
        "All platform integrations",
        "Advanced AML monitoring",
        "Multi-tier IB structures",
        "Custom feature development",
        "Dedicated account manager",
        "99.99% uptime SLA",
        "On-premise deployment option",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-orange-500 to-red-500",
    },
  ];

  const addons = [
    {
      name: "White Label Branding",
      price: "$299/mo",
      description: "Fully customize the platform with your brand",
    },
    {
      name: "Additional Storage",
      price: "$49/mo",
      description: "10 GB extra storage per month",
    },
    {
      name: "SMS Notifications",
      price: "$99/mo",
      description: "Send SMS alerts to clients (1000 SMS included)",
    },
    {
      name: "Advanced Crypto Integration",
      price: "$199/mo",
      description: "Support for 50+ cryptocurrencies",
    },
    {
      name: "Copy Trading Module",
      price: "$399/mo",
      description: "Enable copy trading features for clients",
    },
    {
      name: "PAMM/MAM System",
      price: "$499/mo",
      description: "Portfolio and money management system",
    },
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, wire transfers, and cryptocurrency payments (BTC, ETH, USDT).",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees for Starter and Professional plans. Enterprise plans may have a one-time onboarding fee depending on customization requirements.",
    },
    {
      question: "What's included in the free trial?",
      answer:
        "Our 14-day free trial includes full access to all Professional plan features with no credit card required.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your first payment in full.",
    },
    {
      question: "Can I add more users later?",
      answer:
        "Yes, you can add admin users and increase client capacity at any time. Additional fees may apply based on your plan.",
    },
  ];

  return (
    <div className="min-h-screen dark-navy-bg">
      <MarketingNav />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-12 lg:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your brokerage size. All plans include 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-20">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${plan.popular ? "glassmorphic-glow ring-2 ring-fizmo-purple-500" : "card-3d"} rounded-2xl p-6 lg:p-8 relative hover-lift`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-fizmo text-white rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm lg:text-base text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-end justify-center mb-6">
                  <span className="text-4xl lg:text-5xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-400 ml-2 text-lg">{plan.period}</span>
                  )}
                </div>
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={`block w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-fizmo text-white hover:opacity-90"
                      : "bg-fizmo-dark-700 text-white hover:bg-fizmo-dark-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
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
                    <span className="text-gray-300 text-sm lg:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Enhance Your Platform
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Optional add-ons to extend functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {addons.map((addon, index) => (
              <div key={index} className="card-3d rounded-2xl p-4 lg:p-6 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg lg:text-xl font-bold text-white">{addon.name}</h4>
                  <span className="text-fizmo-purple-400 font-semibold text-sm lg:text-base whitespace-nowrap ml-2">
                    {addon.price}
                  </span>
                </div>
                <p className="text-sm lg:text-base text-gray-400">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8 mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="text-lg lg:text-xl font-bold text-white mb-3">{faq.question}</h4>
                <p className="text-sm lg:text-base text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glassmorphic-glow rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Still have questions?
          </h3>
          <p className="text-base lg:text-xl text-gray-400 mb-6 lg:mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Contact Sales
            </Link>
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </main>

      <CurvedFooter />
    </div>
  );
}
