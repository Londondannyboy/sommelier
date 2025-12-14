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
  title: "Sommelier AI | SommelierQuest - Free AI Wine Expert",
  description: "Sommelier AI by SommelierQuest - your free AI sommelier for instant wine recommendations and food pairings. The best sommelier AI app for wine advice.",
  keywords: ["sommelier AI", "sommelier ai", "AI sommelier", "SommelierQuest", "wine recommendations", "wine pairing", "wine expert", "AI wine advisor", "sommelier ai app", "ai wine sommelier", "free sommelier"],
  authors: [{ name: "SommelierQuest" }],
  creator: "SommelierQuest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sommelier.quest"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Sommelier AI | SommelierQuest - Free AI Wine Expert",
    description: "Sommelier AI by SommelierQuest provides instant wine recommendations and food pairings. The best free sommelier AI for wine advice.",
    siteName: "SommelierQuest",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sommelier AI | SommelierQuest - Free AI Wine Expert",
    description: "Sommelier AI by SommelierQuest - instant wine recommendations and food pairings. Free AI sommelier app.",
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
  name: "SommelierQuest",
  description: "AI-powered wine advisor and sommelier. Get personalized wine recommendations and food pairings.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://sommelier.quest",
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
