import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GeoLocationProvider } from "@/src/context/GeoLocationContext";
import InquiryModal from "@/src/components/public/InquiryModal";
import FloatingContactCTA from "@/src/components/public/FloatingContactCTA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALPHA Medical Supplies | Surgical Instruments & Equipment",
  description: "Premier USA & Global Medical Supplies and German Stainless Steel Surgical Instrumentation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GeoLocationProvider>
          {children}
          <InquiryModal />
          <FloatingContactCTA />
        </GeoLocationProvider>
      </body>
    </html>
  );
}
