'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SaveWineButton } from '@/components/SaveWineButton'

interface Wine {
  id: number
  name: string
  slug: string | null
  winery: string
  region: string
  wine_type: string
  color: string | null
  price_retail: number | null
  image_url: string
  vintage: number | null
}

// Price range options
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under £500', min: 0, max: 500 },
  { label: '£500 - £1,000', min: 500, max: 1000 },
  { label: '£1,000 - £2,500', min: 1000, max: 2500 },
  { label: '£2,500 - £5,000', min: 2500, max: 5000 },
  { label: '£5,000+', min: 5000, max: Infinity },
]

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
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<number>(0)
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [wineryFilter, setWineryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  // Get unique regions and wineries for filter dropdowns
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(wines.map(w => w.region).filter(Boolean))]
    return uniqueRegions.sort()
  }, [wines])

  const wineries = useMemo(() => {
    const uniqueWineries = [...new Set(wines.map(w => w.winery).filter(Boolean))]
    return uniqueWineries.sort()
  }, [wines])

  // Count active filters
  const activeFilterCount = [
    typeFilter !== 'all',
    priceFilter !== 0,
    regionFilter !== 'all',
    wineryFilter !== 'all',
  ].filter(Boolean).length

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter('all')
    setPriceFilter(0)
    setRegionFilter('all')
    setWineryFilter('all')
    setSearchQuery('')
  }

  // Filter wines
  const filteredWines = wines.filter(w => {
    // Type filter
    const matchesType = typeFilter === 'all' ||
      (w.wine_type || '').toLowerCase() === typeFilter ||
      (w.color || '').toLowerCase() === typeFilter

    // Price filter
    const priceRange = PRICE_RANGES[priceFilter]
    const price = w.price_retail || 0
    const matchesPrice = price >= priceRange.min && price < priceRange.max

    // Region filter
    const matchesRegion = regionFilter === 'all' || w.region === regionFilter

    // Winery filter
    const matchesWinery = wineryFilter === 'all' || w.winery === wineryFilter

    // Search filter (name, winery, region)
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query ||
      (w.name || '').toLowerCase().includes(query) ||
      (w.winery || '').toLowerCase().includes(query) ||
      (w.region || '').toLowerCase().includes(query)

    return matchesType && matchesPrice && matchesRegion && matchesWinery && matchesSearch
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
          <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">✦ Buy Wine Online UK ✦</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
            Buy Wine Online
          </h1>
          <p className="text-gold-200/60 mt-3">3,800+ fine wines curated by your AI sommelier. Buy wine online with expert guidance.</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wines, wineries, regions..."
                className="w-full px-5 py-3 pl-12 rounded-full bg-stone-900/50 border border-gold-700/30 text-gold-100 placeholder:text-gold-400/40 focus:outline-none focus:border-gold-500 focus:shadow-[0_0_20px_rgba(212,165,10,0.2)] transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400/60 hover:text-gold-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                showFilters || activeFilterCount > 0
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black'
                  : 'bg-stone-900/50 text-gold-300 border border-gold-700/30 hover:border-gold-500/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-black/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-stone-900/50 rounded-2xl border border-gold-700/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Wine Type */}
                <div>
                  <label className="block text-gold-400 text-sm font-medium mb-2">Wine Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-800/80 border border-gold-700/30 text-gold-100 focus:outline-none focus:border-gold-500 transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="red">Red</option>
                    <option value="white">White</option>
                    <option value="rose">Rosé</option>
                    <option value="sparkling">Sparkling</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-gold-400 text-sm font-medium mb-2">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-800/80 border border-gold-700/30 text-gold-100 focus:outline-none focus:border-gold-500 transition-all"
                  >
                    {PRICE_RANGES.map((range, idx) => (
                      <option key={idx} value={idx}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div>
                  <label className="block text-gold-400 text-sm font-medium mb-2">Region</label>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-800/80 border border-gold-700/30 text-gold-100 focus:outline-none focus:border-gold-500 transition-all"
                  >
                    <option value="all">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Winery */}
                <div>
                  <label className="block text-gold-400 text-sm font-medium mb-2">Winery</label>
                  <select
                    value={wineryFilter}
                    onChange={(e) => setWineryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-800/80 border border-gold-700/30 text-gold-100 focus:outline-none focus:border-gold-500 transition-all"
                  >
                    <option value="all">All Wineries</option>
                    {wineries.map((winery) => (
                      <option key={winery} value={winery}>{winery}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gold-700/20 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Type Filters - Always visible */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['all', 'red', 'white', 'rose', 'sparkling', 'dessert'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                typeFilter === type
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-[0_0_20px_rgba(212,165,10,0.4)]'
                  : 'bg-stone-900/50 text-gold-300/80 border border-gold-700/30 hover:border-gold-500/50 hover:text-gold-200'
              }`}
            >
              {type === 'rose' ? 'Rosé' : type.charAt(0).toUpperCase() + type.slice(1)}
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
                href={`/wines/${wine.slug || wine.id}`}
                className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 overflow-hidden hover:border-gold-500/40 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all group"
              >
                <div className="aspect-[3/4] relative bg-stone-900">
                  <Image
                    src={wine.image_url || PLACEHOLDER_IMAGE}
                    alt={`Buy ${wine.name} online - ${wine.wine_type || 'fine'} wine from ${wine.region}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Save button */}
                  <div className="absolute top-2 right-2 z-10">
                    <SaveWineButton wineId={wine.id} size="sm" />
                  </div>
                </div>
                <div className="p-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                    (wine.wine_type || '').toLowerCase() === 'red' ? 'bg-red-900/50 text-red-300 border border-red-700/30' :
                    (wine.wine_type || '').toLowerCase() === 'white' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/30' :
                    (wine.wine_type || '').toLowerCase() === 'rose' ? 'bg-pink-900/50 text-pink-300 border border-pink-700/30' :
                    (wine.wine_type || '').toLowerCase() === 'sparkling' ? 'bg-amber-900/50 text-amber-300 border border-amber-700/30' :
                    (wine.wine_type || '').toLowerCase() === 'dessert' ? 'bg-orange-900/50 text-orange-300 border border-orange-700/30' :
                    'bg-purple-900/50 text-purple-300 border border-purple-700/30'
                  }`}>
                    {(wine.wine_type || 'Wine').charAt(0).toUpperCase() + (wine.wine_type || 'Wine').slice(1)}
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

        {/* Internal link back to home */}
        <div className="text-center mt-8">
          <p className="text-gold-400/60 text-sm">
            Need help choosing? <Link href="/" className="text-gold-400 hover:text-gold-300 underline">Buy wine online with our AI sommelier</Link> for personalized recommendations.
          </p>
        </div>
      </main>
    </div>
  )
}
