import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-dark px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm mb-8 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-8">Terms and Conditions</h1>
        <div className="glassmorphic rounded-xl p-8 space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Fizmo Trading Platform, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years of age and legally permitted to trade financial instruments in your jurisdiction. By registering, you confirm that you meet these requirements.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration and to keep this information up to date.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Trading Risks</h2>
            <p>Trading in forex and other financial instruments involves substantial risk of loss. Past performance is not indicative of future results. You should only trade with funds you can afford to lose.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Deposits and Withdrawals</h2>
            <p>All deposits and withdrawals are subject to verification and compliance checks. Processing times may vary depending on the payment method used. We reserve the right to request additional documentation.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Prohibited Activities</h2>
            <p>You agree not to use the platform for money laundering, fraud, or any other illegal activity. We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>Fizmo Trading Platform shall not be liable for any losses arising from trading activities, system failures, or circumstances beyond our control. Our liability is limited to the extent permitted by applicable law.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.</p>
          </section>
          <p className="text-gray-500 pt-4 border-t border-gray-800">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  );
}
