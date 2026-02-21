"use client";
export default function PendingIBWithdrawPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pending IB Withdraw</h1>
        <p className="text-gray-400">IB partner withdrawals awaiting approval</p>
      </div>
      <div className="glassmorphic rounded-xl p-12 text-center">
        <p className="text-gray-400 text-sm">No data available</p>
      </div>
    </div>
  );
}
