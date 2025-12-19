import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Sommelier & AI Wine Taster | Aionysus - Free Wine Expert",
  description: "Aionysus is your AI sommelier and AI wine taster. Get instant wine recommendations, food pairings, and investment advice for premium Bordeaux. Free to use.",
  keywords: ["AI sommelier", "AI wine taster", "sommelier AI", "wine recommendations", "wine pairing", "AI wine advisor", "Bordeaux wine", "wine investment", "Aionysus", "voice AI wine"],
  authors: [{ name: "Aionysus" }],
  creator: "Aionysus",
  metadataBase: new URL("https://aionysus.wine"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "AI Sommelier & AI Wine Taster | Aionysus",
    description: "Aionysus is your AI sommelier and AI wine taster. Instant wine recommendations and food pairings. Free to use.",
    siteName: "Aionysus",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sommelier & AI Wine Taster | Aionysus",
    description: "Aionysus - your AI sommelier and AI wine taster. Free instant wine recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aionysus",
  description: "Aionysus - AI sommelier and AI wine taster. Get personalized wine recommendations, food pairings, and investment advice.",
  url: "https://aionysus.wine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${playfair.variable} antialiased`}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
