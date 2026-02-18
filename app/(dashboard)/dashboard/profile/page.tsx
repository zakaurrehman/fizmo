"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { KYCUpload } from "@/components/dashboard/KYCUpload";

export default function ProfilePage() {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("personal");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualEntry, setManualEntry] = useState("");
  const [verifyTokenInput, setVerifyTokenInput] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form data
  const [profile, setProfile] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    kycStatus: "NOT_STARTED",
    labels: [] as string[],
  });

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.data);
        setTwoFactorEnabled(data.data.twoFactorEnabled || false);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          country: profile.country,
        }),
      });
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save");
      }
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleEnable2FA() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setQrCodeUrl(data.qrCode);
        setManualEntry(data.manualEntry);
        setShowQRCode(true);
      } else {
        const err = await response.json();
        setError(`Failed to setup 2FA: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      setError("Failed to setup 2FA");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify2FA() {
    if (!verifyTokenInput) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: verifyTokenInput }),
      });
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setTwoFactorEnabled(true);
        setShowQRCode(false);
        setVerifyTokenInput("");
        setSuccess("Two-factor authentication enabled!");
      } else {
        const err = await response.json();
        setError(`Verification failed: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      setError("Failed to verify 2FA");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2FA() {
    const disableToken = prompt("Enter your 2FA code or backup code to disable 2FA:");
    if (!disableToken) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: disableToken }),
      });
      if (response.ok) {
        setTwoFactorEnabled(false);
        setBackupCodes([]);
        setSuccess("Two-factor authentication disabled");
      } else {
        const err = await response.json();
        setError(`Failed to disable 2FA: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      setError("Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  }

  const initials = `${(profile.firstName || "?")[0]}${(profile.lastName || "?")[0]}`.toUpperCase();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fizmo-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>
        {selectedTab === "personal" && (
          <Button onClick={handleSaveProfile} loading={saving}>Save Changes</Button>
        )}
      </div>

      {/* Status Messages */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
          <p className="text-green-500 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Profile Overview */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-fizmo flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{initials}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-gray-400 mb-2">{profile.email}</p>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                profile.kycStatus === "APPROVED" ? "bg-green-500/20 text-green-500" :
                profile.kycStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                "bg-gray-500/20 text-gray-400"
              }`}>
                {profile.kycStatus === "APPROVED" ? "VERIFIED" : profile.kycStatus}
              </span>
              {profile.labels?.includes("VIP") && (
                <span className="px-3 py-1 bg-fizmo-purple-500/20 text-fizmo-purple-400 rounded text-sm font-semibold">
                  VIP
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="glassmorphic rounded-xl p-6">
        <div className="flex space-x-2">
          {[
            { key: "personal", label: "Personal Info" },
            { key: "security", label: "Security" },
            { key: "verification", label: "Verification" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setSelectedTab(tab.key); setError(""); setSuccess(""); }}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab.key
                  ? "bg-fizmo-purple-500 text-white"
                  : "bg-fizmo-dark-800 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Info Tab */}
      {selectedTab === "personal" && (
        <div className="glassmorphic rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
            <Input label="Email Address" value={profile.email} type="email" disabled />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <select
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-4 py-3 bg-fizmo-dark-800 border border-fizmo-purple-500/30 rounded-lg text-white"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="IN">India</option>
                <option value="AE">UAE</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {selectedTab === "security" && (
        <div className="space-y-6">
          <div className="glassmorphic rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Two-Factor Authentication (2FA)</h3>
            <div className="flex items-center justify-between p-4 bg-fizmo-dark-800 rounded-lg mb-4">
              <div>
                <p className="text-white font-medium">2FA Status</p>
                <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded text-sm ${
                  twoFactorEnabled ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}>
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
                {!twoFactorEnabled ? (
                  <Button size="sm" onClick={handleEnable2FA} disabled={loading}>
                    {loading ? "Loading..." : "Enable 2FA"}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={handleDisable2FA} disabled={loading}>
                    {loading ? "Loading..." : "Disable 2FA"}
                  </Button>
                )}
              </div>
            </div>

            {/* QR Code Setup */}
            {showQRCode && (
              <div className="p-6 bg-fizmo-dark-800 rounded-lg mb-4 space-y-4">
                <h4 className="text-lg font-bold text-white">Scan QR Code</h4>
                <p className="text-gray-400 text-sm">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="flex justify-center">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-64 h-64" />
                </div>
                <div className="p-4 bg-fizmo-dark-700 rounded-lg">
                  <p className="text-white text-sm font-medium mb-2">Manual Entry Code:</p>
                  <code className="text-fizmo-purple-400 text-sm break-all">{manualEntry}</code>
                </div>
                <div className="space-y-2">
                  <Input
                    label="Enter Verification Code"
                    placeholder="Enter 6-digit code from your app"
                    value={verifyTokenInput}
                    onChange={(e) => setVerifyTokenInput(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleVerify2FA} disabled={loading}>
                      {loading ? "Verifying..." : "Verify & Enable"}
                    </Button>
                    <Button variant="outline" onClick={() => { setShowQRCode(false); setVerifyTokenInput(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Codes */}
            {backupCodes.length > 0 && (
              <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                <h4 className="text-lg font-bold text-green-500 mb-2">Backup Codes</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Save these backup codes in a safe place. You can use them to access your account if you
                  lose your authenticator device.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, i) => (
                    <code key={i} className="p-2 bg-fizmo-dark-800 rounded text-fizmo-purple-400 text-sm text-center">
                      {code}
                    </code>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-4" onClick={() => setBackupCodes([])}>
                  I've Saved My Codes
                </Button>
              </div>
            )}

            {!twoFactorEnabled && !showQRCode && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-500 text-sm">
                  We strongly recommend enabling 2FA to protect your account from unauthorized access.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification Tab */}
      {selectedTab === "verification" && <KYCUpload />}
    </div>
  );
}
