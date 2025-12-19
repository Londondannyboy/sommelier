'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SaveWineButton } from '@/components/SaveWineButton'

interface Wine {
  id: number
  name: string
  slug: string
  winery: string
  region: string
  country: string
  grape_variety: string
  vintage: number | null
  wine_type: string
  style: string
  color: string | null
  price_retail: number | null
  tasting_notes: string
  food_pairings: string[]
  alcohol_percentage: number | null
  image_url: string
}

interface WineDetailClientProps {
  wine: Wine
}

// Format price with proper currency
function formatPrice(price: number | null): string {
  if (!price) return 'Price on request'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Placeholder image for wines without images
const PLACEHOLDER_IMAGE = '/wine-placeholder.svg'

export default function WineDetailClient({ wine }: WineDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')

    // Check if wine already in cart
    const existingIndex = existingCart.findIndex((item: { id: number }) => item.id === wine.id)

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += quantity
    } else {
      existingCart.push({
        id: wine.id,
        name: wine.name,
        slug: wine.slug,
        winery: wine.winery,
        price: wine.price_retail || 0,
        quantity,
        image_url: wine.image_url,
      })
    }

    localStorage.setItem('sommelier-cart', JSON.stringify(existingCart))

    // Dispatch custom event to update cart count in NavBar
    window.dispatchEvent(new Event('cart-updated'))

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Generate wine type description for SEO content
  const wineTypeDescriptions: Record<string, string> = {
    red: 'This red wine showcases the depth and complexity that wine enthusiasts seek. Red wines are known for their rich tannins, full body, and ability to age gracefully.',
    white: 'This white wine offers refreshing acidity and aromatic complexity. White wines are celebrated for their crisp character and food-friendly versatility.',
    rose: 'This rosé wine combines the best of both worlds with its delicate pink hue and refreshing character. Rosé wines are perfect for warm weather and light cuisine.',
    sparkling: 'This sparkling wine delivers elegant effervescence and celebratory character. Sparkling wines are crafted through secondary fermentation to create their signature bubbles.',
    dessert: 'This dessert wine offers luscious sweetness balanced with acidity. Dessert wines are crafted to pair perfectly with sweet courses or enjoyed on their own.'
  }

  // Generate region description for SEO content
  const getRegionDescription = () => {
    const regionLower = wine.region?.toLowerCase() || ''
    if (regionLower.includes('bordeaux') || regionLower.includes('pomerol') || regionLower.includes('margaux') || regionLower.includes('pauillac') || regionLower.includes('st emilion') || regionLower.includes('pessac')) {
      return `${wine.region} is one of the world's most prestigious wine regions, renowned for producing exceptional wines that command respect from collectors and connoisseurs alike. The unique terroir of this Bordeaux appellation creates wines of remarkable depth and aging potential.`
    }
    if (regionLower.includes('burgundy') || regionLower.includes('bourgogne')) {
      return `${wine.region} represents the pinnacle of Pinot Noir and Chardonnay production. This legendary Burgundy region produces wines of extraordinary finesse and complexity.`
    }
    if (regionLower.includes('champagne')) {
      return `${wine.region} is the birthplace of the world's most celebrated sparkling wines. Only wines produced in this region can bear the prestigious Champagne designation.`
    }
    return `${wine.region} produces distinctive wines that reflect the unique character of its terroir. This region has earned recognition for the quality and consistency of its wine production.`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,10,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Breadcrumb with schema markup */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 pt-24">
        <nav aria-label="Breadcrumb" className="text-sm text-gold-400/60">
          <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item" className="hover:text-gold-300">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span className="mx-2">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/wines" itemProp="item" className="hover:text-gold-300">
                <span itemProp="name">Wines</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span className="mx-2">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name" className="text-gold-200">{wine.name}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16">
        <article itemScope itemType="https://schema.org/Product">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Wine Image - Larger size for better display */}
            <div className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-2xl p-8 md:p-12 flex items-center justify-center border border-gold-700/20 min-h-[500px]">
              <figure className="relative w-64 h-96 md:w-80 md:h-[480px]">
                <Image
                  src={wine.image_url || PLACEHOLDER_IMAGE}
                  alt={`${wine.name} - ${wine.wine_type} wine from ${wine.region}, ${wine.country} by ${wine.winery}`}
                  fill
                  className="object-contain rounded-lg"
                  itemProp="image"
                  priority
                  sizes="(max-width: 768px) 256px, 320px"
                />
                <figcaption className="sr-only">
                  {wine.name} wine bottle from {wine.winery}
                </figcaption>
              </figure>
            </div>

            {/* Wine Info */}
            <div>
              {/* Wine Type Badge */}
              <div className="mb-3">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                  wine.wine_type === 'red' ? 'bg-red-900/50 text-red-300 border border-red-700/30' :
                  wine.wine_type === 'white' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/30' :
                  wine.wine_type === 'rose' ? 'bg-pink-900/50 text-pink-300 border border-pink-700/30' :
                  wine.wine_type === 'sparkling' ? 'bg-amber-900/50 text-amber-300 border border-amber-700/30' :
                  'bg-purple-900/50 text-purple-300 border border-purple-700/30'
                }`}>
                  {wine.wine_type.charAt(0).toUpperCase() + wine.wine_type.slice(1)} Wine
                </span>
              </div>

              {/* H1 - Main heading with full wine name keyword */}
              <h1
                className="text-3xl md:text-4xl font-serif font-bold text-gold-100 mb-3"
                itemProp="name"
              >
                {wine.name}
              </h1>

              {/* Producer & Region - H2 subheading */}
              <h2 className="text-lg text-gold-400/80 mb-4">
                {wine.winery} - {wine.region}, {wine.country}
              </h2>

              {/* Vintage & Details */}
              {wine.vintage && (
                <p className="text-gold-300/60 mb-4">
                  <strong>Vintage:</strong> {wine.vintage} | <strong>Region:</strong> {wine.region}
                </p>
              )}

              {/* Price */}
              <p
                className="text-3xl font-bold text-gold-400 mb-6"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <span itemProp="price" content={wine.price_retail?.toString() || '0'}>
                  {formatPrice(wine.price_retail)}
                </span>
                <meta itemProp="priceCurrency" content="GBP" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
              </p>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gold-700/30 rounded-lg bg-stone-900/50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gold-300 hover:bg-gold-900/30 transition-colors rounded-l-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium text-gold-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gold-300 hover:bg-gold-900/30 transition-colors rounded-r-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-gradient-to-r from-gold-500 to-gold-600 text-black hover:from-gold-400 hover:to-gold-500 shadow-[0_0_20px_rgba(212,165,10,0.3)]'
                  }`}
                >
                  {addedToCart ? 'Added to Cart!' : `Add ${wine.name} to Cart`}
                </button>

                <SaveWineButton wineId={wine.id} size="lg" />
              </div>

              {/* About This Wine - SEO Content Section */}
              <section className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-6 border border-gold-700/20 mb-6">
                <h3 className="font-bold text-gold-200 mb-3 text-lg">
                  About {wine.name}
                </h3>
                <div itemProp="description" className="text-gold-300/80 leading-relaxed space-y-4">
                  <p>
                    {wine.name} is a distinguished {wine.wine_type} wine produced by {wine.winery} in the renowned {wine.region} region of {wine.country}.
                    {wine.grape_variety && ` Crafted from ${wine.grape_variety} grapes, this wine exemplifies the finest traditions of winemaking.`}
                  </p>
                  <p>
                    {wineTypeDescriptions[wine.wine_type] || wineTypeDescriptions.red}
                  </p>
                  <p>
                    {getRegionDescription()}
                  </p>
                </div>
              </section>

              {/* Tasting Notes */}
              {wine.tasting_notes && (
                <section className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-6 border border-gold-700/20 mb-6">
                  <h3 className="font-bold text-gold-200 mb-3 text-lg">
                    Tasting Notes for {wine.name}
                  </h3>
                  <p className="text-gold-300/80 leading-relaxed">{wine.tasting_notes}</p>
                </section>
              )}

              {/* Wine Details */}
              <section className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-6 border border-gold-700/20 mb-6">
                <h3 className="font-bold text-gold-200 mb-4 text-lg">
                  {wine.name} Wine Details
                </h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gold-500/60">Producer</dt>
                    <dd className="text-gold-200 font-medium" itemProp="brand">{wine.winery}</dd>
                  </div>
                  <div>
                    <dt className="text-gold-500/60">Grape Variety</dt>
                    <dd className="text-gold-200 font-medium">{wine.grape_variety || 'Classic Blend'}</dd>
                  </div>
                  <div>
                    <dt className="text-gold-500/60">Wine Style</dt>
                    <dd className="text-gold-200 font-medium">{wine.style || wine.wine_type}</dd>
                  </div>
                  <div>
                    <dt className="text-gold-500/60">Region</dt>
                    <dd className="text-gold-200 font-medium">{wine.region}</dd>
                  </div>
                  <div>
                    <dt className="text-gold-500/60">Country</dt>
                    <dd className="text-gold-200 font-medium">{wine.country}</dd>
                  </div>
                  {wine.alcohol_percentage && (
                    <div>
                      <dt className="text-gold-500/60">Alcohol</dt>
                      <dd className="text-gold-200 font-medium">{wine.alcohol_percentage}%</dd>
                    </div>
                  )}
                  {wine.vintage && (
                    <div>
                      <dt className="text-gold-500/60">Vintage Year</dt>
                      <dd className="text-gold-200 font-medium">{wine.vintage}</dd>
                    </div>
                  )}
                </dl>
              </section>

              {/* Food Pairings */}
              {wine.food_pairings && wine.food_pairings.length > 0 && (
                <section className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-6 border border-gold-700/20 mb-6">
                  <h3 className="font-bold text-gold-200 mb-3 text-lg">
                    Food Pairings for {wine.name}
                  </h3>
                  <p className="text-gold-300/80 mb-4">
                    This {wine.wine_type} wine pairs beautifully with a variety of dishes. Our sommelier recommends:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {wine.food_pairings.map((pairing, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gold-900/30 text-gold-300 rounded-full text-sm border border-gold-700/30"
                      >
                        {pairing}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Why Buy From Aionysus - SEO Content */}
              <section className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-6 border border-gold-700/20">
                <h3 className="font-bold text-gold-200 mb-3 text-lg">
                  Why Buy {wine.name} from Aionysus?
                </h3>
                <ul className="text-gold-300/80 space-y-2 list-disc list-inside">
                  <li>AI-powered sommelier recommendations tailored to your preferences</li>
                  <li>Expertly curated collection of over 3,800 fine wines</li>
                  <li>Secure packaging and reliable delivery across the UK</li>
                  <li>Authentic wines sourced directly from prestigious producers</li>
                  <li>Dedicated customer service from wine experts</li>
                </ul>
              </section>
            </div>
          </div>

          {/* Additional SEO Content - Wine Investment & Collecting */}
          <section className="mt-12 bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl p-8 border border-gold-700/20">
            <h3 className="font-bold text-gold-200 mb-4 text-xl">
              Investing in {wine.name}
            </h3>
            <div className="text-gold-300/80 leading-relaxed space-y-4">
              <p>
                Fine wines like {wine.name} from {wine.region} have historically demonstrated strong investment potential.
                Collectors and investors appreciate wines from {wine.winery} for their consistent quality, aging potential, and market demand.
              </p>
              <p>
                When considering {wine.name} for your collection, factors such as provenance, storage conditions, and vintage quality all play crucial roles.
                The {wine.vintage || 'current'} vintage from {wine.region} represents an excellent opportunity for both enjoyment and long-term appreciation.
              </p>
              <p>
                At Aionysus, we provide expert guidance through our AI sommelier to help you make informed decisions about building your wine collection.
                Whether you're purchasing {wine.name} for immediate enjoyment or cellaring, our team ensures every bottle meets the highest standards of quality and authenticity.
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}
