import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import {
  FaShieldAlt,
  FaBolt,
  FaHeadset,
  FaChartLine,
  FaGlobe,
  FaMobileAlt,
  FaCheckCircle,
  FaStar,
  FaApple,
  FaAndroid,
  FaWindows,
  FaBitcoin,
  FaCreditCard,
  FaUniversity
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";

export default function Home() {
  return (
    <div className="min-h-screen dark-navy-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fizmo-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-fizmo-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-fizmo-cyan-400/10 rounded-full blur-3xl"></div>

      <MarketingNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-fizmo-purple-500/20 border border-fizmo-purple-500/30 mb-6 animate-fade-in-up">
            <FaShieldAlt className="text-fizmo-purple-400 mr-2" />
            <span className="text-fizmo-purple-300 text-sm font-medium">Licensed & Regulated Broker</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Trade Smarter with
            <span className="gradient-text block mt-2">Fizmo Trader</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Access global markets with ultra-tight spreads, lightning-fast execution,
            and award-winning trading platforms. Join 500,000+ traders worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <Link href="/register">
              <Button size="lg" className="hover-lift w-full sm:w-auto px-8">
                Start Trading Now
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="hover-lift w-full sm:w-auto px-8">
                Try Free Demo
              </Button>
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-3xl font-bold text-white">0.0</p>
              <p className="text-gray-400 text-sm">Spreads from</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-3xl font-bold text-white">1:500</p>
              <p className="text-gray-400 text-sm">Max Leverage</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-3xl font-bold text-white">$50</p>
              <p className="text-gray-400 text-sm">Min Deposit</p>
            </div>
            <div className="glassmorphic rounded-xl p-4">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-gray-400 text-sm">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-fizmo py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">500K+</p>
              <p className="text-white/80">Active Traders</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">$12B+</p>
              <p className="text-white/80">Monthly Volume</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">150+</p>
              <p className="text-white/80">Countries Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">100+</p>
              <p className="text-white/80">Trading Instruments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Instruments */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Trade Multiple Markets</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access a wide range of financial instruments from a single platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Forex", pairs: "60+ Pairs", icon: "💱" },
            { name: "Stocks", pairs: "500+ CFDs", icon: "📈" },
            { name: "Crypto", pairs: "30+ Coins", icon: "₿" },
            { name: "Commodities", pairs: "15+ Assets", icon: "🛢️" },
            { name: "Indices", pairs: "20+ Markets", icon: "📊" },
            { name: "ETFs", pairs: "50+ Funds", icon: "💼" },
          ].map((item) => (
            <div key={item.name} className="glassmorphic rounded-xl p-6 text-center hover-lift cursor-pointer group">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-1 group-hover:text-fizmo-purple-400 transition-colors">{item.name}</h3>
              <p className="text-gray-400 text-sm">{item.pairs}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Fizmo Trader?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the difference with our industry-leading trading conditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaBolt className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ultra-Fast Execution</h3>
            <p className="text-gray-400 mb-4">
              Execute trades in milliseconds with our cutting-edge technology infrastructure.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>99.9% order execution rate</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>No requotes or slippage</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tight Spreads</h3>
            <p className="text-gray-400 mb-4">
              Trade with some of the lowest spreads in the industry starting from 0.0 pips.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Raw spreads from 0.0</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>No hidden commissions</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaShieldAlt className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Regulated</h3>
            <p className="text-gray-400 mb-4">
              Your funds are protected with segregated accounts and top-tier regulation.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Segregated client funds</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Negative balance protection</span>
              </li>
            </ul>
          </div>

          {/* Feature 4 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaHeadset className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
            <p className="text-gray-400 mb-4">
              Get help whenever you need it with our dedicated multilingual support team.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Live chat & phone support</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>15+ languages supported</span>
              </li>
            </ul>
          </div>

          {/* Feature 5 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaGlobe className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Global Access</h3>
            <p className="text-gray-400 mb-4">
              Trade from anywhere in the world with localized payment options.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Available in 150+ countries</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>Multiple deposit methods</span>
              </li>
            </ul>
          </div>

          {/* Feature 6 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaMobileAlt className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Trade Anywhere</h3>
            <p className="text-gray-400 mb-4">
              Access your account on desktop, web, or mobile with our powerful apps.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>MT4 & MT5 platforms</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span>iOS & Android apps</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Account Types */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Account</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the account type that matches your trading style and experience level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Standard Account */}
          <div className="glassmorphic rounded-2xl p-8 relative">
            <h3 className="text-2xl font-bold text-white mb-2">Standard</h3>
            <p className="text-gray-400 mb-6">Perfect for beginners</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$50</span>
              <span className="text-gray-400 ml-2">min deposit</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Spreads from 1.0 pips</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Leverage up to 1:200</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>All instruments</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>24/5 support</span>
              </li>
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full">Open Standard</Button>
            </Link>
          </div>

          {/* Pro Account */}
          <div className="glassmorphic-glow rounded-2xl p-8 relative border-2 border-fizmo-purple-500">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-fizmo text-white text-sm font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-gray-400 mb-6">For experienced traders</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$500</span>
              <span className="text-gray-400 ml-2">min deposit</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Spreads from 0.4 pips</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Leverage up to 1:400</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Priority execution</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Dedicated manager</span>
              </li>
            </ul>
            <Link href="/register" className="block">
              <Button className="w-full">Open Pro Account</Button>
            </Link>
          </div>

          {/* VIP Account */}
          <div className="glassmorphic rounded-2xl p-8 relative">
            <h3 className="text-2xl font-bold text-white mb-2">VIP</h3>
            <p className="text-gray-400 mb-6">For professional traders</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$10K</span>
              <span className="text-gray-400 ml-2">min deposit</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Spreads from 0.0 pips</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Leverage up to 1:500</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>Zero commission</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span>VIP perks & rewards</span>
              </li>
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" className="w-full">Open VIP</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Powerful Trading Platforms
            </h2>
            <p className="text-gray-400 mb-8">
              Trade on the world&apos;s most popular platforms with advanced charting,
              automated trading, and expert advisors support.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-300">MetaTrader 4 & MetaTrader 5</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-300">50+ technical indicators</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-300">Expert Advisors (EA) support</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="text-gray-300">One-click trading</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-fizmo-dark-800 rounded-xl hover:bg-fizmo-dark-700 transition-colors">
                <FaWindows className="text-xl text-white" />
                <span className="text-white">Windows</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-fizmo-dark-800 rounded-xl hover:bg-fizmo-dark-700 transition-colors">
                <FaApple className="text-xl text-white" />
                <span className="text-white">macOS</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-fizmo-dark-800 rounded-xl hover:bg-fizmo-dark-700 transition-colors">
                <FaAndroid className="text-xl text-white" />
                <span className="text-white">Android</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-fizmo-dark-800 rounded-xl hover:bg-fizmo-dark-700 transition-colors">
                <FaApple className="text-xl text-white" />
                <span className="text-white">iOS</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="glassmorphic rounded-2xl p-4">
              <Image
                src="/assets/mobile.png"
                alt="Trading Platform"
                width={500}
                height={400}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">What Traders Say</h2>
          <p className="text-gray-400">Join thousands of satisfied traders worldwide</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Ahmed Hassan",
              location: "Dubai, UAE",
              text: "The execution speed is incredible. I've been trading for 5 years and Fizmo Trader offers the best conditions I've experienced.",
              rating: 5
            },
            {
              name: "Sarah Mitchell",
              location: "London, UK",
              text: "Customer support is top-notch. They helped me set up my account and answered all my questions promptly.",
              rating: 5
            },
            {
              name: "Michael Chen",
              location: "Singapore",
              text: "Low spreads and fast withdrawals. This is exactly what I needed for my scalping strategy.",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="glassmorphic rounded-2xl p-6">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">&quot;{testimonial.text}&quot;</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="glassmorphic-glow rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Open your account in minutes and start trading with the best conditions in the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Create Free Account
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-8">
                Try Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <p className="text-gray-400">Deposit & Withdraw with</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <SiVisa className="text-4xl text-gray-400 hover:text-white transition-colors" />
          <SiMastercard className="text-4xl text-gray-400 hover:text-white transition-colors" />
          <FaBitcoin className="text-4xl text-gray-400 hover:text-white transition-colors" />
          <FaCreditCard className="text-4xl text-gray-400 hover:text-white transition-colors" />
          <FaUniversity className="text-4xl text-gray-400 hover:text-white transition-colors" />
        </div>
      </section>

      <CurvedFooter />
    </div>
  );
}
