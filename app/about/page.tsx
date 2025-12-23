import Link from "next/link";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { FaBullseye, FaLock, FaHandshake, FaBolt, FaUserTie, FaLaptopCode, FaPalette, FaBriefcase } from "react-icons/fa";

export default function AboutPage() {
  const values = [
    {
      icon: FaBullseye,
      title: "Innovation First",
      description:
        "We constantly push the boundaries of forex technology to deliver cutting-edge solutions that give brokers a competitive advantage.",
    },
    {
      icon: FaLock,
      title: "Security & Trust",
      description:
        "Your data and your clients' funds are protected with bank-level encryption and industry-leading security practices.",
    },
    {
      icon: FaHandshake,
      title: "Partner Success",
      description:
        "When our partners succeed, we succeed. We're committed to providing the tools and support needed for your growth.",
    },
    {
      icon: FaBolt,
      title: "Speed & Reliability",
      description:
        "Built for performance with 99.9% uptime SLA. Lightning-fast execution ensures your traders never miss an opportunity.",
    },
  ];

  const milestones = [
    { year: "2020", event: "Company Founded", description: "Started with a vision to revolutionize forex CRM" },
    { year: "2021", event: "First 100 Brokers", description: "Reached our first major milestone of 100 partner brokers" },
    { year: "2022", event: "Platform 2.0 Launch", description: "Released major update with advanced analytics and AI features" },
    { year: "2023", event: "Global Expansion", description: "Expanded operations to 50+ countries worldwide" },
    { year: "2024", event: "1M+ Traders", description: "Surpassed 1 million traders using platforms powered by Fizmo" },
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "CEO & Founder",
      image: FaUserTie,
      bio: "15+ years in forex technology",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image: FaLaptopCode,
      bio: "Former senior engineer at major fintech",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      image: FaPalette,
      bio: "Product strategy expert from banking sector",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Emily Watson",
      role: "VP of Sales",
      image: FaBriefcase,
      bio: "Built sales teams at 3 successful startups",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  return (
    <div className="min-h-screen dark-navy-bg">
      <MarketingNav />

      <main className="container mx-auto px-4 lg:px-8 pt-32 pb-12 lg:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
            Building the Future of Forex Technology
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
            We empower forex brokers with cutting-edge CRM and back-office solutions that drive
            growth, ensure compliance, and deliver exceptional trading experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="glassmorphic-glow rounded-2xl p-8 lg:p-12 mb-12 lg:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                Our Mission
              </h3>
              <p className="text-base lg:text-lg text-gray-300 mb-4">
                To democratize forex technology by providing brokers of all sizes access to
                enterprise-grade CRM systems that were previously only available to industry
                giants.
              </p>
              <p className="text-base lg:text-lg text-gray-300">
                We believe every broker deserves powerful tools to manage clients, ensure
                compliance, and scale their business without breaking the bank.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glassmorphic p-4 lg:p-6 text-center rounded-xl">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
                  2,500+
                </div>
                <p className="text-gray-400 text-sm lg:text-base">Partner Brokers</p>
              </div>
              <div className="glassmorphic p-4 lg:p-6 text-center rounded-xl">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <p className="text-gray-400 text-sm lg:text-base">Active Traders</p>
              </div>
              <div className="glassmorphic p-4 lg:p-6 text-center rounded-xl">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <p className="text-gray-400 text-sm lg:text-base">Countries</p>
              </div>
              <div className="glassmorphic p-4 lg:p-6 text-center rounded-xl">
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-fizmo bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <p className="text-gray-400 text-sm lg:text-base">Uptime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Core Values</h3>
            <p className="text-base lg:text-lg text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="card-3d p-6 lg:p-8 text-center hover-lift">
                  <div className="text-4xl lg:text-5xl mb-4 flex items-center justify-center text-fizmo-purple-400">
                    <IconComponent />
                  </div>
                  <h4 className="text-xl lg:text-2xl font-bold text-white mb-3">{value.title}</h4>
                  <p className="text-sm lg:text-base text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="glassmorphic-glow rounded-2xl p-6 lg:p-8 mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Journey</h3>
            <p className="text-base lg:text-lg text-gray-400">
              Key milestones in our growth story
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-fizmo flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold text-white">
                      {milestone.year}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl lg:text-2xl font-bold text-white mb-2">
                    {milestone.event}
                  </h4>
                  <p className="text-sm lg:text-base text-gray-400">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12 lg:mb-20">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Meet Our Leadership Team
            </h3>
            <p className="text-base lg:text-lg text-gray-400">
              Experienced professionals driving innovation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {team.map((member, index) => {
              const ImageIcon = member.image;
              return (
                <div key={index} className="card-3d p-6 lg:p-8 text-center hover-lift">
                  <div className="text-6xl lg:text-7xl mb-4 flex items-center justify-center text-fizmo-purple-400">
                    <ImageIcon />
                  </div>
                  <h4 className="text-lg lg:text-xl font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-fizmo-purple-400 text-sm lg:text-base mb-3">{member.role}</p>
                  <p className="text-sm text-gray-400 mb-4">{member.bio}</p>
                  <div className="flex items-center justify-center space-x-3">
                    <a
                      href={member.social.linkedin}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                    >
                      in
                    </a>
                    <a
                      href={member.social.twitter}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-fizmo-dark-700 flex items-center justify-center text-white hover:bg-fizmo-dark-600 transition-all"
                    >
                      𝕏
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glassmorphic-glow rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
            Join Us on Our Mission
          </h3>
          <p className="text-base lg:text-xl text-gray-400 mb-6 lg:mb-8 max-w-2xl mx-auto">
            Whether you're a broker looking for better technology or a talented professional
            wanting to join our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-fizmo text-white rounded-lg hover:opacity-90 transition-all text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="px-6 lg:px-8 py-3 lg:py-4 bg-fizmo-dark-800 text-white rounded-lg hover:bg-fizmo-dark-700 transition-all text-base lg:text-lg font-semibold border border-fizmo-purple-500/30 w-full sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <CurvedFooter />
    </div>
  );
}
