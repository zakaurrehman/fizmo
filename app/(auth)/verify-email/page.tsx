"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromUrl);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResendEmail = async () => {
    if (!email || !email.includes("@")) {
      setResendMessage("Please enter a valid email address.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendMessage("Verification email sent successfully! Check your inbox.");
      } else {
        const data = await response.json();
        setResendMessage(data.message || "Failed to resend email. Please try again.");
      }
    } catch (error) {
      setResendMessage("An error occurred. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
          VERIFY YOUR EMAIL
        </h2>

        {/* Email Verification Card */}
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
            <h3 className="text-2xl font-bold text-white mb-2">
              {emailFromUrl ? "Check Your Email" : "Resend Verification Email"}
            </h3>
            {emailFromUrl ? (
              <>
                <p className="text-gray-400 text-sm">
                  We've sent a verification link to
                </p>
                <p className="text-purple-400 font-semibold mt-1">{email}</p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                Enter your email address to receive a new verification link
              </p>
            )}
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
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 font-bold mr-2">3.</span>
                <span>You'll be redirected to login to your account</span>
              </li>
            </ol>
          </div>

          {/* Resend Email Section */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-4 text-center">
              Didn't receive the email? Check your spam folder or enter your email below
            </p>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              loading={resendLoading}
              className="w-full"
            >
              Resend Verification Email
            </Button>
            {resendMessage && (
              <p className={`text-sm mt-3 text-center ${resendMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
                {resendMessage}
              </p>
            )}
          </div>

          {/* Back to Login */}
          <div className="text-center pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Already verified?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
