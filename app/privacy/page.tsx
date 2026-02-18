import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="glassmorphic rounded-xl p-8 space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect personal information you provide during registration, including your name, email address, phone number, and identity verification documents. We also collect trading activity data and technical information such as IP addresses and browser details.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your information is used to provide and improve our services, process transactions, verify your identity, comply with regulatory requirements, and communicate with you about your account.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Protection</h2>
            <p>We implement industry-standard security measures to protect your personal data, including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share data with regulatory authorities as required by law, payment processors to facilitate transactions, and identity verification services for KYC compliance.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p>We use cookies and similar technologies to improve your experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also request a copy of your data or object to certain processing activities. Contact our support team to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@fizmo.com" className="text-purple-400 hover:text-purple-300">support@fizmo.com</a>.</p>
          </section>
          <p className="text-gray-500 pt-4 border-t border-gray-800">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  );
}
