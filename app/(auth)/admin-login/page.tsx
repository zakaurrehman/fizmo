"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Verify user is ADMIN or SUPER_ADMIN
      if (data.data.user.role !== "ADMIN" && data.data.user.role !== "SUPER_ADMIN") {
        setError("Access denied. Admin role required.");
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem("fizmo_token", data.data.token);

      // Redirect based on role
      if (data.data.user.role === "SUPER_ADMIN") {
        router.push("/super-admin");
      } else {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-semibold tracking-wider">BROKER ADMINISTRATION</span>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-wide text-glow animate-fade-in-up">
            ADMIN PORTAL
          </h2>
          <p className="text-gray-400 mt-2">Broker management dashboard</p>
        </div>

        {/* Login Card */}
        <div className="auth-card p-12 animate-fade-in-up smooth-transition hover-lift" style={{animationDelay: '0.2s'}}>
          {/* Logo */}
          <div className="text-center mb-10">
            <Logo href="/" width={150} height={50} />
            <p className="text-sm text-gray-500 mt-2">Admin Dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@broker.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
              />
              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" loading={loading}>
                Access Admin Dashboard
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Need help? Contact your{" "}
              <Link href="/support" className="text-purple-400 hover:text-purple-300">
                platform administrator
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Fizmo Trading Platform © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
