import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Playfair_Display } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

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
  title: {
    default: "Sommelier AI | Your Personal Wine Expert",
    template: "%s | Sommelier AI"
  },
  description: "Talk to your personal AI sommelier. Get expert wine recommendations, food pairings, and discover new wines through natural conversation. Your pocket wine expert powered by AI.",
  keywords: ["sommelier AI", "AI sommelier", "wine recommendations", "wine pairing", "wine expert", "AI wine advisor", "wine chatbot", "wine assistant"],
  authors: [{ name: "Sommelier AI" }],
  creator: "Sommelier AI",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sommelier.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Sommelier AI | Your Personal Wine Expert",
    description: "Talk to your personal AI sommelier. Get expert wine recommendations and food pairings through natural conversation.",
    siteName: "Sommelier AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sommelier AI | Your Personal Wine Expert",
    description: "Talk to your personal AI sommelier. Get expert wine recommendations and food pairings.",
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
  name: "Sommelier AI",
  description: "AI-powered wine advisor and sommelier. Get personalized wine recommendations and food pairings.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://sommelier.ai",
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
            <Suspense fallback={<div className="h-16 bg-cream border-b border-wine-100" />}>
              <Navigation />
            </Suspense>
            <main className="min-h-screen">
              {children}
            </main>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
