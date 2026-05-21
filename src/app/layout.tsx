import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cys - Developer",
  description: "Developer focused on automation, desktop software, and tooling systems. Open for commissions.",
  keywords: ["developer", "automation", "AutoHotkey", "Python", "desktop software", "macros"],
  openGraph: {
    title: "Cys - Developer",
    description: "Developer focused on automation, desktop software, and tooling systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
