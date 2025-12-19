'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart, updateCartLine, removeCartLine, formatPrice, type Cart, type CartLine } from '@/lib/shopify'

interface LocalCartItem {
  id: number
  name: string
  winery: string
  price: number
  quantity: number
  image_url: string
}

export default function CartPage() {
  const [shopifyCart, setShopifyCart] = useState<Cart | null>(null)
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isShopifyEnabled, setIsShopifyEnabled] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function loadCart() {
      // Check if Shopify is configured
      const shopifyConfigured = !!(
        process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
      )
      setIsShopifyEnabled(shopifyConfigured)

      if (shopifyConfigured) {
        // Load Shopify cart
        const cartId = localStorage.getItem('sommelier-shopify-cart-id')
        if (cartId) {
          try {
            const cart = await getCart(cartId)
            if (cart) {
              setShopifyCart(cart)
            }
          } catch (error) {
            console.error('Error loading Shopify cart:', error)
          }
        }
      } else {
        // Load local cart
        const savedCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
        setLocalCart(savedCart)
      }

      setLoading(false)
    }

    loadCart()
  }, [])

  // Shopify cart operations
  const updateShopifyQuantity = useCallback(async (lineId: string, newQuantity: number) => {
    if (!shopifyCart) return

    setUpdating(lineId)
    try {
      if (newQuantity <= 0) {
        const updatedCart = await removeCartLine(shopifyCart.id, lineId)
        setShopifyCart(updatedCart)
      } else {
        const updatedCart = await updateCartLine(shopifyCart.id, lineId, newQuantity)
        setShopifyCart(updatedCart)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setUpdating(null)
    }
  }, [shopifyCart])

  const removeShopifyItem = useCallback(async (lineId: string) => {
    if (!shopifyCart) return

    setUpdating(lineId)
    try {
      const updatedCart = await removeCartLine(shopifyCart.id, lineId)
      setShopifyCart(updatedCart)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdating(null)
    }
  }, [shopifyCart])

  // Local cart operations
  const updateLocalQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeLocalItem(id)
      return
    }

    const updatedCart = localCart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setLocalCart(updatedCart)
    localStorage.setItem('sommelier-cart', JSON.stringify(updatedCart))
  }

  const removeLocalItem = (id: number) => {
    const updatedCart = localCart.filter(item => item.id !== id)
    setLocalCart(updatedCart)
    localStorage.setItem('sommelier-cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    if (isShopifyEnabled) {
      localStorage.removeItem('sommelier-shopify-cart-id')
      setShopifyCart(null)
    } else {
      setLocalCart([])
      localStorage.removeItem('sommelier-cart')
    }
  }

  // Calculate totals
  const getCartData = () => {
    if (isShopifyEnabled && shopifyCart) {
      const items = shopifyCart.lines.edges.map(edge => edge.node)
      const subtotal = parseFloat(shopifyCart.cost.subtotalAmount.amount)
      const total = parseFloat(shopifyCart.cost.totalAmount.amount)
      const currency = shopifyCart.cost.totalAmount.currencyCode

      return {
        items,
        itemCount: shopifyCart.totalQuantity,
        subtotal: formatPrice(subtotal.toString(), currency),
        total: formatPrice(total.toString(), currency),
        checkoutUrl: shopifyCart.checkoutUrl,
        isEmpty: shopifyCart.totalQuantity === 0,
      }
    } else {
      const subtotal = localCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shipping = subtotal > 100 ? 0 : 5.99
      const total = subtotal + shipping

      return {
        items: localCart,
        itemCount: localCart.reduce((s, i) => s + i.quantity, 0),
        subtotal: `£${subtotal.toFixed(2)}`,
        total: `£${total.toFixed(2)}`,
        shipping: shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`,
        checkoutUrl: null,
        isEmpty: localCart.length === 0,
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold-700/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    )
  }

  const cartData = getCartData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,10,0.08)_0%,transparent_50%)]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-28">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-gold-500/60 text-xs tracking-[0.2em] uppercase">✦ Your Selection ✦</span>
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">Your Cart</h1>
          </div>
          {isShopifyEnabled && (
            <span className="text-xs bg-gold-900/50 text-gold-300 px-3 py-1 rounded-full border border-gold-700/30">
              Shopify Checkout
            </span>
          )}
        </div>

        {cartData.isEmpty ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍷</div>
            <h2 className="text-xl font-semibold text-gold-200 mb-2">Your cart is empty</h2>
            <p className="text-gold-400/60 mb-6">Ask Aionysus for wine recommendations or browse our collection</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black rounded-lg font-semibold hover:from-gold-400 hover:to-gold-500 transition-all shadow-[0_0_20px_rgba(212,165,10,0.3)]"
              >
                Talk to Aionysus
              </Link>
              <Link
                href="/wines"
                className="px-6 py-3 bg-stone-800 text-gold-200 rounded-lg font-semibold hover:bg-stone-700 border border-gold-700/30 transition-colors"
              >
                Browse Wines
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {isShopifyEnabled && shopifyCart ? (
                // Shopify cart items
                shopifyCart.lines.edges.map(({ node: item }) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 p-4 flex gap-4"
                  >
                    <div className="w-20 h-28 relative flex-shrink-0">
                      <Image
                        src={item.merchandise.product.featuredImage?.url || '/wine-placeholder.svg'}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/wines`} className="font-semibold text-gold-100 hover:text-gold-300">
                        {item.merchandise.product.title}
                      </Link>
                      <p className="text-sm text-gold-400/60">{item.merchandise.title}</p>
                      <p className="font-bold text-gold-400 mt-1">
                        {formatPrice(item.merchandise.price.amount, item.merchandise.price.currencyCode)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gold-700/30 rounded-lg bg-stone-900/50">
                          <button
                            onClick={() => updateShopifyQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="px-3 py-1 text-gold-400 hover:bg-gold-900/30 transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium text-gold-200">
                            {updating === item.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => updateShopifyQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="px-3 py-1 text-gold-400 hover:bg-gold-900/30 transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeShopifyItem(item.id)}
                          disabled={updating === item.id}
                          className="text-gold-600/50 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Local cart items
                localCart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-b from-stone-900/80 to-stone-950/90 rounded-xl border border-gold-700/20 p-4 flex gap-4"
                  >
                    <div className="w-20 h-28 relative flex-shrink-0">
                      <Image
                        src={item.image_url || '/wine-placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/wines/${item.id}`} className="font-semibold text-gold-100 hover:text-gold-300">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gold-400/60">{item.winery}</p>
                      <p className="font-bold text-gold-400 mt-1">£{item.price.toFixed(2)}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gold-700/30 rounded-lg bg-stone-900/50">
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gold-400 hover:bg-gold-900/30 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium text-gold-200">{item.quantity}</span>
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gold-400 hover:bg-gold-900/30 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeLocalItem(item.id)}
                          className="text-gold-600/50 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={clearCart}
                className="text-sm text-gold-500/50 hover:text-red-400 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-stone-900/90 to-stone-950 rounded-xl border border-gold-700/30 p-6 sticky top-24">
                <h2 className="font-bold text-gold-200 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gold-300/70">
                    <span>Subtotal ({cartData.itemCount} items)</span>
                    <span>{cartData.subtotal}</span>
                  </div>
                  {!isShopifyEnabled && (
                    <div className="flex justify-between text-gold-300/70">
                      <span>Shipping</span>
                      <span>{cartData.shipping}</span>
                    </div>
                  )}
                  <div className="border-t border-gold-700/30 pt-3 flex justify-between font-bold text-gold-200">
                    <span>Total</span>
                    <span>{cartData.total}</span>
                  </div>
                </div>

                {cartData.checkoutUrl ? (
                  <a
                    href={cartData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black text-center rounded-lg font-semibold hover:from-gold-400 hover:to-gold-500 transition-all shadow-[0_0_20px_rgba(212,165,10,0.3)] mb-3"
                  >
                    Checkout
                  </a>
                ) : (
                  <button className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-black rounded-lg font-semibold hover:from-gold-400 hover:to-gold-500 transition-all shadow-[0_0_20px_rgba(212,165,10,0.3)] mb-3">
                    Checkout
                  </button>
                )}

                <p className="text-xs text-center text-gold-500/50">
                  {isShopifyEnabled ? 'Secure checkout powered by Shopify' : 'Demo only - no real orders processed'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
