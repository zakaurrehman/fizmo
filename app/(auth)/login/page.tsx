"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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
      await login(formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
          LOG IN TRADER'S ROOM
        </h2>

        {/* Login Card */}
        <div className="auth-card p-12 animate-fade-in-up smooth-transition hover-lift" style={{animationDelay: '0.2s'}}>
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold gradient-text hover-scale smooth-transition">
                Fizmo
              </h1>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Username/Email"
              type="email"
              placeholder=""
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder=""
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
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
                Log In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
