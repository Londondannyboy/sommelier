import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Playfair_Display } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { FloatingVoiceWidget } from "@/components/FloatingVoiceWidget";
import "./globals.css";

// Skeleton for NavBar during SSR
function NavBarSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex flex-col">
            <div className="h-7 w-24 bg-stone-200 rounded animate-pulse" />
            <div className="h-3 w-32 bg-stone-100 rounded animate-pulse mt-1 hidden sm:block" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-stone-100 rounded-full animate-pulse" />
            <div className="w-20 h-9 bg-stone-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  )
}

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
      <body className={`${geistSans.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Suspense fallback={<NavBarSkeleton />}>
              <NavBar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            {/* Floating Voice Widget - accessible from all pages */}
            <Suspense fallback={null}>
              <FloatingVoiceWidget />
            </Suspense>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
