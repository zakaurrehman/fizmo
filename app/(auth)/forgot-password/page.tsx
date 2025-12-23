"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement actual password reset API call
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send reset email. Please try again.");
      }
    } catch (err: any) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Title */}
          <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
            CHECK YOUR EMAIL
          </h2>

          {/* Success Card */}
          <div className="auth-card p-12 animate-fade-in-up smooth-transition" style={{animationDelay: '0.2s'}}>
            {/* Logo */}
            <div className="text-center mb-10">
              <Link href="/" className="inline-block">
                <h1 className="text-3xl font-bold gradient-text hover-scale smooth-transition">
                  Fizmo
                </h1>
              </Link>
            </div>

            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Reset Link Sent</h3>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to
              </p>
              <p className="text-purple-400 font-semibold mt-1">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-fizmo-dark-800/50 rounded-lg p-6 mb-6 border border-gray-800">
              <h4 className="text-white font-semibold mb-3">Next Steps:</h4>
              <ol className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-400 font-bold mr-2">1.</span>
                  <span>Check your inbox for an email from Fizmo Trader</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 font-bold mr-2">2.</span>
                  <span>Click the password reset link in the email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 font-bold mr-2">3.</span>
                  <span>Create a new password for your account</span>
                </li>
              </ol>
            </div>

            {/* Additional Info */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-3">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="mx-auto"
              >
                Try Again
              </Button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Support Contact */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              If you continue to have issues, please contact our support team at{" "}
              <a href="mailto:support@fizmo.com" className="text-purple-400 hover:text-purple-300">
                support@fizmo.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
          FORGOT PASSWORD
        </h2>

        {/* Forgot Password Card */}
        <div className="auth-card p-12 animate-fade-in-up smooth-transition hover-lift" style={{animationDelay: '0.2s'}}>
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold gradient-text hover-scale smooth-transition">
                Fizmo
              </h1>
            </Link>
          </div>

          {/* Info Message */}
          <div className="mb-8 text-center">
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email Address"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="pt-4">
              <Button type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
            </div>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
