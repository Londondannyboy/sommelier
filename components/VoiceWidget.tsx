'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import animation components to avoid SSR issues
const SplineGoddess = dynamic(() => import('./SplineGoddess'), { ssr: false })
const LottieGoddess = dynamic(() => import('./LottieGoddess'), { ssr: false })

// Animation mode type
type AnimationMode = 'image' | 'spline' | 'lottie'
// NOTE: System prompt should be configured in Hume dashboard for config ID 606a18be-4c8e-4877-8fb4-52665831b33d

interface Wine {
  id: number
  name: string
  slug?: string
  winery: string
  region: string
  country: string
  wine_type: string
  price_retail: string | number
  image_url: string
  vintage?: number
  grape_variety?: string
}

// Inline wine card shown within conversation
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
      <Link href={`/wines/${wine.slug || wine.id}`} className="relative w-16 h-24 flex-shrink-0">
        <img
          src={wine.image_url || '/wine-placeholder.svg'}
          alt={wine.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/wines/${wine.slug || wine.id}`} className="font-semibold text-stone-900 text-sm hover:text-gold-600 line-clamp-2">
          {wine.name}
        </Link>
        <p className="text-xs text-stone-500">{wine.winery} · {wine.country}</p>
        <p className="font-bold text-gold-600 text-sm mt-1">{displayPrice}</p>
        <button
          onClick={handleAdd}
          className={`mt-2 px-3 py-1 text-xs font-medium rounded-full transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-gold-600 text-black hover:bg-gold-500'
          }`}
        >
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

// Compact wine card for the history strip
function WineHistoryCard({ wine, onAddToCart }: { wine: Wine; onAddToCart: (wine: Wine) => void }) {
  const [added, setAdded] = useState(false)
  const price = typeof wine.price_retail === 'string' ? parseFloat(wine.price_retail) : wine.price_retail
  const displayPrice = price ? `£${price.toLocaleString('en-GB', { minimumFractionDigits: 0 })}` : 'POA'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(wine)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link
      href={`/wines/${wine.slug || wine.id}`}
      className="flex-shrink-0 w-32 bg-gradient-to-b from-stone-900 to-stone-950 rounded-lg border border-gold-700/30 overflow-hidden hover:border-gold-500/50 transition-all group"
    >
      <div className="aspect-[3/4] relative">
        <img
          src={wine.image_url || '/wine-placeholder.svg'}
          alt={wine.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="p-2">
        <p className="text-white text-xs font-medium line-clamp-2 leading-tight mb-1">{wine.name}</p>
        <p className="text-gold-400 text-xs font-bold">{displayPrice}</p>
        <button
          onClick={handleAdd}
          className={`mt-1.5 w-full px-2 py-1 text-[10px] font-bold rounded transition-all ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-gold-500 text-black hover:bg-gold-400'
          }`}
        >
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </Link>
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
  const { connect, disconnect, status, messages, sendToolMessage, isPlaying } = useVoice()
  const [manualConnected, setManualConnected] = useState(false)
  const [waveHeights, setWaveHeights] = useState<number[]>([])
  const [animationMode, setAnimationMode] = useState<AnimationMode>('image')
  const [wines, setWines] = useState<Wine[]>([])
  const [discussedWines, setDiscussedWines] = useState<Wine[]>([])
  const [localCart, setLocalCart] = useState<Array<{ id: number; name: string; winery: string; price: number; quantity: number; image_url: string }>>([])
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

  // Sync local cart from localStorage
  useEffect(() => {
    function syncCart() {
      try {
        const cart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
        setLocalCart(cart)
      } catch {
        setLocalCart([])
      }
    }
    syncCart()
    window.addEventListener('storage', syncCart)
    window.addEventListener('cart-updated', syncCart)
    return () => {
      window.removeEventListener('storage', syncCart)
      window.removeEventListener('cart-updated', syncCart)
    }
  }, [])

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
            // Capture wines from search results
            if (result.wines && Array.isArray(result.wines)) {
              const newWines = result.wines.filter((w: Wine) =>
                !discussedWines.find(dw => dw.id === w.id)
              )
              if (newWines.length > 0) {
                setDiscussedWines(prev => [...prev, ...newWines.slice(0, 3)])
              }
            }
            break

          case 'get_wine':
            response = await fetch('/api/hume-tools/get-wine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            // Capture the wine from get_wine result
            if (result.wine && !discussedWines.find(w => w.id === result.wine.id)) {
              setDiscussedWines(prev => [...prev, result.wine])
            }
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
            // Capture wines from recommendations
            if (result.wines && Array.isArray(result.wines)) {
              const newWines = result.wines.filter((w: Wine) =>
                !discussedWines.find(dw => dw.id === w.id)
              )
              if (newWines.length > 0) {
                setDiscussedWines(prev => [...prev, ...newWines.slice(0, 3)])
              }
            }
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

  // Clear discussed wines when session ends
  useEffect(() => {
    if (status.value === 'disconnected' && discussedWines.length > 0) {
      // Keep wines for reference but could clear here if desired
    }
  }, [status.value])

  // Clear discussed wines handler
  const handleClearDiscussed = useCallback(() => {
    setDiscussedWines([])
  }, [])

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
        // Wine database context (summary only - full list available via tools)
        wine_count: wines.length.toString(),
        wine_regions: 'Bordeaux, Champagne, and other fine wine regions',
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
    setLocalCart(existingCart)
    window.dispatchEvent(new Event('cart-updated'))
  }, [])

  // Use both Hume status AND manual tracking (status doesn't always update)
  const isConnected = status.value === 'connected' || manualConnected
  const isConnecting = status.value === 'connecting' && !manualConnected
  const isError = status.value === 'error'

  return (
    <div className="flex flex-col items-center">
      {/* Large Goddess Image - THE Main Tap Target */}
      <div className="relative mb-8">
        {/* Champagne fizz bubbles rising around the goddess */}
        <div className="goddess-fizz">
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
        </div>

        {/* Golden divine glow - pulsating when idle */}
        {!isConnected && !isConnecting && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-[divine-pulse_3s_ease-in-out_infinite]"
              style={{
                background: 'radial-gradient(circle, rgba(212,165,10,0.5) 0%, rgba(212,165,10,0) 70%)',
                transform: 'scale(1.25)',
                filter: 'blur(20px)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full animate-[ping_3s_ease-in-out_infinite]"
              style={{
                border: '2px solid rgba(212,165,10,0.4)',
                transform: 'scale(1.1)',
              }}
            />
          </>
        )}

        {/* Active golden aura - when connected, more fizzy */}
        {isConnected && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-[rotate-shine_4s_linear_infinite]"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(212,165,10,0.6) 60deg, rgba(245,197,24,0.9) 120deg, rgba(212,165,10,0.6) 180deg, transparent 240deg, transparent 360deg)',
                transform: 'scale(1.15)',
                filter: 'blur(4px)',
              }}
            />
            {/* Extra fizz when active */}
            <div className="goddess-fizz">
              <div className="fizz-bubble"></div>
              <div className="fizz-bubble"></div>
              <div className="fizz-bubble"></div>
              <div className="fizz-bubble"></div>
              <div className="fizz-bubble"></div>
              <div className="fizz-bubble"></div>
            </div>
          </>
        )}

        {/* Animation Mode Toggle - Dev Tool */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 bg-black/80 rounded-full p-1 z-20">
          {(['image', 'spline', 'lottie'] as AnimationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAnimationMode(mode)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                animationMode === mode
                  ? 'bg-gold-500 text-black'
                  : 'text-gold-400 hover:text-gold-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* The Goddess - clickable with gold background inside circle */}
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className="relative z-10 group focus:outline-none"
          aria-label={isConnected ? "End session with the Goddess" : "Tap to commune with Aionysus"}
        >
          {/* Circular container that clips the square icon */}
          <div className={`relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden ${
            isConnected
              ? 'shadow-[0_0_60px_rgba(212,165,10,0.9)]'
              : 'shadow-[0_0_40px_rgba(212,165,10,0.5)] group-hover:shadow-[0_0_70px_rgba(212,165,10,0.8)]'
          } transition-all duration-300`}
            style={{
              border: '3px solid rgba(212,165,10,0.8)',
            }}
          >
            {/* MODE: Original Image */}
            {animationMode === 'image' && (
              <>
                {/* Icon scaled up to fill the circle (square corners get clipped) */}
                <div className={`absolute inset-[-15%] w-[130%] h-[130%] flex items-center justify-center ${
                  isPlaying ? 'animate-[speaking-breathe_2s_ease-in-out_infinite]' : ''
                }`}>
                  <img
                    src="/aionysus-classic-icon.png"
                    alt="Aionysus - Goddess of Wine"
                    className={`w-full h-full object-cover cursor-pointer ${
                      isConnected
                        ? isPlaying
                          ? 'scale-105 brightness-110'
                          : 'scale-105'
                        : isConnecting
                        ? 'opacity-80 cursor-wait'
                        : 'group-hover:scale-[1.02]'
                    } transition-all duration-300`}
                  />
                </div>

                {/* Speaking glow effect */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full animate-[speaking-glow_1.5s_ease-in-out_infinite] pointer-events-none" />
                )}

                {/* Expanding rings when speaking */}
                {isPlaying && (
                  <>
                    <div
                      className="absolute inset-0 rounded-full border-2 border-gold-400/60 pointer-events-none"
                      style={{ animation: 'speaking-ring 2s ease-out infinite' }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-gold-400/40 pointer-events-none"
                      style={{ animation: 'speaking-ring 2s ease-out infinite 0.5s' }}
                    />
                    <div
                      className="absolute inset-0 rounded-full border border-gold-400/20 pointer-events-none"
                      style={{ animation: 'speaking-ring 2s ease-out infinite 1s' }}
                    />
                  </>
                )}
              </>
            )}

            {/* MODE: Spline 3D */}
            {animationMode === 'spline' && (
              <div className="absolute inset-0">
                <SplineGoddess
                  isPlaying={isPlaying}
                  sceneUrl="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                />
              </div>
            )}

            {/* MODE: Lottie Animation */}
            {animationMode === 'lottie' && (
              <div className="absolute inset-0">
                <LottieGoddess
                  isPlaying={isPlaying}
                  animationPath="/animations/goddess.json"
                />
              </div>
            )}
          </div>

          {/* Subtle connecting spinner overlay */}
          {isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>

      {/* Secondary Play/Stop Button - below the image */}
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className={`mb-4 px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
          isConnected
            ? 'bg-gold-600 text-black hover:bg-gold-500'
            : isConnecting
            ? 'bg-gold-400/50 text-gold-800 cursor-wait'
            : 'bg-gold-500 text-black hover:bg-gold-400 hover:shadow-[0_0_20px_rgba(212,165,10,0.5)]'
        }`}
      >
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-gold-800 border-t-transparent rounded-full animate-spin" />
            Summoning...
          </>
        ) : isConnected ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            End Session
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Commune with the Goddess
          </>
        )}
      </button>

      {/* Waveform Animation - Centered Below */}
      <div className="flex items-center justify-center gap-[2px] h-12 w-64 mb-4">
        {waveHeights.map((height, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-100 ${
              isPlaying
                ? 'bg-gold-400 shadow-[0_0_8px_rgba(212,165,10,0.6)]'
                : isConnected
                ? 'bg-gold-500'
                : 'bg-gold-300'
            }`}
            style={{
              height: `${isPlaying ? Math.min(height * 1.3, 100) : height}%`,
              transition: isPlaying ? 'all 0.05s ease-out' : 'all 0.1s ease-out'
            }}
          />
        ))}
      </div>

      {/* Status Text - Compact when connected */}
      <p className={`text-lg md:text-xl font-medium mb-4 text-center transition-all ${
        isPlaying ? 'text-gold-300' : 'text-gold-500'
      }`}>
        {isConnecting
          ? "Summoning the Goddess..."
          : isPlaying
          ? "The Goddess speaks..."
          : isConnected
          ? "She awaits your words..."
          : isError
          ? "The connection fades — tap to try again"
          : "Tap to commune with Aionysus"}
      </p>

      {/* SHOPPING DASHBOARD - Appears when connected, ABOVE the info panel */}
      {isConnected && (
        <div className="w-full max-w-2xl mb-6 space-y-4">
          {/* Latest Wine Recommended */}
          {discussedWines.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-gold-400 text-xs font-medium text-center mb-3">The Goddess Recommends</p>
              <WineCard wine={discussedWines[discussedWines.length - 1]} onAddToCart={handleAddToCart} />
            </div>
          )}
        </div>
      )}

      {/* Wine Proverb - Only show when not connected */}
      {!isConnected && (
        <p className="text-gold-500 text-sm italic mb-4">
          "Where there is no wine, there is no love"
        </p>
      )}

      {/* Version & Info Panel - Compact when connected */}
      {!isConnected && (
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-900/20 rounded-full border border-gold-700/30">
            <span className="text-gold-400 text-sm font-semibold">BETA</span>
            <span className="text-gold-600">•</span>
            <span className="text-gold-300 text-sm">3,800+ Wines</span>
            <span className="text-gold-600">•</span>
            <span className="text-gold-300 text-sm">All Types</span>
          </div>
          <p className="text-gold-400/60 text-sm max-w-md">
            Red, White, Rosé, Sparkling & Dessert wines from Bordeaux, Champagne, and fine wine regions worldwide.
          </p>
        </div>
      )}

      {/* Your Cart Dashboard - Voice Shopping Results */}
      {localCart.length > 0 && (
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-gradient-to-b from-stone-900/90 to-stone-950/95 rounded-2xl border border-gold-700/30 overflow-hidden">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gold-700/20">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-gold-300 font-semibold">Your Selection</h3>
              </div>
              <span className="text-gold-500 text-sm">
                {localCart.reduce((sum, item) => sum + item.quantity, 0)} bottle{localCart.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gold-700/20">
              {localCart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                  <img
                    src={item.image_url || '/wine-placeholder.svg'}
                    alt={item.name}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-stone-400 text-xs">{item.winery}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 font-bold">£{item.price.toLocaleString()}</p>
                    <p className="text-stone-500 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="px-5 py-4 bg-gold-900/20 border-t border-gold-700/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gold-300 font-medium">Total</span>
                <span className="text-gold-400 font-bold text-xl">
                  £{localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </span>
              </div>
              <Link
                href="/cart"
                className="block w-full text-center bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold py-3 rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all shadow-[0_0_20px_rgba(212,165,10,0.3)]"
              >
                View Cart & Checkout
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Wines Mentioned (smaller, below cart) */}
      {discussedWines.length > 1 && (
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gold-500/60 text-xs font-medium">Also Discussed</p>
            <button
              onClick={handleClearDiscussed}
              className="text-gold-500/40 hover:text-gold-400 text-xs flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {discussedWines.slice(0, -1).map((wine) => (
                <WineHistoryCard key={wine.id} wine={wine} onAddToCart={handleAddToCart} />
              ))}
            </div>
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
        className="fixed bottom-6 right-6 bg-gold-600 text-white p-4 rounded-full shadow-lg hover:bg-gold-700 transition-colors z-50"
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
        <div className="w-10 h-10 border-2 border-stone-200 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
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
