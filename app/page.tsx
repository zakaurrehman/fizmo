import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import MarketingNav from "@/components/marketing/MarketingNav";
import CurvedFooter from "@/components/marketing/CurvedFooter";
import { FaLock, FaBolt, FaGem, FaUserTie, FaUser } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen dark-navy-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-fizmo-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-fizmo-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-fizmo-cyan-400/10 rounded-full blur-3xl"></div>

      <MarketingNav />

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20 flex flex-col md:flex-row items-center justify-between relative z-10">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-glow animate-fade-in-up">
            Fizmo
          </h1>
          <p className="text-2xl text-gray-300 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            All-in-One Forex CRM & Back Office
          </p>
          <div className="flex space-x-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Link href="/register">
              <Button size="lg" className="hover-lift">Get Started</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="hover-lift">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md animate-float">
            <Image
              src="/assets/mobile.png"
              alt="Fizmo Mobile App"
              width={400}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-16 gradient-text">ABOUT COMPANY</h2>
        <div className="max-w-3xl mx-auto card-3d p-10">
          <p className="text-gray-300 leading-relaxed mb-6 text-lg">
            Fizmo platform provides state-of-the-art CRM and back-office solutions for forex
            brokers. Our system integrates cutting-edge technology with powerful trading platform
            connections.
          </p>
          <p className="text-gray-300 leading-relaxed text-lg">
            All our processes utilize smart contract technology for maximum security and
            transparency. Every transaction is recorded on a decentralized blockchain, ensuring
            complete audit trails and compliance with regulatory standards.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-16 gradient-text">HOW IT WORKS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sign Up</h3>
            <p className="text-gray-400">
              Create your account in minutes with our streamlined registration process. No hidden fees or complicated forms.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Complete KYC</h3>
            <p className="text-gray-400">
              Verify your identity quickly and securely with our automated KYC system powered by leading providers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Create Account</h3>
            <p className="text-gray-400">
              Choose between Demo or Live trading accounts with customizable leverage and currency options.
            </p>
          </div>

          {/* Step 4 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">4</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fund Your Account</h3>
            <p className="text-gray-400">
              Deposit funds using multiple payment methods: Cards, Bank Wire, or Cryptocurrency.
            </p>
          </div>

          {/* Step 5 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">5</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Start Trading</h3>
            <p className="text-gray-400">
              Access MT4/MT5 platforms and start trading Forex, commodities, indices, and cryptocurrencies.
            </p>
          </div>

          {/* Step 6 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-16 h-16 rounded-full bg-gradient-fizmo flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">6</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Withdraw Profits</h3>
            <p className="text-gray-400">
              Request withdrawals anytime with fast processing times and secure transaction handling.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">ADVANTAGES</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Advantage 1 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaLock className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Blockchain Security</h3>
            <p className="text-gray-400 mb-4">
              All transactions are secured by smart contracts on decentralized blockchain networks, ensuring transparency and immutability.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Immutable transaction records</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Decentralized audit trails</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Zero downtime architecture</span>
              </li>
            </ul>
          </div>

          {/* Advantage 2 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaBolt className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
            <p className="text-gray-400 mb-4">
              Experience ultra-fast trade execution, instant deposits with crypto, and real-time portfolio tracking across all devices.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Sub-second order execution</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Instant crypto confirmations</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Real-time data synchronization</span>
              </li>
            </ul>
          </div>

          {/* Advantage 3 */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-fizmo flex items-center justify-center mb-6">
              <FaGem className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Multi-Asset Support</h3>
            <p className="text-gray-400 mb-4">
              Trade Forex, commodities, indices, stocks, and cryptocurrencies all from a single unified platform with competitive spreads.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>100+ currency pairs</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Major cryptocurrencies</span>
              </li>
              <li className="flex items-start">
                <span className="text-fizmo-purple-400 mr-2">✓</span>
                <span>Commodities & indices</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section className="container mx-auto px-4 py-20 bg-fizmo-dark-900/50">
        <h2 className="text-4xl font-bold text-center text-white mb-16">TOKENOMICS</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Distribution Chart */}
          <div className="glassmorphic-glow rounded-2xl p-8">
            <div className="w-full aspect-square flex items-center justify-center">
              <Image
                src="/assets/chart.png"
                alt="FIZMO Token Distribution Chart"
                width={470}
                height={470}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right: Token Distribution Details */}
          <div className="space-y-6">
            <div className="glassmorphic-glow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Liquidity Pool</h4>
                <span className="text-fizmo-purple-400 font-bold">40%</span>
              </div>
              <div className="w-full bg-fizmo-dark-800 rounded-full h-3">
                <div className="bg-gradient-fizmo h-3 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>

            <div className="glassmorphic-glow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Team & Development</h4>
                <span className="text-fizmo-purple-400 font-bold">25%</span>
              </div>
              <div className="w-full bg-fizmo-dark-800 rounded-full h-3">
                <div className="bg-gradient-fizmo h-3 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>

            <div className="glassmorphic-glow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Marketing & Partnerships</h4>
                <span className="text-fizmo-purple-400 font-bold">20%</span>
              </div>
              <div className="w-full bg-fizmo-dark-800 rounded-full h-3">
                <div className="bg-gradient-fizmo h-3 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>

            <div className="glassmorphic-glow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Community Rewards</h4>
                <span className="text-fizmo-purple-400 font-bold">10%</span>
              </div>
              <div className="w-full bg-fizmo-dark-800 rounded-full h-3">
                <div className="bg-gradient-fizmo h-3 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>

            <div className="glassmorphic-glow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">Reserve Fund</h4>
                <span className="text-fizmo-purple-400 font-bold">5%</span>
              </div>
              <div className="w-full bg-fizmo-dark-800 rounded-full h-3">
                <div className="bg-gradient-fizmo h-3 rounded-full" style={{ width: "5%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">OUR TEAM</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-32 h-32 rounded-full bg-gradient-fizmo mx-auto mb-4 flex items-center justify-center">
              <FaUserTie className="text-white text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Shafaqat Rafique</h3>
            <p className="text-fizmo-purple-400 text-sm mb-3">CEO & Founder</p>
            <p className="text-gray-400 text-sm mb-4">
              15+ years in fintech and blockchain. Former VP at major forex broker.
            </p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-32 h-32 rounded-full bg-gradient-fizmo mx-auto mb-4 flex items-center justify-center">
              <FaUser className="text-white text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Sarah Martinez</h3>
            <p className="text-fizmo-purple-400 text-sm mb-3">CTO</p>
            <p className="text-gray-400 text-sm mb-4">
              Blockchain architect with expertise in smart contracts and DeFi protocols.
            </p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-32 h-32 rounded-full bg-gradient-fizmo mx-auto mb-4 flex items-center justify-center">
              <FaUserTie className="text-white text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Michael Chen</h3>
            <p className="text-fizmo-purple-400 text-sm mb-3">Head of Trading</p>
            <p className="text-gray-400 text-sm mb-4">
              Former institutional trader with deep expertise in forex and derivatives markets.
            </p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="card-3d p-6 text-center hover-lift">
            <div className="w-32 h-32 rounded-full bg-gradient-fizmo mx-auto mb-4 flex items-center justify-center">
              <FaUser className="text-white text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Emma Williams</h3>
            <p className="text-fizmo-purple-400 text-sm mb-3">Head of Compliance</p>
            <p className="text-gray-400 text-sm mb-4">
              Regulatory expert ensuring full compliance with global financial regulations.
            </p>
            <div className="flex justify-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </section>

      <CurvedFooter />
    </div>
  );
}
