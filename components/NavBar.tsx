'use client'

import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { useState, useEffect } from 'react'

export function NavBar() {
  const user = useUser()
  const [showMenu, setShowMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Get cart count from localStorage
  useEffect(() => {
    function updateCartCount() {
      try {
        const localCart = JSON.parse(localStorage.getItem('sommelier-cart') || '[]')
        const count = localCart.reduce((sum: number, item: { quantity: number }) => sum + (item.quantity || 0), 0)
        setCartCount(count)
      } catch {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cart-updated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Main navbar - centered layout */}
      <div className="bg-gradient-to-b from-black via-stone-950 to-stone-950/95 border-b border-gold-600/20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top Row: Centered Logo & Auth */}
          <div className="flex items-center justify-center relative py-4">
            {/* Auth/Cart - absolute right */}
            <div className="absolute right-0 flex items-center gap-3">
              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gold-500/10 rounded-full transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 99 ? '99' : cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center hover:opacity-80 transition-opacity"
                    aria-label="User menu"
                  >
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.displayName || 'User'}
                        width="32"
                        height="32"
                        className="w-8 h-8 rounded-full object-cover border border-gold-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-black text-xs font-bold">
                        {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                      </div>
                    )}
                  </button>

                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 mt-2 w-48 bg-black/95 rounded-lg shadow-lg border border-gold-800/50 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gold-800/30">
                          <p className="text-sm font-medium text-white">{user.displayName || 'User'}</p>
                          <p className="text-xs text-stone-400 truncate">{user.primaryEmail}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setShowMenu(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-stone-300 hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                        >
                          My Cellar
                        </Link>
                        <button
                          onClick={() => { user.signOut(); setShowMenu(false) }}
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
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-black font-medium px-3 py-1.5 rounded-full hover:from-gold-400 hover:to-gold-500 transition-all text-xs"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Centered Logo */}
            <Link href="/" className="text-center group">
              <h1 className="font-serif font-bold text-3xl md:text-4xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(212,165,10,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(212,165,10,0.7)] transition-all">
                Aionysus
              </h1>
              <p className="text-sm text-gold-400/80 italic tracking-widest mt-0.5">
                Goddess of Wine
              </p>
            </Link>
          </div>

          {/* Bottom Row: Centered Navigation */}
          <nav className="flex items-center justify-center gap-8 md:gap-12 pb-3">
            <Link
              href="/"
              className="text-white/90 hover:text-gold-300 transition-all font-medium text-sm uppercase tracking-[0.2em] hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
            >
              Home
            </Link>
            <Link
              href="/wines"
              className="text-white/90 hover:text-gold-300 transition-all font-medium text-sm uppercase tracking-[0.2em] hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
            >
              Wines
            </Link>
            {user && (
              <Link
                href="/account"
                className="text-white/90 hover:text-gold-300 transition-all font-medium text-sm uppercase tracking-[0.2em] hover:drop-shadow-[0_0_8px_rgba(212,165,10,0.5)]"
              >
                Cellar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
