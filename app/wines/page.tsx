'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Wine {
  id: number
  name: string
  winery: string
  region: string
  wine_type: string
  color: string | null
  price_retail: number | null
  image_url: string
  vintage: number | null
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

export default function WinesPage() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchWines() {
      try {
        const response = await fetch('/api/wines')
        if (response.ok) {
          const data = await response.json()
          setWines(data)
        }
      } catch (error) {
        console.error('Error fetching wines:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWines()
  }, [])

  // Filter wines by wine_type (red, white, rose, sparkling, dessert)
  const filteredWines = filter === 'all'
    ? wines
    : wines.filter(w => {
        const wineType = (w.wine_type || '').toLowerCase()
        const color = (w.color || '').toLowerCase()
        // Match against both wine_type and color fields
        return wineType === filter || color === filter
      })

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,10,0.1)_0%,transparent_50%)]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-28">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">✦ The Collection ✦</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
            Wine Collection
          </h1>
          <p className="text-gold-200/60 mt-3">Curated wines recommended by your divine sommelier</p>
        </div>

        {/* Filters - Golden themed */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['all', 'red', 'white', 'rose', 'sparkling', 'dessert'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-[0_0_20px_rgba(212,165,10,0.4)]'
                  : 'bg-stone-900/50 text-gold-300/80 border border-gold-700/30 hover:border-gold-500/50 hover:text-gold-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWines.map((wine) => (
              <Link
                key={wine.id}
                href={`/wines/${wine.id}`}
                className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 overflow-hidden hover:border-gold-500/40 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all group"
              >
                <div className="aspect-[3/4] relative bg-stone-900">
                  <Image
                    src={wine.image_url || PLACEHOLDER_IMAGE}
                    alt={wine.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                    (wine.color || wine.wine_type || '').toLowerCase() === 'red' ? 'bg-red-900/50 text-red-300 border border-red-700/30' :
                    (wine.color || wine.wine_type || '').toLowerCase() === 'white' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/30' :
                    (wine.color || wine.wine_type || '').toLowerCase() === 'rose' ? 'bg-pink-900/50 text-pink-300 border border-pink-700/30' :
                    (wine.color || wine.wine_type || '').toLowerCase() === 'sparkling' ? 'bg-amber-900/50 text-amber-300 border border-amber-700/30' :
                    'bg-purple-900/50 text-purple-300 border border-purple-700/30'
                  }`}>
                    {wine.color || wine.wine_type || 'Wine'}
                  </span>
                  <h3 className="font-semibold text-gold-100 mb-1 line-clamp-2 group-hover:text-gold-300 transition-colors">{wine.name}</h3>
                  <p className="text-sm text-gold-400/60 mb-2">{wine.region}</p>
                  <p className="font-bold text-gold-400">{formatPrice(wine.price_retail)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Wine count */}
        {!loading && (
          <p className="text-center text-gold-500/40 text-sm mt-12">
            Showing {filteredWines.length} of {wines.length} wines
          </p>
        )}
      </main>
    </div>
  )
}
