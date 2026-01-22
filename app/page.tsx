"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { AnimatedSection, Counter, StaggeredChildren } from "@/components/landing/AnimatedSection";
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
  const instruments = [
    { name: "Forex", pairs: "60+ Pairs", icon: "💱" },
    { name: "Stocks", pairs: "500+ CFDs", icon: "📈" },
    { name: "Crypto", pairs: "30+ Coins", icon: "₿" },
    { name: "Commodities", pairs: "15+ Assets", icon: "🛢️" },
    { name: "Indices", pairs: "20+ Markets", icon: "📊" },
    { name: "ETFs", pairs: "50+ Funds", icon: "💼" },
  ];

  const features = [
    {
      icon: FaBolt,
      title: "Ultra-Fast Execution",
      description: "Execute trades in milliseconds with our cutting-edge technology infrastructure.",
      points: ["99.9% order execution rate", "No requotes or slippage"],
    },
    {
      icon: FaChartLine,
      title: "Tight Spreads",
      description: "Trade with some of the lowest spreads in the industry starting from 0.0 pips.",
      points: ["Raw spreads from 0.0", "No hidden commissions"],
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Regulated",
      description: "Your funds are protected with segregated accounts and top-tier regulation.",
      points: ["Segregated client funds", "Negative balance protection"],
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated multilingual support team.",
      points: ["Live chat & phone support", "15+ languages supported"],
    },
    {
      icon: FaGlobe,
      title: "Global Access",
      description: "Trade from anywhere in the world with localized payment options.",
      points: ["Available in 150+ countries", "Multiple deposit methods"],
    },
    {
      icon: FaMobileAlt,
      title: "Trade Anywhere",
      description: "Access your account on desktop, web, or mobile with our powerful apps.",
      points: ["MT4 & MT5 platforms", "iOS & Android apps"],
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      text: "The execution speed is incredible. I've been trading for 5 years and Fizmo Trader offers the best conditions I've experienced.",
      rating: 5,
    },
    {
      name: "Sarah Mitchell",
      location: "London, UK",
      text: "Customer support is top-notch. They helped me set up my account and answered all my questions promptly.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      location: "Singapore",
      text: "Low spreads and fast withdrawals. This is exactly what I needed for my scalping strategy.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen dark-navy-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fizmo-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-fizmo-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-fizmo-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }}></div>

      <MarketingNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-fizmo-purple-500/20 border border-fizmo-purple-500/30 mb-6 animate-fade-in-up animate-pulse-glow">
            <FaShieldAlt className="text-fizmo-purple-400 mr-2" />
            <span className="text-fizmo-purple-300 text-sm font-medium">Licensed & Regulated Broker</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Trade Smarter with
            <span className="gradient-text block mt-2 animate-gradient">Fizmo Trader</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Access global markets with ultra-tight spreads, lightning-fast execution,
            and award-winning trading platforms. Join 500,000+ traders worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/register">
              <Button size="lg" className="hover-lift btn-gradient-pulse w-full sm:w-auto px-8">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "0.0", label: "Spreads from" },
              { value: "1:500", label: "Max Leverage" },
              { value: "$50", label: "Min Deposit" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glassmorphic rounded-xl p-4 hover-lift"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar with Counter Animation */}
      <AnimatedSection className="bg-gradient-fizmo py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">
                <Counter end={500} suffix="K+" />
              </p>
              <p className="text-white/80">Active Traders</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                $<Counter end={12} suffix="B+" />
              </p>
              <p className="text-white/80">Monthly Volume</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                <Counter end={150} suffix="+" />
              </p>
              <p className="text-white/80">Countries Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                <Counter end={100} suffix="+" />
              </p>
              <p className="text-white/80">Trading Instruments</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Trading Instruments */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Trade Multiple Markets</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access a wide range of financial instruments from a single platform
          </p>
        </AnimatedSection>

        <StaggeredChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={0.1}>
          {instruments.map((item) => (
            <div
              key={item.name}
              className="glassmorphic rounded-xl p-6 text-center hover-lift cursor-pointer group transition-all duration-300 hover:scale-105 hover:border-fizmo-purple-500/60"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-white font-bold mb-1 group-hover:text-fizmo-purple-400 transition-colors">{item.name}</h3>
              <p className="text-gray-400 text-sm">{item.pairs}</p>
            </div>
          ))}
        </StaggeredChildren>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Fizmo Trader?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the difference with our industry-leading trading conditions
          </p>
        </AnimatedSection>

        <StaggeredChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title} className="glassmorphic-glow rounded-2xl p-8 group">
                <div className="w-16 h-16 rounded-xl bg-gradient-fizmo flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <IconComponent className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-fizmo-purple-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center text-gray-300 text-sm">
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </StaggeredChildren>
      </section>

      {/* Account Types */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Choose Your Account</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the account type that matches your trading style and experience level
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Standard Account */}
          <AnimatedSection delay={0} direction="up">
            <div className="glassmorphic rounded-2xl p-8 relative h-full hover-lift group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-fizmo-purple-400 transition-colors">Standard</h3>
              <p className="text-gray-400 mb-6">Perfect for beginners</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$50</span>
                <span className="text-gray-400 ml-2">min deposit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Spreads from 1.0 pips", "Leverage up to 1:200", "All instruments", "24/5 support"].map((item) => (
                  <li key={item} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full group-hover:bg-fizmo-purple-500/10 transition-colors">
                  Open Standard
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Pro Account */}
          <AnimatedSection delay={0.15} direction="up">
            <div className="glassmorphic-glow rounded-2xl p-8 relative h-full border-2 border-fizmo-purple-500 hover-lift group transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-fizmo text-white text-sm font-bold px-4 py-1 rounded-full animate-pulse-glow">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-fizmo-purple-400 transition-colors">Pro</h3>
              <p className="text-gray-400 mb-6">For experienced traders</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$500</span>
                <span className="text-gray-400 ml-2">min deposit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Spreads from 0.4 pips", "Leverage up to 1:400", "Priority execution", "Dedicated manager"].map((item) => (
                  <li key={item} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button className="w-full">Open Pro Account</Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* VIP Account */}
          <AnimatedSection delay={0.3} direction="up">
            <div className="glassmorphic rounded-2xl p-8 relative h-full hover-lift group">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-fizmo-purple-400 transition-colors">VIP</h3>
              <p className="text-gray-400 mb-6">For professional traders</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$10K</span>
                <span className="text-gray-400 ml-2">min deposit</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Spreads from 0.0 pips", "Leverage up to 1:500", "Zero commission", "VIP perks & rewards"].map((item) => (
                  <li key={item} className="flex items-center text-gray-300">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full group-hover:bg-fizmo-purple-500/10 transition-colors">
                  Open VIP
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Platform Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <h2 className="text-4xl font-bold text-white mb-6">
              Powerful Trading Platforms
            </h2>
            <p className="text-gray-400 mb-8">
              Trade on the world&apos;s most popular platforms with advanced charting,
              automated trading, and expert advisors support.
            </p>

            <div className="space-y-4 mb-8">
              {["MetaTrader 4 & MetaTrader 5", "50+ technical indicators", "Expert Advisors (EA) support", "One-click trading"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center transform hover:translate-x-2 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: FaWindows, label: "Windows" },
                { icon: FaApple, label: "macOS" },
                { icon: FaAndroid, label: "Android" },
                { icon: FaApple, label: "iOS" },
              ].map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <button
                    key={platform.label}
                    className="flex items-center gap-2 px-6 py-3 bg-fizmo-dark-800 rounded-xl hover:bg-fizmo-dark-700 hover:scale-105 transition-all duration-300"
                  >
                    <PlatformIcon className="text-xl text-white" />
                    <span className="text-white">{platform.label}</span>
                  </button>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" className="relative">
            <div className="glassmorphic rounded-2xl p-4 animate-float">
              <Image
                src="/assets/mobile.png"
                alt="Trading Platform"
                width={500}
                height={400}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">What Traders Say</h2>
          <p className="text-gray-400">Join thousands of satisfied traders worldwide</p>
        </AnimatedSection>

        <StaggeredChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.2}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="glassmorphic rounded-2xl p-6 hover-lift group">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 transform group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 0.05}s` }} />
                ))}
              </div>
              <p className="text-gray-300 mb-4">&quot;{testimonial.text}&quot;</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </StaggeredChildren>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="container mx-auto px-4 py-20 relative z-10">
        <div className="glassmorphic-glow rounded-3xl p-12 text-center transform hover:scale-[1.02] transition-transform duration-500">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Open your account in minutes and start trading with the best conditions in the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 btn-gradient-pulse">
                Create Free Account
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="px-8 hover:scale-105 transition-transform">
                Try Demo Account
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Payment Methods */}
      <AnimatedSection className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <p className="text-gray-400">Deposit & Withdraw with</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {[SiVisa, SiMastercard, FaBitcoin, FaCreditCard, FaUniversity].map((Icon, index) => (
            <Icon
              key={index}
              className="text-4xl text-gray-400 hover:text-white hover:scale-125 transition-all duration-300 cursor-pointer"
            />
          ))}
        </div>
      </AnimatedSection>

      <CurvedFooter />
    </div>
  );
}
