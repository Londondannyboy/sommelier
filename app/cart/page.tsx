'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: number
  name: string
  winery: string
  price: number
  quantity: number
  image_url: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
    setCart(savedCart)
    setLoading(false)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('sommelier-cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: number) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('sommelier-cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('sommelier-cart')
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 5.99
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin" />
      </div>
    )
  }

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
            <Link href="/wines" className="text-stone-600 hover:text-wine-600 transition-colors">
              Browse Wines
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍷</div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">Your cart is empty</h2>
            <p className="text-stone-500 mb-6">Ask Sofia for wine recommendations or browse our collection</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-wine-600 text-white rounded-lg font-semibold hover:bg-wine-700 transition-colors"
              >
                Talk to Sofia
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
              {cart.map((item) => (
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
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

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
                    <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < 100 && (
                    <p className="text-xs text-stone-500">
                      Spend £{(100 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-stone-900">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-wine-600 text-white rounded-lg font-semibold hover:bg-wine-700 transition-colors mb-3">
                  Checkout
                </button>

                <p className="text-xs text-center text-stone-500">
                  Demo only - no real orders processed
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
