"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function CurvedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="curved-footer relative mt-32">
      {/* Curved gradient border */}
      <div className="curved-footer-border"></div>

      <div className="relative bg-gradient-to-b from-transparent via-fizmo-dark-900/50 to-fizmo-dark-950 pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-fizmo flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <span className="text-2xl font-bold gradient-text">Fizmo</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                All-in-One Forex CRM & Back Office solution for modern brokers.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-fizmo-dark-800 hover:bg-gradient-fizmo border border-fizmo-purple-500/20 hover:border-fizmo-purple-500/40 flex items-center justify-center transition-all"
                >
                  <Facebook className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-fizmo-dark-800 hover:bg-gradient-fizmo border border-fizmo-purple-500/20 hover:border-fizmo-purple-500/40 flex items-center justify-center transition-all"
                >
                  <Twitter className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-fizmo-dark-800 hover:bg-gradient-fizmo border border-fizmo-purple-500/20 hover:border-fizmo-purple-500/40 flex items-center justify-center transition-all"
                >
                  <Instagram className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-fizmo-dark-800 hover:bg-gradient-fizmo border border-fizmo-purple-500/20 hover:border-fizmo-purple-500/40 flex items-center justify-center transition-all"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              </div>
            </div>

            {/* Platform links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/platform" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    IB / Partners
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-fizmo-purple-400 text-sm transition-colors">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-fizmo-purple-500/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {currentYear} Fizmo. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <span className="text-gray-500">Follow us</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
