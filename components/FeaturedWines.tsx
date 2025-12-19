'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Wine {
  id: number
  name: string
  slug: string | null
  winery: string
  region: string
  wine_type: string
  price_retail: number | null
  image_url: string
  vintage: number | null
}

function formatPrice(price: number | null): string {
  if (!price) return 'Price on request'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const PLACEHOLDER_IMAGE = '/wine-placeholder.svg'

export function FeaturedWines() {
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWines() {
      try {
        const response = await fetch('/api/wines?limit=12&featured=true')
        if (response.ok) {
          const data = await response.json()
          setWines(data.slice(0, 12))
        }
      } catch (error) {
        console.error('Error fetching wines:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWines()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-2 border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (wines.length === 0) return null

  return (
    <div className="relative">
      {/* Scrollable container */}
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex gap-4 px-4 min-w-max">
          {wines.map((wine) => (
            <Link
              key={wine.id}
              href={`/wines/${wine.slug || wine.id}`}
              className="flex-shrink-0 w-48 bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 overflow-hidden hover:border-gold-500/40 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all group"
            >
              <div className="aspect-[3/4] relative bg-stone-900">
                <Image
                  src={wine.image_url || PLACEHOLDER_IMAGE}
                  alt={wine.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="192px"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Wine type badge */}
                <div className="absolute bottom-2 left-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    wine.wine_type === 'red' ? 'bg-red-900/70 text-red-300' :
                    wine.wine_type === 'white' ? 'bg-yellow-900/70 text-yellow-300' :
                    wine.wine_type === 'rose' ? 'bg-pink-900/70 text-pink-300' :
                    wine.wine_type === 'sparkling' ? 'bg-amber-900/70 text-amber-300' :
                    'bg-purple-900/70 text-purple-300'
                  }`}>
                    {wine.wine_type?.charAt(0).toUpperCase() + wine.wine_type?.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-2 group-hover:text-gold-300 transition-colors leading-tight">
                  {wine.name}
                </h3>
                <p className="text-xs text-stone-400 mb-2 line-clamp-1">{wine.region}</p>
                <p className="font-bold text-gold-400 text-sm">{formatPrice(wine.price_retail)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View all link */}
      <div className="text-center mt-6">
        <Link
          href="/wines"
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors"
        >
          View All 3,800+ Wines
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
