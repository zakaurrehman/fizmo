"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;

    // Contains numbers
    if (/\d/.test(password)) score += 1;

    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set strength label and color
    let label = "";
    let color = "";

    if (score <= 2) {
      label = "Weak";
      color = "text-red-500";
    } else if (score === 3) {
      label = "Fair";
      color = "text-yellow-500";
    } else if (score === 4) {
      label = "Good";
      color = "text-blue-500";
    } else {
      label = "Strong";
      color = "text-green-500";
    }

    setPasswordStrength({ score, label, color });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the Terms and Conditions");
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      // Redirect to email verification notice instead of dashboard
      router.push("/verify-email?email=" + encodeURIComponent(formData.email));
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-fizmo-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fizmo-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>

      <div className="w-full max-w-xl relative z-10">
        {/* Title */}
        <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-wide text-glow animate-fade-in-up">
          REGISTRATION FOR TRADER'S ROOM
        </h2>

        {/* Registration Card */}
        <div className="auth-card p-12 animate-fade-in-up smooth-transition hover-lift" style={{animationDelay: '0.2s'}}>
          {/* Logo */}
          <div className="text-center mb-10">
            <Logo href="/" width={150} height={50} />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="First Name"
              type="text"
              placeholder=""
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />

            <Input
              label="Last Name"
              type="text"
              placeholder=""
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder=""
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Contact Number"
              type="tel"
              placeholder=""
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <div>
              <Input
                label="Create Password"
                type="password"
                placeholder=""
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  calculatePasswordStrength(e.target.value);
                }}
                required
              />
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password Strength:</span>
                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 2
                          ? "bg-red-500"
                          : passwordStrength.score === 3
                          ? "bg-yellow-500"
                          : passwordStrength.score === 4
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with a mix of uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder=""
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" loading={loading}>
                Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
