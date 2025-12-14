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
  price_range: string
  image_url: string
}

const priceMap: Record<string, string> = {
  budget: '£12.99',
  mid: '£24.99',
  premium: '£49.99',
  luxury: '£199.99',
}

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

  const filteredWines = filter === 'all'
    ? wines
    : wines.filter(w => w.wine_type === filter)

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍷</span>
              <span className="font-bold text-xl text-stone-900">Sommelier<span className="text-wine-600">AI</span></span>
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-stone-50 rounded-full transition-colors">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
          Wine Collection
        </h1>
        <p className="text-stone-500 mb-8">Curated wines recommended by Sommelier AI</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'red', 'white', 'rose', 'sparkling', 'dessert'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-wine-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-wine-300'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredWines.map((wine) => (
              <Link
                key={wine.id}
                href={`/wines/${wine.id}`}
                className="bg-white rounded-xl border border-stone-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-[3/4] relative bg-stone-50">
                  <Image
                    src={wine.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop'}
                    alt={wine.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
                    wine.wine_type === 'red' ? 'bg-red-100 text-red-800' :
                    wine.wine_type === 'white' ? 'bg-yellow-100 text-yellow-800' :
                    wine.wine_type === 'rose' ? 'bg-pink-100 text-pink-800' :
                    wine.wine_type === 'sparkling' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {wine.wine_type}
                  </span>
                  <h3 className="font-semibold text-stone-900 mb-1 line-clamp-2">{wine.name}</h3>
                  <p className="text-sm text-stone-500 mb-2">{wine.region}</p>
                  <p className="font-bold text-wine-600">{priceMap[wine.price_range] || '£19.99'}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
