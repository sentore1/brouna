import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "../components/NavbarWrapper";
import Footer from "../components/Footer";
import { generateOrganizationJsonLd } from "../lib/seo";
import AnalyticsTracker from "../components/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "brouna - High-End Fashion & Designer Clothing",
  description: "Discover high-end fashion at brouna. Shop premium designer clothing, elegant dresses, sophisticated accessories, and timeless pieces crafted for the modern wardrobe.",
  keywords: "fashion, high-end clothing, designer wear, premium apparel, elegant dresses, sophisticated style, designer fashion, exclusive clothing, brouna",
  authors: [{ name: "brouna" }],
  openGraph: {
    title: "brouna - High-End Fashion & Designer Clothing",
    description: "Discover high-end fashion at brouna. Shop premium designer clothing, elegant dresses, sophisticated accessories, and timeless pieces.",
    url: "https://brouna.com",
    siteName: "brouna",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "brouna - High-End Fashion",
    description: "Shop premium designer clothing and fashion at brouna",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();
  
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Museo+Moderno:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsTracker />
        <NavbarWrapper />
        {children}
        <Footer />
      </body>
    </html>
  );
}
