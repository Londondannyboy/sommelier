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
  title: "Aionysus | Buy Wine Online - AI Sommelier & Wine Expert UK",
  description: "Buy wine online from Aionysus, your AI sommelier and wine expert. Shop 3,800+ fine wines with instant recommendations, food pairings, and expert guidance. Free UK delivery.",
  keywords: ["buy wine online", "buy wine online UK", "wine online", "AI sommelier", "AI wine taster", "wine shop online", "fine wine UK", "wine recommendations", "wine delivery UK", "Aionysus"],
  authors: [{ name: "Aionysus" }],
  creator: "Aionysus",
  metadataBase: new URL("https://aionysus.wine"),
  icons: {
    icon: "/aionysus-classic-icon.png",
    apple: "/aionysus-classic-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: "Buy Wine Online | Aionysus - AI Sommelier UK",
    description: "Buy wine online from Aionysus. AI-powered wine recommendations from 3,800+ fine wines. Your personal sommelier, available 24/7.",
    siteName: "Aionysus",
    images: [
      {
        url: "/aionysus-classic-icon.png",
        width: 512,
        height: 512,
        alt: "Aionysus - Buy Wine Online with AI Sommelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Wine Online | Aionysus - AI Sommelier",
    description: "Buy wine online with AI-powered recommendations. 3,800+ fine wines, instant expert guidance.",
    images: ["/aionysus-classic-icon.png"],
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
  description: "Buy wine online from Aionysus - your AI sommelier and wine expert. Shop 3,800+ fine wines with personalized recommendations and expert guidance.",
  url: "https://aionysus.wine",
  logo: "https://aionysus.wine/aionysus-classic-icon.png",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: "English",
  },
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
