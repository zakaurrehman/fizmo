"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
        <div className="auth-card p-12 max-w-xl w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
          <p className="text-gray-400 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 font-semibold">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4">
        <div className="auth-card p-12 max-w-xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Password Reset Successful</h2>
          <p className="text-gray-400 mb-6">
            Your password has been updated. You can now log in with your new password.
          </p>
          <Link href="/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-xl relative z-10">
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
          RESET PASSWORD
        </h2>

        <div className="auth-card p-12 animate-fade-in-up smooth-transition hover-lift" style={{animationDelay: '0.2s'}}>
          <div className="mb-8 text-center">
            <p className="text-gray-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="New Password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder=""
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-4">
              <Button type="submit" className="w-full" loading={loading}>
                Reset Password
              </Button>
            </div>
          </form>

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
