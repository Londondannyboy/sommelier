'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'
// NOTE: System prompt should be configured in Hume dashboard for config ID 606a18be-4c8e-4877-8fb4-52665831b33d

interface Wine {
  id: number
  name: string
  winery: string
  region: string
  country: string
  wine_type: string
  price_retail: string | number
  image_url: string
  vintage?: number
  grape_variety?: string
}

function WineCard({ wine, onAddToCart }: { wine: Wine; onAddToCart: (wine: Wine) => void }) {
  const [added, setAdded] = useState(false)
  const price = typeof wine.price_retail === 'string' ? parseFloat(wine.price_retail) : wine.price_retail
  const displayPrice = price ? `£${price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : 'Price on request'

  const handleAdd = () => {
    onAddToCart(wine)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex gap-3 bg-white rounded-xl border border-stone-200 p-3 mt-2 max-w-sm">
      <Link href={`/wines/${wine.id}`} className="relative w-16 h-24 flex-shrink-0">
        <img
          src={wine.image_url || 'https://res.cloudinary.com/dc7btom12/image/upload/v1766073925/wines/wine-22-1952-ch-haut-brion.jpg'}
          alt={wine.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/wines/${wine.id}`} className="font-semibold text-stone-900 text-sm hover:text-wine-600 line-clamp-2">
          {wine.name}
        </Link>
        <p className="text-xs text-stone-500">{wine.winery} · {wine.country}</p>
        <p className="font-bold text-wine-600 text-sm mt-1">{displayPrice}</p>
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

// Tool definitions for Hume
const WINE_TOOLS = [
  {
    type: 'function' as const,
    name: 'search_wines',
    description: 'Search wines in our database by country, region, type, or price',
    parameters: '{ "type": "object", "properties": { "country": { "type": "string", "description": "Country like France, USA, Italy" }, "wine_type": { "type": "string", "description": "Type like red, white, sparkling" }, "max_price": { "type": "number", "description": "Maximum price in GBP" } } }',
    fallback_content: 'Unable to search wines at the moment.',
  },
  {
    type: 'function' as const,
    name: 'get_wine',
    description: 'Get full details for a specific wine by name',
    parameters: '{ "type": "object", "required": ["wine_name"], "properties": { "wine_name": { "type": "string", "description": "Wine name to search" } } }',
    fallback_content: 'Unable to get wine details at the moment.',
  },
  {
    type: 'function' as const,
    name: 'list_wines',
    description: 'List all wines in our database grouped by country',
    parameters: '{ "type": "object", "properties": {} }',
    fallback_content: 'Unable to list wines at the moment.',
  },
  {
    type: 'function' as const,
    name: 'recommend_wines',
    description: 'Get wine recommendations for investment, event, or fine dining',
    parameters: '{ "type": "object", "required": ["use_case"], "properties": { "use_case": { "type": "string", "description": "Use case: investment, event, fine_dining" } } }',
    fallback_content: 'Unable to get recommendations at the moment.',
  },
  {
    type: 'function' as const,
    name: 'add_to_cart',
    description: 'Add a wine to the shopping cart. Use when customer confirms they want to buy a specific wine.',
    parameters: '{ "type": "object", "required": ["wine_name"], "properties": { "wine_name": { "type": "string", "description": "Name of the wine to add" }, "wine_id": { "type": "number", "description": "Database ID of the wine" }, "quantity": { "type": "number", "description": "Number of bottles (default 1)" } } }',
    fallback_content: 'Unable to add to cart at the moment.',
  },
  {
    type: 'function' as const,
    name: 'get_cart',
    description: 'Get current shopping cart contents and total',
    parameters: '{ "type": "object", "properties": {} }',
    fallback_content: 'Unable to get cart at the moment.',
  },
  {
    type: 'function' as const,
    name: 'checkout',
    description: 'Initiate checkout when customer is ready to complete purchase',
    parameters: '{ "type": "object", "properties": {} }',
    fallback_content: 'Unable to checkout at the moment.',
  },
]

