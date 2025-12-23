import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "Fizmo - All-in-One Forex CRM & Back Office",
  description: "Comprehensive Forex CRM and back-office platform for brokers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
