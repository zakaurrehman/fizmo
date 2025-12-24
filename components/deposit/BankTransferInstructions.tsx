"use client";

import { useState } from "react";
import { FaCopy, FaCheckCircle, FaUniversity } from "react-icons/fa";

interface BankTransferInstructionsProps {
  depositId: string;
  amount: number;
  currency: string;
}

export function BankTransferInstructions({
  depositId,
  amount,
  currency,
}: BankTransferInstructionsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  // Company bank details (replace with your actual bank details)
  const companyBankDetails = {
    accountName: "Fizmo Trading Ltd",
    bankName: "First National Bank",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    swiftCode: "FNBAUS33",
    iban: "US89370400440532013000",
    reference: depositId.substring(0, 8).toUpperCase(),
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="glassmorphic rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-fizmo-purple-500/20 rounded-full flex items-center justify-center">
          <FaUniversity className="text-2xl text-fizmo-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Bank Transfer Instructions</h3>
          <p className="text-sm text-gray-400">Follow these steps to complete your deposit</p>
        </div>
      </div>

      {/* Amount to Transfer */}
      <div className="bg-fizmo-dark-800 rounded-lg p-4 border border-fizmo-purple-500/30">
        <p className="text-sm text-gray-400 mb-1">Amount to Transfer</p>
        <p className="text-3xl font-bold text-fizmo-purple-400">
          {currency} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Bank Details */}
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-white">Transfer to This Account:</h4>

        {/* Account Name */}
        <div className="bg-fizmo-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Account Name</p>
              <p className="text-white font-medium">{companyBankDetails.accountName}</p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.accountName, "accountName")}
              className="ml-4 p-2 bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 rounded-lg transition-colors"
            >
              {copied === "accountName" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Bank Name */}
        <div className="bg-fizmo-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Bank Name</p>
              <p className="text-white font-medium">{companyBankDetails.bankName}</p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.bankName, "bankName")}
              className="ml-4 p-2 bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 rounded-lg transition-colors"
            >
              {copied === "bankName" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Account Number */}
        <div className="bg-fizmo-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Account Number</p>
              <p className="text-white font-medium font-mono">{companyBankDetails.accountNumber}</p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.accountNumber, "accountNumber")}
              className="ml-4 p-2 bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 rounded-lg transition-colors"
            >
              {copied === "accountNumber" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Routing Number (US) */}
        <div className="bg-fizmo-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Routing Number (US)</p>
              <p className="text-white font-medium font-mono">{companyBankDetails.routingNumber}</p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.routingNumber, "routingNumber")}
              className="ml-4 p-2 bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 rounded-lg transition-colors"
            >
              {copied === "routingNumber" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* SWIFT Code */}
        <div className="bg-fizmo-dark-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">SWIFT/BIC Code (International)</p>
              <p className="text-white font-medium font-mono">{companyBankDetails.swiftCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.swiftCode, "swiftCode")}
              className="ml-4 p-2 bg-fizmo-purple-500/20 hover:bg-fizmo-purple-500/30 rounded-lg transition-colors"
            >
              {copied === "swiftCode" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>

        {/* Reference Number - IMPORTANT */}
        <div className="bg-gradient-to-r from-fizmo-purple-500/20 to-pink-500/20 rounded-lg p-4 border-2 border-fizmo-purple-500/50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-fizmo-purple-300 mb-1 font-bold">
                ⚠️ IMPORTANT: Reference Number
              </p>
              <p className="text-white font-bold text-lg font-mono">{companyBankDetails.reference}</p>
              <p className="text-xs text-gray-400 mt-2">
                Include this reference number in your transfer to ensure proper crediting
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(companyBankDetails.reference, "reference")}
              className="ml-4 p-2 bg-fizmo-purple-500/30 hover:bg-fizmo-purple-500/40 rounded-lg transition-colors"
            >
              {copied === "reference" ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaCopy className="text-fizmo-purple-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-fizmo-dark-800/50 rounded-lg p-4 space-y-2">
        <h5 className="font-bold text-white mb-3">Important Instructions:</h5>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Transfer the exact amount shown above to the bank account details provided</li>
          <li>
            <strong className="text-fizmo-purple-300">MUST include the reference number</strong> in the
            transfer description/memo field
          </li>
          <li>Funds typically take 1-3 business days to process</li>
          <li>International transfers may take 3-5 business days</li>
          <li>Your deposit will be credited once we receive and verify the transfer</li>
          <li>You will receive an email confirmation once your deposit is processed</li>
        </ol>
      </div>

      {/* Processing Time */}
      <div className="border-t border-fizmo-dark-700 pt-4">
        <p className="text-sm text-gray-400 text-center">
          <strong className="text-white">Processing Time:</strong> 1-3 business days (domestic) | 3-5
          business days (international)
        </p>
      </div>
    </div>
  );
}
