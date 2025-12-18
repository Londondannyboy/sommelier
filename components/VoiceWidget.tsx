'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { useUser } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
// NOTE: System prompt should be configured in Hume dashboard for config ID 606a18be-4c8e-4877-8fb4-52665831b33d

interface Wine {
  id: number
  name: string
  winery: string
  region: string
  wine_type: string
  price_range: string
  image_url: string
}

const priceMap: Record<string, { price: number; display: string }> = {
  budget: { price: 12.99, display: '£12.99' },
  mid: { price: 24.99, display: '£24.99' },
  premium: { price: 49.99, display: '£49.99' },
  luxury: { price: 199.99, display: '£199.99' },
}

function WineCard({ wine, onAddToCart }: { wine: Wine; onAddToCart: (wine: Wine) => void }) {
  const [added, setAdded] = useState(false)
  const pricing = priceMap[wine.price_range] || { price: 19.99, display: '£19.99' }

  const handleAdd = () => {
    onAddToCart(wine)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex gap-3 bg-white rounded-xl border border-stone-200 p-3 mt-2 max-w-sm">
      <Link href={`/wines/${wine.id}`} className="relative w-16 h-24 flex-shrink-0">
        <Image
          src={wine.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop'}
          alt={wine.name}
          fill
          className="object-cover rounded-lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/wines/${wine.id}`} className="font-semibold text-stone-900 text-sm hover:text-wine-600 line-clamp-2">
          {wine.name}
        </Link>
        <p className="text-xs text-stone-500">{wine.region}</p>
        <p className="font-bold text-wine-600 text-sm mt-1">{pricing.display}</p>
        <button
          onClick={handleAdd}
          className={`mt-2 px-3 py-1 text-xs font-medium rounded-full transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-wine-600 text-white hover:bg-wine-700'
          }`}
        >
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

interface UserProfile {
  displayName: string
  email?: string
  wineExperienceLevel: string
  preferredWineTypes: string
  pricePreference: string
  isNewUser: boolean
}

function VoiceInterface({ accessToken, userId }: { accessToken: string; userId?: string }) {
  const { connect, disconnect, status, messages } = useVoice()
  const [waveHeights, setWaveHeights] = useState<number[]>([])
  const [wines, setWines] = useState<Wine[]>([])
  const [detectedWines, setDetectedWines] = useState<Map<number, Wine[]>>(new Map())
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Log status changes for debugging
  useEffect(() => {
    console.log('[Hume] Status changed:', status.value)
  }, [status.value])

  // Fetch wines and user profile on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch wines
        const winesResponse = await fetch('/api/wines')
        if (winesResponse.ok) {
          const winesData = await winesResponse.json()
          setWines(winesData)
        }

        // Fetch user profile for personalization
        const profileResponse = await fetch('/api/user-profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setUserProfile(profileData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Detect wines in messages
  useEffect(() => {
    if (wines.length === 0) return

    const newDetected = new Map<number, Wine[]>()

    messages.forEach((msg, index) => {
      if (msg.type === 'assistant_message' && msg.message?.content) {
        const content = msg.message.content.toLowerCase()
        const foundWines: Wine[] = []

        wines.forEach(wine => {
          // Check for wine name in message
          const wineName = wine.name.toLowerCase()
          if (content.includes(wineName) ||
              content.includes(wine.winery?.toLowerCase() || '') ||
              // Check for partial matches
              wineName.split(' ').some(word => word.length > 4 && content.includes(word))) {
            if (!foundWines.find(w => w.id === wine.id)) {
              foundWines.push(wine)
            }
          }
        })

        if (foundWines.length > 0) {
          newDetected.set(index, foundWines)
        }
      }
    })

    setDetectedWines(newDetected)
  }, [messages, wines])

  useEffect(() => {
    if (status.value === 'connected') {
      const interval = setInterval(() => {
        setWaveHeights([...Array(40)].map(() => 20 + Math.random() * 80))
      }, 150)
      return () => clearInterval(interval)
    } else {
      setWaveHeights([...Array(40)].map((_, i) => 20 + Math.sin(i * 0.5) * 15))
    }
  }, [status.value])

  const handleConnect = useCallback(async () => {
    if (!accessToken) {
      console.error('No access token available')
      return
    }

    // Session settings with variables only - NO systemPrompt (let Hume config handle it)
    const sessionSettings = {
      type: 'session_settings' as const,
      variables: {
        user_id: userId || '',
        userDisplayName: userProfile?.displayName || 'Friend',
        is_authenticated: userId ? 'true' : 'false',
        wineExperienceLevel: userProfile?.wineExperienceLevel || 'enthusiast',
        preferredWineTypes: userProfile?.preferredWineTypes || 'all styles',
        pricePreference: userProfile?.pricePreference || 'premium',
        isNewUser: userProfile?.isNewUser ? 'yes' : 'no',
      }
    }

    console.log('[Hume] Connecting:', userProfile?.displayName, 'auth=', !!userId)
    console.log('[Hume] Variables:', sessionSettings.variables)

    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: '606a18be-4c8e-4877-8fb4-52665831b33d',
        sessionSettings
      })
      console.log('[Hume] Connected!')
    } catch (e: any) {
      console.error('[Hume] Connect error:', e?.message || e)
    }
  }, [connect, accessToken, userId, userProfile])

  const handleDisconnect = useCallback(() => {
    disconnect()
    console.log('[Hume] Disconnected')
  }, [disconnect])

  const handleAddToCart = useCallback((wine: Wine) => {
    const existingCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
    const existingIndex = existingCart.findIndex((item: { id: number }) => item.id === wine.id)
    const pricing = priceMap[wine.price_range] || { price: 19.99 }

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push({
        id: wine.id,
        name: wine.name,
        winery: wine.winery,
        price: pricing.price,
        quantity: 1,
        image_url: wine.image_url,
      })
    }

    localStorage.setItem('sommelier-cart', JSON.stringify(existingCart))
  }, [])

  // Match fractional.quest exactly - trust Hume status
  const isConnected = status.value === 'connected'
  const isConnecting = status.value === 'connecting'
  const isError = status.value === 'error'

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight mb-2">
          Meet Dionysus
        </h1>
        <p className="text-lg md:text-xl text-stone-600 font-light">
          The Goddess of Wine and part-time Sommelier side-hustler
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isConnected
              ? 'bg-wine-600 hover:bg-wine-700 animate-pulse'
              : isConnecting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-stone-900 hover:bg-stone-800'
          } shadow-xl hover:shadow-2xl`}
          aria-label={isConnected ? "Stop conversation with Dionysus" : "Start conversation with Dionysus"}
        >
          {isConnecting ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isConnected ? (
            // Wine bottle stop icon
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 2h6v1h2V2h-2v1h-6V2zm-1 3h8v2h1V5h-1v2h-8V5h-1v2h1V5zm0 4h8v7H8v-7zm0 8h8v2H8v-2zm1 3h6v1H9v-1z" />
            </svg>
          ) : (
            // Wine bottle play icon
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 2h6v1h2V2h-2v1h-6V2zm-1 3h8v2h1V5h-1v2h-8V5h-1v2h1V5zm0 4h8v7H8v-7zm0 8h8v2H8v-2zm1 3h6v1H9v-1z" opacity="0.7" />
              <path d="M12 8l-4 3v2l4 3 4-3v-2l-4-3z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-[2px] h-12 w-64">
          {waveHeights.map((height, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-all duration-100 ${
                isConnected ? 'bg-wine-400' : 'bg-stone-300'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      <p className="text-stone-500 text-lg mb-8">
        {isConnecting
          ? "Connecting to Dionysus..."
          : isConnected
          ? "Dionysus is listening — describe your needs."
          : isError
          ? "Connection error — tap to try again."
          : "Want wine advice? Hit play — Dionysus will help."}
      </p>

      {messages.length > 0 && (
        <div className="w-full max-w-2xl bg-stone-50 rounded-2xl p-6 max-h-[500px] overflow-y-auto mb-8">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`flex ${msg.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.type === 'user_message'
                        ? 'bg-wine-600 text-white'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {msg.type === 'user_message' && msg.message?.content}
                      {msg.type === 'assistant_message' && msg.message?.content}
                    </p>
                  </div>
                </div>

                {/* Wine cards for detected wines */}
                {detectedWines.get(index)?.map(wine => (
                  <div key={wine.id} className="flex justify-start mt-2">
                    <WineCard wine={wine} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart link when items are in cart */}
      <Link
        href="/cart"
        className="fixed bottom-6 right-6 bg-wine-600 text-white p-4 rounded-full shadow-lg hover:bg-wine-700 transition-colors z-50"
        aria-label="View shopping cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </Link>
    </div>
  )
}

export function VoiceWidget() {
  const user = useUser()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getAccessToken() {
      try {
        const response = await fetch('/api/hume-token')
        if (!response.ok) throw new Error('Failed to get access token')
        const data = await response.json()
        setAccessToken(data.accessToken)
      } catch (err) {
        setError('Voice service unavailable. Please try again later.')
        console.error('Error getting Hume token:', err)
      }
    }
    getAccessToken()
  }, [])

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">{error}</p>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-500">Loading SommelierQuest...</p>
      </div>
    )
  }

  return (
    <VoiceProvider
      onError={(err) => console.error('[Hume Error]', err)}
      onClose={(e) => console.warn('[Hume Close]', e?.code, e?.reason)}
    >
      <VoiceInterface accessToken={accessToken} userId={user?.id} />
    </VoiceProvider>
  )
}
