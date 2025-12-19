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
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin" />
      </div>
    )
  }

  const cartData = getCartData()

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍷</span>
              <span className="font-bold text-xl text-stone-900">Aionysus</span>
            </Link>
            <Link href="/wines" className="text-stone-600 hover:text-wine-600 transition-colors">
              Browse Wines
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900">Your Cart</h1>
          {isShopifyEnabled && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Shopify Checkout
            </span>
          )}
        </div>

        {cartData.isEmpty ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍷</div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">Your cart is empty</h2>
            <p className="text-stone-500 mb-6">Ask Aionysus for wine recommendations or browse our collection</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-wine-600 text-white rounded-lg font-semibold hover:bg-wine-700 transition-colors"
              >
                Talk to Aionysus
              </Link>
              <Link
                href="/wines"
                className="px-6 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
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
                    className="bg-white rounded-xl border border-stone-100 p-4 flex gap-4"
                  >
                    <div className="w-20 h-28 relative flex-shrink-0">
                      <Image
                        src={item.merchandise.product.featuredImage?.url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop'}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/wines`} className="font-semibold text-stone-900 hover:text-wine-600">
                        {item.merchandise.product.title}
                      </Link>
                      <p className="text-sm text-stone-500">{item.merchandise.title}</p>
                      <p className="font-bold text-wine-600 mt-1">
                        {formatPrice(item.merchandise.price.amount, item.merchandise.price.currencyCode)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            onClick={() => updateShopifyQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium">
                            {updating === item.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => updateShopifyQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeShopifyItem(item.id)}
                          disabled={updating === item.id}
                          className="text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
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
                    className="bg-white rounded-xl border border-stone-100 p-4 flex gap-4"
                  >
                    <div className="w-20 h-28 relative flex-shrink-0">
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1">
                      <Link href={`/wines/${item.id}`} className="font-semibold text-stone-900 hover:text-wine-600">
                        {item.name}
                      </Link>
                      <p className="text-sm text-stone-500">{item.winery}</p>
                      <p className="font-bold text-wine-600 mt-1">£{item.price.toFixed(2)}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateLocalQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeLocalItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
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
                className="text-sm text-stone-500 hover:text-red-500 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-stone-100 p-6 sticky top-24">
                <h2 className="font-bold text-stone-900 mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal ({cartData.itemCount} items)</span>
                    <span>{cartData.subtotal}</span>
                  </div>
                  {!isShopifyEnabled && (
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      <span>{cartData.shipping}</span>
                    </div>
                  )}
                  <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-900">
                    <span>Total</span>
                    <span>{cartData.total}</span>
                  </div>
                </div>

                {cartData.checkoutUrl ? (
                  <a
                    href={cartData.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-wine-600 text-white text-center rounded-lg font-semibold hover:bg-wine-700 transition-colors mb-3"
                  >
                    Checkout
                  </a>
                ) : (
                  <button className="w-full py-3 bg-wine-600 text-white rounded-lg font-semibold hover:bg-wine-700 transition-colors mb-3">
                    Checkout
                  </button>
                )}

                <p className="text-xs text-center text-stone-500">
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
