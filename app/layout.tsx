import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "For Dabne | My Forever Valentine",
  description: "A question for my love, Nathaniel.",
};

// NEW: themeColor moves here
export const viewport: Viewport = {
  themeColor: "#ffe4e6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-rose-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}