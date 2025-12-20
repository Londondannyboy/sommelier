'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { VoiceShoppingLayout, ActiveFilters } from './VoiceShopping'

// Dynamically import animation components to avoid SSR issues
const LottieGoddess = dynamic(() => import('./LottieGoddess'), { ssr: false })

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
    parameters: '{ "type": "object", "properties": { "country": { "type": "string", "description": "Country like France, USA, Italy" }, "region": { "type": "string", "description": "Region like Bordeaux, Burgundy, Champagne" }, "wine_type": { "type": "string", "description": "Type like red, white, sparkling" }, "color": { "type": "string", "description": "Color like red, white, rose" }, "max_price": { "type": "number", "description": "Maximum price in GBP" }, "min_price": { "type": "number", "description": "Minimum price in GBP" }, "grape_variety": { "type": "string", "description": "Grape variety like Pinot Noir, Chardonnay" } } }',
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

function VoiceShoppingInterface({ accessToken, userId }: { accessToken: string; userId?: string }) {
  const { connect, disconnect, status, messages, sendToolMessage, isPlaying } = useVoice()
  const [manualConnected, setManualConnected] = useState(false)
  const [waveHeights, setWaveHeights] = useState<number[]>([])
  const [wines, setWines] = useState<Wine[]>([])
  // Wines to display in the rack
  const [displayedWines, setDisplayedWines] = useState<Wine[]>([])
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  const [localCart, setLocalCart] = useState<Array<{ id: number; name: string; winery: string; price: number; quantity: number; image_url: string }>>([])
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)

  // Log status changes for debugging
  useEffect(() => {
    console.log('[Hume] Status changed:', status.value)
    if (status.value === 'connected') setManualConnected(true)
    if (status.value === 'disconnected') {
      setManualConnected(false)
      // Clear filters when disconnected
      setActiveFilters({})
    }
  }, [status.value])

  // Log when wines change
  useEffect(() => {
    console.log('[Wine Rack] displayedWines:', displayedWines.length, displayedWines.map(w => w.name))
  }, [displayedWines])

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
        const winesResponse = await fetch('/api/wines')
        if (winesResponse.ok) {
          const winesData = await winesResponse.json()
          setWines(winesData)
        }

        const profileResponse = await fetch('/api/user-profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setUserProfile(profileData)
        }

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
            // Extract filter params for display
            if (parameters) {
              setActiveFilters({
                region: parameters.region,
                country: parameters.country,
                wine_type: parameters.wine_type,
                color: parameters.color,
                max_price: parameters.max_price,
                min_price: parameters.min_price,
                grape_variety: parameters.grape_variety,
              })
            }

            response = await fetch('/api/hume-tools/search-wines', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            console.log('[Wine Rack] search_wines result:', result)
            // Add wines directly to display
            if (result.wines && Array.isArray(result.wines)) {
              console.log('[Wine Rack] Adding wines to display:', result.wines.length)
              setDisplayedWines(prev => {
                const newWines = result.wines.filter((w: Wine) =>
                  !prev.find(dw => dw.id === w.id)
                )
                return [...newWines, ...prev]
              })
            }
            break

          case 'get_wine':
            response = await fetch('/api/hume-tools/get-wine', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters || {}),
            })
            result = await response.json()
            console.log('[Wine Rack] get_wine result:', result)
            // Add wine directly to display
            if (result.wine) {
              console.log('[Wine Rack] Adding wine to display:', result.wine.name)
              setDisplayedWines(prev => {
                if (prev.find(w => w.id === result.wine.id)) return prev
                return [result.wine, ...prev]
              })
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
            console.log('[Wine Rack] recommend_wines result:', result)
            // API returns recommendations array - add directly to display
            const recWines = result.recommendations || result.wines || []
            if (Array.isArray(recWines) && recWines.length > 0) {
              console.log('[Wine Rack] Adding recommendations to display:', recWines.length)
              setDisplayedWines(prev => {
                const newWines = recWines.filter((w: Wine) =>
                  !prev.find(dw => dw.id === w.id)
                )
                return [...newWines, ...prev]
              })
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

    if (lastMessage.toolCallId && lastMessage.name) {
      handleToolCall(lastMessage)
    }
  }, [messages, sendToolMessage, displayedWines, shopifyCartId])

  useEffect(() => {
    if (status.value === 'connected') {
      const interval = setInterval(() => {
        setWaveHeights([...Array(30)].map(() => 20 + Math.random() * 80))
      }, 150)
      return () => clearInterval(interval)
    } else {
      setWaveHeights([...Array(30)].map((_, i) => 20 + Math.sin(i * 0.5) * 15))
    }
  }, [status.value])

  const handleConnect = useCallback(async () => {
    if (!accessToken) {
      console.error('No access token available')
      return
    }

    const firstName = (userProfile?.displayName || 'Friend').split(' ')[0]

    const winesByCountry: Record<string, string[]> = {}
    wines.forEach(wine => {
      const country = wine.region?.split(',').pop()?.trim() || 'Other'
      if (!winesByCountry[country]) winesByCountry[country] = []
      winesByCountry[country].push(`${wine.name} (${wine.wine_type})`)
    })

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
        wine_count: wines.length.toString(),
        wine_regions: 'Bordeaux, Champagne, and other fine wine regions',
      }
    }

    console.log('[Hume] Connecting:', userProfile?.displayName, 'auth=', !!userId)

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
    setActiveFilters({})
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

  const isConnected = status.value === 'connected' || manualConnected
  const isConnecting = status.value === 'connecting' && !manualConnected
  const isError = status.value === 'error'

  // Featured wine is the most recently displayed (revealed from transcript)
  const featuredWine = displayedWines.length > 0 ? displayedWines[0] : null

  // Cart wine IDs for highlighting
  const cartWineIds = localCart.map(item => item.id)

  // Compact Voice Widget Content
  const voiceWidgetContent = (
    <div className="flex flex-col items-center">
      {/* Goddess Avatar - Smaller in compact mode */}
      <div className="relative mb-6">
        {/* Champagne fizz bubbles */}
        <div className="goddess-fizz">
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
          <div className="fizz-bubble"></div>
        </div>

        {/* Golden glow - pulsating when idle */}
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

        {/* Active golden aura */}
        {isConnected && (
          <div
            className="absolute inset-0 rounded-full animate-[rotate-shine_4s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(212,165,10,0.6) 60deg, rgba(245,197,24,0.9) 120deg, rgba(212,165,10,0.6) 180deg, transparent 240deg, transparent 360deg)',
              transform: 'scale(1.15)',
              filter: 'blur(4px)',
            }}
          />
        )}

        {/* The Goddess - clickable */}
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className="relative z-10 group focus:outline-none"
          aria-label={isConnected ? "End session with the Goddess" : "Tap to commune with Aionysus"}
        >
          <div className={`relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden ${
            isConnected
              ? 'shadow-[0_0_60px_rgba(212,165,10,0.9)]'
              : 'shadow-[0_0_40px_rgba(212,165,10,0.5)] group-hover:shadow-[0_0_70px_rgba(212,165,10,0.8)]'
          } transition-all duration-300`}
            style={{ border: '3px solid rgba(212,165,10,0.8)' }}
          >
            <div className="absolute inset-0">
              <div className="absolute inset-[-20%] w-[140%] h-[140%] z-0">
                <LottieGoddess
                  isPlaying={isPlaying}
                  animationPath="/animations/goddess.json"
                />
              </div>
              <div className={`absolute inset-[-15%] w-[130%] h-[130%] flex items-center justify-center z-10 ${
                isPlaying ? 'animate-[speaking-breathe_2s_ease-in-out_infinite]' : ''
              }`}>
                <img
                  src="/aionysus-classic-icon.png"
                  alt="Aionysus - Goddess of Wine"
                  className={`w-full h-full object-cover cursor-pointer ${
                    isPlaying ? 'scale-105 brightness-110' : ''
                  } transition-all duration-300`}
                />
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full animate-[speaking-glow_1.5s_ease-in-out_infinite] pointer-events-none z-20" />
              )}
            </div>

            {isConnecting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Connect/Disconnect Button */}
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        className={`mb-4 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
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

      {/* Waveform */}
      <div className="flex items-center justify-center gap-[2px] h-10 w-48 mb-4">
        {waveHeights.map((height, i) => (
          <div
            key={i}
            className={`w-[2px] rounded-full transition-all duration-100 ${
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

      {/* Status Text */}
      <p className={`text-base md:text-lg font-medium mb-4 text-center transition-all ${
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

      {/* Wine Proverb - Only show when not connected */}
      {!isConnected && (
        <p className="text-gold-500/70 text-sm italic mb-4 text-center">
          "Where there is no wine, there is no love"
        </p>
      )}

      {/* Info Panel - Only when not connected */}
      {!isConnected && (
        <div className="text-center mb-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-900/20 rounded-full border border-gold-700/30 text-xs">
            <span className="text-gold-400 font-semibold">BETA</span>
            <span className="text-gold-600">|</span>
            <span className="text-gold-300">3,800+ Wines</span>
          </div>
        </div>
      )}

      {/* Your Cart Mini-Summary */}
      {localCart.length > 0 && (
        <div className="w-full max-w-xs mt-4">
          <Link
            href="/cart"
            className="flex items-center justify-between p-3 bg-stone-900/80 rounded-xl border border-gold-700/30 hover:border-gold-500/50 transition-all"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gold-300 text-sm font-medium">
                {localCart.reduce((sum, item) => sum + item.quantity, 0)} item{localCart.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-gold-400 font-bold text-sm">
              £{localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
            </span>
          </Link>
        </div>
      )}

      {/* Checkout floating button */}
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

      {/* Cart FAB */}
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

  return (
    <VoiceShoppingLayout
      featuredWine={featuredWine}
      discussedWines={displayedWines}
      activeFilters={activeFilters}
      onAddToCart={handleAddToCart}
      isConnected={isConnected}
      cartWineIds={cartWineIds}
    >
      {voiceWidgetContent}
    </VoiceShoppingLayout>
  )
}

export function VoiceShoppingWidget() {
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
      <VoiceShoppingInterface accessToken={accessToken} userId={user?.id} />
    </VoiceProvider>
  )
}
