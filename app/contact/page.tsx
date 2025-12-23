"use client";

import { useState } from "react";
import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { FaEnvelope, FaComments, FaPhone, FaBuilding, FaBriefcase, FaTools, FaHandshake, FaBalanceScale } from "react-icons/fa";
import { IconType } from "react-icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "general",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to an API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactMethods: Array<{icon: IconType; title: string; value: string; link: string; description: string}> = [
    {
      icon: FaEnvelope,
      title: "Email Us",
      value: "support@fizmo.com",
      link: "mailto:support@fizmo.com",
      description: "For general inquiries",
    },
    {
      icon: FaComments,
      title: "Live Chat",
      value: "Available 24/7",
      link: "#",
      description: "Instant support",
    },
    {
      icon: FaPhone,
      title: "Call Us",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567",
      description: "Mon-Fri, 9am-6pm EST",
    },
    {
      icon: FaBuilding,
      title: "Visit Us",
      value: "New York, USA",
      link: "#",
      description: "Schedule an appointment",
    },
  ];

  const departments: Array<{icon: IconType; name: string; email: string; description: string}> = [
    { icon: FaBriefcase, name: "Sales", email: "sales@fizmo.com", description: "Pricing and demos" },
    { icon: FaTools, name: "Technical Support", email: "support@fizmo.com", description: "Platform assistance" },
    { icon: FaHandshake, name: "Partnerships", email: "partners@fizmo.com", description: "IB & affiliate programs" },
    { icon: FaBalanceScale, name: "Compliance", email: "compliance@fizmo.com", description: "Regulatory inquiries" },
  ];

  return (
    <div className="min-h-screen dark-navy-bg">
      <MarketingNav />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-12 lg:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">Get in Touch</h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
            Have questions? We're here to help. Reach out to our team and we'll get back to you
            within 24 hours.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12 lg:mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <a
                key={index}
                href={method.link}
                className="glassmorphic-glow rounded-2xl p-6 lg:p-8 text-center hover:scale-105 transition-transform"
              >
                <div className="text-4xl lg:text-5xl mb-4 flex justify-center text-fizmo-purple-400">
                  <Icon />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-white mb-2">{method.title}</h3>
                <p className="text-fizmo-purple-400 text-sm lg:text-base mb-2">{method.value}</p>
                <p className="text-xs lg:text-sm text-gray-500">{method.description}</p>
              </a>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Contact Form */}
          <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">Send Us a Message</h3>

            {submitted && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-500 text-sm lg:text-base">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                  placeholder="Your Company Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject *</label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white focus:outline-none focus:border-fizmo-purple-500 transition-colors"
                >
                  <option value="general">General Inquiry</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="compliance">Compliance & Legal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-fizmo-dark-700 border border-fizmo-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fizmo-purple-500 transition-colors resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all font-semibold text-base lg:text-lg"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Departments */}
          <div className="space-y-6">
            <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                Contact by Department
              </h3>
              <div className="space-y-4">
                {departments.map((dept, index) => {
                  const Icon = dept.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-3xl lg:text-4xl text-fizmo-purple-400">
                        <Icon />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg lg:text-xl font-bold text-white mb-1">
                          {dept.name}
                        </h4>
                        <a
                          href={`mailto:${dept.email}`}
                          className="text-fizmo-purple-400 hover:text-fizmo-purple-300 text-sm lg:text-base"
                        >
                          {dept.email}
                        </a>
                        <p className="text-xs lg:text-sm text-gray-500 mt-1">{dept.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Office Hours */}
            <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Office Hours</h3>
              <div className="space-y-3 text-sm lg:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-white">Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-fizmo-purple-500/20">
                  <p className="text-fizmo-purple-400 text-sm">
                    🌐 Live chat support available 24/7
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">Follow Us</h3>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                >
                  𝕏
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                >
                  in
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                >
                  ▶
                </a>
                <a
                  href="#"
                  className="w-12 h-12 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                >
                  ◆
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Need Help Right Away?
            </h3>
            <p className="text-base lg:text-lg text-gray-400 mb-6">
              Check out our frequently asked questions or browse our documentation
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="px-6 py-3 bg-fizmo-dark-700 text-white rounded-lg hover:bg-fizmo-dark-600 transition-all font-semibold w-full sm:w-auto"
              >
                View FAQ
              </Link>
              <Link
                href="#"
                className="px-6 py-3 bg-fizmo-dark-700 text-white rounded-lg hover:bg-fizmo-dark-600 transition-all font-semibold w-full sm:w-auto"
              >
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>

      <CurvedFooter />
    </div>
  );
}
