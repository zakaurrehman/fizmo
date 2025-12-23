"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function MarketingNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/platform", label: "Platform" },
    { href: "/pricing", label: "Pricing" },
    { href: "/partners", label: "IB / Partners" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glassmorphic-light shadow-lg shadow-fizmo-purple-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-fizmo flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold gradient-text">Fizmo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-fizmo-purple-400"
                    : "text-gray-300 hover:text-fizmo-purple-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-medium text-white border border-fizmo-purple-500/30 rounded-lg hover:bg-fizmo-purple-500/10 transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-fizmo rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-fizmo-purple-500/30"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 glassmorphic rounded-2xl mt-4 mb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-6 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-fizmo-purple-400"
                      : "text-gray-300 hover:text-fizmo-purple-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-fizmo-purple-500/20 my-4"></div>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mx-6 px-6 py-2.5 text-center text-sm font-medium text-white border border-fizmo-purple-500/30 rounded-lg hover:bg-fizmo-purple-500/10 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="mx-6 px-6 py-2.5 text-center text-sm font-medium text-white bg-gradient-fizmo rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-fizmo-purple-500/30"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
