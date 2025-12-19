'use client'

import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { useState, useEffect } from 'react'

export function NavBar() {
  const user = useUser()
  const [showMenu, setShowMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Get cart count from localStorage (works for both Shopify and demo mode)
  useEffect(() => {
    function updateCartCount() {
      // Check Shopify cart first
      const shopifyCartId = localStorage.getItem('sommelier-shopify-cart-id')
      if (shopifyCartId) {
        // For Shopify, we'd need to fetch the cart - for now, check local storage
        const localCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
        const count = localCart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
        setCartCount(count)
      } else {
        // Demo mode cart
        const localCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
        const count = localCart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
        setCartCount(count)
      }
    }

    updateCartCount()

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount)

    // Also listen for custom cart update events
    const handleCartUpdate = () => updateCartCount()
    window.addEventListener('cart-updated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', handleCartUpdate)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Main navbar - dramatic dark with golden accents */}
      <div className="bg-gradient-to-r from-black via-stone-950 to-black border-b border-gold-600/30 shadow-[0_4px_30px_rgba(212,165,10,0.15)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">

            {/* Left: Branding - Aionysus title & strapline */}
            <Link href="/" className="group">
              <h1 className="font-serif font-bold text-3xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(212,165,10,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(212,165,10,0.7)] transition-all">
                Aionysus
              </h1>
              <p className="text-sm text-gold-400 italic tracking-wide">
                Goddess of Wine
              </p>
            </Link>

            {/* Center: Navigation - larger, white text */}
            <nav className="hidden md:flex items-center gap-10">
              <Link
                href="/"
                className="text-white hover:text-gold-300 transition-all font-semibold text-base uppercase tracking-widest hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
              >
                Home
              </Link>
              <Link
                href="/wines"
                className="text-white hover:text-gold-300 transition-all font-semibold text-base uppercase tracking-widest hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
              >
                Wines
              </Link>
              <Link
                href="/cart"
                className="text-white hover:text-gold-300 transition-all font-semibold text-base uppercase tracking-widest hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
              >
                Basket
              </Link>
            </nav>

            {/* Right: Cart & Auth */}
            <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gold-500/10 rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(212,165,10,0.5)]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  aria-label="User menu"
                >
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.displayName || 'User'}
                      width="36"
                      height="36"
                      className="w-9 h-9 rounded-full object-cover border-2 border-gold-500/50"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-black text-sm font-bold">
                      {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-black/95 rounded-lg shadow-lg border border-gold-800/50 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gold-800/30">
                        <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                        <p className="text-xs text-stone-400 truncate">{user.primaryEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          user.signOut()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/handler/sign-up"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-medium px-4 py-2 rounded-full hover:from-gold-400 hover:to-gold-500 transition-all text-sm shadow-[0_0_15px_rgba(212,165,10,0.3)] hover:shadow-[0_0_20px_rgba(212,165,10,0.5)]"
              >
                Sign in
              </Link>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
