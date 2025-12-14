'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Wine {
  id: number
  name: string
  winery: string
  region: string
  country: string
  grape_variety: string
  vintage: number | null
  wine_type: string
  style: string
  price_range: string
  tasting_notes: string
  food_pairings: string[]
  image_url: string
}

const priceMap: Record<string, { price: number; display: string }> = {
  budget: { price: 12.99, display: '£12.99' },
  mid: { price: 24.99, display: '£24.99' },
  premium: { price: 49.99, display: '£49.99' },
  luxury: { price: 199.99, display: '£199.99' },
}

export default function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [wine, setWine] = useState<Wine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return
    const wineId = resolvedParams.id

    async function fetchWine() {
      try {
        const response = await fetch(`/api/wines/${wineId}`)
        if (response.ok) {
          const data = await response.json()
          setWine(data)
        }
      } catch (error) {
        console.error('Error fetching wine:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWine()
  }, [resolvedParams])

  const handleAddToCart = () => {
    if (!wine) return

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
        winery: wine.winery,
        price: priceMap[wine.price_range]?.price || 19.99,
        quantity,
        image_url: wine.image_url,
      })
    }

    localStorage.setItem('sommelier-cart', JSON.stringify(existingCart))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!wine) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center">
        <p className="text-stone-500 mb-4">Wine not found</p>
        <Link href="/" className="text-wine-600 hover:underline">Back to home</Link>
      </div>
    )
  }

  const pricing = priceMap[wine.price_range] || { price: 19.99, display: '£19.99' }

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

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm text-stone-500">
          <Link href="/" className="hover:text-wine-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/wines" className="hover:text-wine-600">Wines</Link>
          <span className="mx-2">/</span>
          <span className="text-stone-900">{wine.name}</span>
        </nav>
      </div>

      {/* Wine Detail */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Wine Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center border border-stone-100">
            <div className="relative w-48 h-72">
              <Image
                src={wine.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop'}
                alt={wine.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Wine Info */}
          <div>
            <div className="mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                wine.wine_type === 'red' ? 'bg-red-100 text-red-800' :
                wine.wine_type === 'white' ? 'bg-yellow-100 text-yellow-800' :
                wine.wine_type === 'rose' ? 'bg-pink-100 text-pink-800' :
                wine.wine_type === 'sparkling' ? 'bg-amber-100 text-amber-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {wine.wine_type.charAt(0).toUpperCase() + wine.wine_type.slice(1)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
              {wine.name}
            </h1>

            <p className="text-lg text-stone-500 mb-4">
              {wine.winery} · {wine.region}, {wine.country}
            </p>

            {wine.vintage && (
              <p className="text-stone-600 mb-4">Vintage: {wine.vintage}</p>
            )}

            <p className="text-3xl font-bold text-wine-600 mb-6">
              {pricing.display}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-stone-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-wine-600 text-white hover:bg-wine-700'
                }`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Tasting Notes */}
            <div className="bg-white rounded-xl p-6 border border-stone-100 mb-6">
              <h2 className="font-bold text-stone-900 mb-3">Tasting Notes</h2>
              <p className="text-stone-600 leading-relaxed">{wine.tasting_notes}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 border border-stone-100 mb-6">
              <h2 className="font-bold text-stone-900 mb-3">Details</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-stone-500">Grape Variety</dt>
                  <dd className="text-stone-900 font-medium">{wine.grape_variety}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Style</dt>
                  <dd className="text-stone-900 font-medium">{wine.style}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Region</dt>
                  <dd className="text-stone-900 font-medium">{wine.region}</dd>
                </div>
                <div>
                  <dt className="text-stone-500">Country</dt>
                  <dd className="text-stone-900 font-medium">{wine.country}</dd>
                </div>
              </dl>
            </div>

            {/* Food Pairings */}
            {wine.food_pairings && wine.food_pairings.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-stone-100">
                <h2 className="font-bold text-stone-900 mb-3">Food Pairings</h2>
                <div className="flex flex-wrap gap-2">
                  {wine.food_pairings.map((pairing, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
                    >
                      {pairing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
