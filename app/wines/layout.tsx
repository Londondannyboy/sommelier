import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Buy Wine Online UK | 3,800+ Fine Wines | Aionysus",
  description: "Buy wine online from our collection of 3,800+ fine wines. Red, white, rosé, sparkling & dessert wines. Bordeaux, Burgundy, Champagne & more. Free UK delivery on orders over £200.",
  keywords: ["buy wine online", "buy wine online UK", "wine shop", "fine wine UK", "red wine", "white wine", "champagne", "bordeaux wine", "burgundy wine", "wine delivery UK"],
  openGraph: {
    title: "Buy Wine Online | 3,800+ Fine Wines | Aionysus",
    description: "Shop 3,800+ fine wines online. AI sommelier recommendations, expert guidance. Buy wine online UK.",
    type: "website",
    url: "https://aionysus.wine/wines",
  },
  alternates: {
    canonical: "https://aionysus.wine/wines",
  },
}

export default function WinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
