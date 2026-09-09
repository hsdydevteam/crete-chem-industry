import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://crete-chem.vercel.app",
  ),
  title: {
    default: "CRETE-CHEM | Waterproofing & Construction Chemical Solutions",
    template: "%s | CRETE-CHEM",
  },
  description:
    "Professional waterproofing, construction chemicals, concrete repair and technical application support across Pakistan. Authorized Agent of Sika Pakistan.",
  openGraph: {
    title: "CRETE-CHEM — Stronger Structures. Leak-Free Living.",
    description:
      "Professional waterproofing, construction chemicals, concrete repair and technical application support across Pakistan. Authorized Agent of Sika Pakistan.",
    images: ["/assets/hero-waterproofing-enhanced.webp"],
    type: "website",
  },
  icons: { icon: "/assets/crete-chem-logo-enhanced.png" },
};
export const viewport: Viewport = { themeColor: "#061A35" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