function VoiceInterface({ accessToken, userId }: { accessToken: string; userId?: string }) {
  const { connect, disconnect, status, messages, sendToolMessage } = useVoice()
  const [manualConnected, setManualConnected] = useState(false)
  const [waveHeights, setWaveHeights] = useState<number[]>([])
  const [wines, setWines] = useState<Wine[]>([])
  const [detectedWines, setDetectedWines] = useState<Map<number, Wine[]>>(new Map())
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)

  // Log status changes for debugging
  useEffect(() => {
    console.log('[Hume] Status changed:', status.value)
    if (status.value === 'connected') setManualConnected(true)
    if (status.value === 'disconnected') setManualConnected(false)
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

        // Load Shopify cart ID from localStorage
        const savedCartId = localStorage.getItem('sommelier-shopify-cart-id')
        if (savedCartId) {
          setShopifyCartId(savedCartId)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Handle Hume tool calls
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.type !== 'tool_call') return

    const handleToolCall = async (toolCall: any) => {
      const { name, toolCallId, parameters } = toolCall
      console.log('[Hume Tool] Received:', name, parameters)

      try {
        let response: Response
        let result: any

        switch (name) {
          case 'search_wines':
            response = await fetch('/api/hume-tools/search-wines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            break

          case 'get_wine':
            response = await fetch('/api/hume-tools/get-wine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            break

          case 'list_wines':
            response = await fetch('/api/hume-tools/list-wines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            })
            result = await response.json()
            break

          case 'recommend_wines':
            response = await fetch('/api/hume-tools/recommend', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            break

          case 'add_to_cart':
            response = await fetch('/api/hume-tools/add-to-cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...parameters,
                cart_id: shopifyCartId,
              }),
            })
            result = await response.json()
            // Update cart state if successful
            if (result.success && result.cart) {
              setShopifyCartId(result.cart.id)
              localStorage.setItem('sommelier-shopify-cart-id', result.cart.id)
              setCartCount(result.cart.total_items)
              if (result.cart.checkout_url) {
                setCheckoutUrl(result.cart.checkout_url)
              }
            }
            break

          case 'get_cart':
            response = await fetch('/api/hume-tools/get-cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cart_id: shopifyCartId }),
            })
            result = await response.json()
            if (result.success && result.cart) {
              setCartCount(result.cart.total_items)
            }
            break

          case 'checkout':
            response = await fetch('/api/hume-tools/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cart_id: shopifyCartId }),
            })
            result = await response.json()
            if (result.success && result.checkout?.url) {
              setCheckoutUrl(result.checkout.url)
            }
            break

          default:
            console.warn('[Hume Tool] Unknown tool:', name)
            sendToolMessage({
              type: 'tool_error',
              toolCallId: toolCallId,
              error: `Unknown tool: ${name}`,
              content: '',
            })
            return
        }

        console.log('[Hume Tool] Result:', result)
        sendToolMessage({
          type: 'tool_response',
          toolCallId: toolCallId,
          content: JSON.stringify(result),
        })
      } catch (error) {
        console.error('[Hume Tool] Error:', error)
        sendToolMessage({
          type: 'tool_error',
          toolCallId: toolCallId,
          error: 'Tool execution failed',
          content: '',
        })
      }
    }

    // Handle the tool call
    if (lastMessage.toolCallId && lastMessage.name) {
      handleToolCall(lastMessage)
    }
  }, [messages, sendToolMessage])

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
    // Extract first name from display name (e.g., "Dan Keegan" -> "Dan")
    const firstName = (userProfile?.displayName || 'Friend').split(' ')[0]

    // Build wine database summary for Hume
    const winesByCountry: Record<string, string[]> = {}
    wines.forEach(wine => {
      const country = wine.region?.split(',').pop()?.trim() || 'Other'
      if (!winesByCountry[country]) winesByCountry[country] = []
      winesByCountry[country].push(`${wine.name} (${wine.wine_type})`)
    })
    const wineSummary = Object.entries(winesByCountry)
      .map(([country, wineList]) => `${country}: ${wineList.join(', ')}`)
      .join('. ')

    const sessionSettings = {
      type: 'session_settings' as const,
      variables: {
        user_id: userId || '',
        userDisplayName: firstName,
        is_authenticated: userId ? 'true' : 'false',
        wineExperienceLevel: userProfile?.wineExperienceLevel || 'enthusiast',
        preferredWineTypes: userProfile?.preferredWineTypes || 'all styles',
        pricePreference: userProfile?.pricePreference || 'premium',
        isNewUser: userProfile?.isNewUser ? 'yes' : 'no',
        // Wine database context
        wine_count: wines.length.toString(),
        wine_countries: [...new Set(wines.map(w => w.region?.split(',').pop()?.trim()))].filter(Boolean).join(', '),
        wine_database_summary: wineSummary || 'Database loading...',
      }
    }

    console.log('[Hume] Connecting:', userProfile?.displayName, 'auth=', !!userId)
    console.log('[Hume] Variables:', sessionSettings.variables)
    console.log('[Hume] Tools:', WINE_TOOLS.map(t => t.name))

    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: '606a18be-4c8e-4877-8fb4-52665831b33d',
        sessionSettings: {
          ...sessionSettings,
          tools: WINE_TOOLS,
        }
      })
      console.log('[Hume] Connected!')
      setManualConnected(true)
    } catch (e: any) {
      console.error('[Hume] Connect error:', e?.message || e)
      setManualConnected(false)
    }
  }, [connect, accessToken, userId, userProfile, wines])

  const handleDisconnect = useCallback(() => {
    disconnect()
    setManualConnected(false)
    console.log('[Hume] Disconnected')
  }, [disconnect])

  const handleAddToCart = useCallback((wine: Wine) => {
    const existingCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
    const existingIndex = existingCart.findIndex((item: { id: number }) => item.id === wine.id)
    const price = typeof wine.price_retail === 'string' ? parseFloat(wine.price_retail) : wine.price_retail

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity += 1
    } else {
      existingCart.push({
        id: wine.id,
        name: wine.name,
        winery: wine.winery,
        price: price || 0,
        quantity: 1,
        image_url: wine.image_url,
      })
    }

    localStorage.setItem('sommelier-cart', JSON.stringify(existingCart))
  }, [])

  // Use both Hume status AND manual tracking (status doesn't always update)
  const isConnected = status.value === 'connected' || manualConnected
  const isConnecting = status.value === 'connecting' && !manualConnected
  const isError = status.value === 'error'

  return (
    <div className="flex flex-col items-center">
      {/* Title with consistent serif font */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-wine-700 tracking-tight mb-2">
          Aionysus
        </h1>
        <p className="text-lg md:text-xl text-stone-600 font-light">
          The <span className="text-wine-600 font-medium">AI</span> Goddess of Wine
        </p>
      </div>

      {/* Aionysus Image with Play Button Centered Inside */}
      <div className="relative mb-6">
        {/* Pulsating glow - only when NOT connected */}
        {!isConnected && !isConnecting && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-[pulse-glow_2s_ease-in-out_infinite]"
              style={{
                background: 'radial-gradient(circle, rgba(127,29,29,0.6) 0%, rgba(127,29,29,0) 70%)',
                transform: 'scale(1.15)',
                filter: 'blur(8px)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-[ping_2s_ease-in-out_infinite]"
              style={{
                border: '3px solid rgba(127,29,29,0.5)',
                transform: 'scale(1.05)',
              }}
            />
          </>
        )}

        {/* Rotating shine border - when connected */}
        {isConnected && (
          <div
            className="absolute inset-0 rounded-full animate-[rotate-shine_3s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(127,29,29,0.8) 60deg, rgba(127,29,29,1) 120deg, rgba(127,29,29,0.8) 180deg, transparent 240deg, transparent 360deg)',
              transform: 'scale(1.08)',
              filter: 'blur(3px)',
            }}
          />
        )}

        {/* Clickable container with image and centered play button */}
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className="relative z-10 group"
          aria-label={isConnected ? "Stop conversation with Aionysus" : "Start conversation with Aionysus"}
        >
          <img
            src="/aionysus.jpg"
            alt="Aionysus"
            className={`w-44 h-44 md:w-56 md:h-56 rounded-full object-cover border-4 cursor-pointer ${
              isConnected
                ? 'border-wine-600 shadow-[0_0_25px_rgba(127,29,29,0.7)]'
                : isConnecting
                ? 'border-wine-400 opacity-70 cursor-wait'
                : 'border-wine-600 shadow-[0_0_20px_rgba(127,29,29,0.5)] group-hover:shadow-[0_0_40px_rgba(127,29,29,0.8)]'
            } transition-all duration-300`}
          />
          {/* Centered Play/Stop Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                isConnected
                  ? 'bg-wine-600/90 group-hover:bg-wine-700/95'
                  : isConnecting
                  ? 'bg-wine-400/80'
                  : 'bg-wine-600/85 group-hover:bg-wine-600/95 group-hover:scale-110'
              } shadow-lg backdrop-blur-sm`}
            >
              {isConnecting ? (
                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : isConnected ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Waveform Animation - Centered Below */}
      <div className="flex items-center justify-center gap-[2px] h-12 w-64 mb-4">
        {waveHeights.map((height, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-100 ${
              isConnected ? 'bg-wine-500' : 'bg-wine-300'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Wine Proverb */}
      <p className="text-wine-600 text-sm italic mb-2">
        "Where there is no wine, there is no love"
      </p>

      {/* Status Text */}
      <p className="text-wine-700 text-lg font-bold mb-4">
        {isConnecting
          ? "Connecting to Aionysus..."
          : isConnected
          ? "Aionysus is listening — describe your needs."
          : isError
          ? "Connection error — tap to try again."
          : "Tap to speak with Aionysus"}
      </p>

      {/* Version & Info Panel */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-wine-50 rounded-full">
          <span className="text-wine-700 text-xs font-semibold">v0.1</span>
          <span className="text-wine-400">•</span>
          <span className="text-wine-600 text-xs">Bordeaux Collection: 40 SKUs</span>
        </div>
        <p className="text-wine-600/70 text-xs max-w-sm">
          Beta: Currently featuring investment-grade Red Bordeaux only. Personal data is not retained.
        </p>
        <p className="text-wine-500/60 text-xs">
          <a href="mailto:hello@aionysus.wine" className="hover:text-wine-700 transition-colors">
            hello@aionysus.wine
          </a>
        </p>
      </div>

      {/* Featured Wine - Show when connected */}
      {isConnected && (
        <div className="w-full max-w-md mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-wine-600 text-xs font-medium text-center mb-3">Featured from our collection</p>
          <div className="bg-white rounded-2xl border border-wine-100 shadow-lg overflow-hidden">
            <div className="flex gap-4 p-4">
              <div className="relative w-24 h-32 flex-shrink-0">
                <img
                  src="https://res.cloudinary.com/dc7btom12/image/upload/v1766073925/wines/wine-22-1952-ch-haut-brion.jpg"
                  alt="1952 Château Haut-Brion"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-stone-900 text-sm leading-tight mb-1">
                  1952 Château Haut-Brion
                </h3>
                <p className="text-xs text-wine-600 font-medium mb-1">1er Cru • Pessac-Léognan</p>
                <p className="text-xs text-stone-500 mb-2">Cabernet Sauvignon, Merlot, Cabernet Franc</p>
                <p className="font-bold text-wine-700 text-lg">£723.46</p>
                <p className="text-xs text-stone-400 mt-1">First Growth • 70+ years old</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Checkout button when checkout URL is available */}
      {checkoutUrl && cartCount > 0 && (
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-50 flex items-center gap-2 animate-bounce"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Checkout ({cartCount})
        </a>
      )}

      {/* Cart link */}
      <Link
        href="/cart"
        className="fixed bottom-6 right-6 bg-wine-600 text-white p-4 rounded-full shadow-lg hover:bg-wine-700 transition-colors z-50"
        aria-label="View shopping cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
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
