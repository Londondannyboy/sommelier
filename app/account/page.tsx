'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface SavedWine {
  id: number
  name: string
  slug: string | null
  winery: string
  region: string
  wine_type: string
  price_retail: number | null
  image_url: string
  saved_at: string
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  total: {
    amount: string
    currency: string
  }
  fulfillmentStatus: string
  financialStatus: string
  items: Array<{
    title: string
    quantity: number
    price: string
  }>
}

interface SearchHistory {
  id: number
  query: string
  filters: Record<string, string>
  created_at: string
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const PLACEHOLDER_IMAGE = '/wine-placeholder.svg'

export default function AccountPage() {
  const user = useUser({ or: 'redirect' })
  const router = useRouter()
  const [savedWines, setSavedWines] = useState<SavedWine[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [searches, setSearches] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'saved' | 'orders' | 'searches'>('saved')

  useEffect(() => {
    async function fetchData() {
      try {
        const [savedRes, ordersRes, searchesRes] = await Promise.all([
          fetch('/api/saved-wines'),
          fetch('/api/orders'),
          fetch('/api/search-history'),
        ])

        if (savedRes.ok) {
          const data = await savedRes.json()
          setSavedWines(data.savedWines || [])
        }

        if (ordersRes.ok) {
          const data = await ordersRes.json()
          setOrders(data.orders || [])
        }

        if (searchesRes.ok) {
          const data = await searchesRes.json()
          setSearches(data.searches || [])
        }
      } catch (error) {
        console.error('Error fetching account data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRemoveSavedWine = async (wineId: number) => {
    try {
      const response = await fetch(`/api/saved-wines?wineId=${wineId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSavedWines((prev) => prev.filter((w) => w.id !== wineId))
      }
    } catch (error) {
      console.error('Error removing saved wine:', error)
    }
  }

  const handleClearSearchHistory = async () => {
    try {
      const response = await fetch('/api/search-history', {
        method: 'DELETE',
      })
      if (response.ok) {
        setSearches([])
      }
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }

  const handleSearchClick = (query: string) => {
    router.push(`/wines?search=${encodeURIComponent(query)}`)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,10,0.1)_0%,transparent_50%)]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pt-28">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-2xl border border-gold-700/20 p-8 mb-8">
          <div className="flex items-center gap-6">
            {user.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt={user.displayName || 'User'}
                width={80}
                height={80}
                className="rounded-full border-2 border-gold-500/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-2xl font-bold text-black">
                {(user.displayName?.[0] || user.primaryEmail?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gold-100">
                {user.displayName || 'Wine Enthusiast'}
              </h1>
              <p className="text-gold-400/60">{user.primaryEmail}</p>
            </div>
            <button
              onClick={() => user.signOut()}
              className="px-4 py-2 rounded-lg bg-stone-800/80 text-gold-300 border border-gold-700/30 hover:border-gold-500/50 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'saved', label: 'Saved Wines', count: savedWines.length },
            { id: 'orders', label: 'Orders', count: orders.length },
            { id: 'searches', label: 'Recent Searches', count: searches.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-[0_0_20px_rgba(212,165,10,0.3)]'
                  : 'bg-stone-900/50 text-gold-300/80 border border-gold-700/30 hover:border-gold-500/50'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-black/20' : 'bg-gold-900/30'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Saved Wines Tab */}
            {activeTab === 'saved' && (
              <div>
                {savedWines.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-2xl border border-gold-700/20">
                    <svg className="w-16 h-16 mx-auto text-gold-500/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h3 className="text-xl font-serif text-gold-200 mb-2">No saved wines yet</h3>
                    <p className="text-gold-400/60 mb-6">Start exploring our collection and save your favorites</p>
                    <Link
                      href="/wines"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all"
                    >
                      Browse Wines
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {savedWines.map((wine) => (
                      <div
                        key={wine.id}
                        className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 overflow-hidden group"
                      >
                        <Link href={`/wines/${wine.slug || wine.id}`}>
                          <div className="aspect-[3/4] relative bg-stone-900">
                            <Image
                              src={wine.image_url || PLACEHOLDER_IMAGE}
                              alt={wine.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <h3 className="font-semibold text-gold-100 mb-1 line-clamp-2">{wine.name}</h3>
                          <p className="text-sm text-gold-400/60 mb-2">{wine.region}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-gold-400">{formatPrice(wine.price_retail)}</p>
                            <button
                              onClick={() => handleRemoveSavedWine(wine.id)}
                              className="p-2 text-gold-400/50 hover:text-red-400 transition-colors"
                              title="Remove from saved"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-2xl border border-gold-700/20">
                    <svg className="w-16 h-16 mx-auto text-gold-500/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-xl font-serif text-gold-200 mb-2">No orders yet</h3>
                    <p className="text-gold-400/60 mb-6">Your order history will appear here after your first purchase</p>
                    <Link
                      href="/wines"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all"
                    >
                      Shop Wines
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gold-100">
                              Order {order.orderNumber}
                            </h3>
                            <p className="text-sm text-gold-400/60">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gold-400">
                              {order.total.currency === 'GBP' ? '£' : order.total.currency}
                              {parseFloat(order.total.amount).toLocaleString('en-GB', { minimumFractionDigits: 0 })}
                            </p>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.fulfillmentStatus === 'FULFILLED'
                                ? 'bg-green-900/50 text-green-300'
                                : order.fulfillmentStatus === 'UNFULFILLED'
                                ? 'bg-yellow-900/50 text-yellow-300'
                                : 'bg-stone-800 text-stone-300'
                            }`}>
                              {order.fulfillmentStatus.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gold-700/20 pt-4">
                          <p className="text-sm text-gold-400/60 mb-2">Items:</p>
                          <ul className="space-y-1">
                            {order.items.slice(0, 3).map((item, index) => (
                              <li key={index} className="text-gold-200 text-sm flex justify-between">
                                <span>{item.title} x{item.quantity}</span>
                                <span className="text-gold-400/60">£{parseFloat(item.price).toLocaleString('en-GB', { minimumFractionDigits: 0 })}</span>
                              </li>
                            ))}
                            {order.items.length > 3 && (
                              <li className="text-gold-400/60 text-sm">
                                +{order.items.length - 3} more items
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches Tab */}
            {activeTab === 'searches' && (
              <div>
                {searches.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-2xl border border-gold-700/20">
                    <svg className="w-16 h-16 mx-auto text-gold-500/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-serif text-gold-200 mb-2">No recent searches</h3>
                    <p className="text-gold-400/60 mb-6">Your search history will appear here</p>
                    <Link
                      href="/wines"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all"
                    >
                      Search Wines
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={handleClearSearchHistory}
                        className="text-sm text-gold-400/60 hover:text-gold-300 transition-colors"
                      >
                        Clear history
                      </button>
                    </div>
                    <div className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 divide-y divide-gold-700/20">
                      {searches.map((search) => (
                        <button
                          key={search.id}
                          onClick={() => handleSearchClick(search.query)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gold-900/10 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <svg className="w-5 h-5 text-gold-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-gold-200">{search.query}</span>
                          </div>
                          <span className="text-sm text-gold-400/40">
                            {formatDate(search.created_at)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
