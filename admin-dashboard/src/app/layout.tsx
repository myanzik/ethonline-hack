import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import YellowNetworkStatus from "@/components/YellowNetworkStatus";
import YellowNetworkProvider from "@/components/YellowNetworkProvider";
import WalletButton from "@/components/WalletButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing merchants, beneficiaries, and channels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <YellowNetworkProvider>
          <Navigation />
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <YellowNetworkStatus />
              <WalletButton />
            </div>
          </div>
          {children}
        </YellowNetworkProvider>
      </body>
    </html>
  );
}
