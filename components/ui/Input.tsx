import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 ${
          error ? "bg-red-500/10 border-red-500" : "input-purple"
        } text-white placeholder-gray-400 transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
