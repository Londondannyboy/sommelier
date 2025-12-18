'use client'

import Link from 'next/link'
import { useUser } from '@stackframe/stack'
import { useState } from 'react'

export function Header() {
  const user = useUser()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span className="font-serif font-bold text-2xl text-wine-700">
              Aionysus
            </span>
            <span className="text-[10px] text-wine-500 italic -mt-1">
              Where there is no wine, there is no love
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-sommelier-ai-works" className="text-stone-600 hover:text-stone-900 transition-colors text-sm">How it works</a>
            <a href="#sommelier-ai-for-business" className="text-stone-600 hover:text-stone-900 transition-colors text-sm">For Business</a>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Avatar */}
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
                        className="w-9 h-9 rounded-full object-cover border border-wine-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-wine-600 flex items-center justify-center text-white text-sm font-bold border border-wine-200">
                        {user.displayName?.[0] || user.primaryEmail?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-sm text-stone-900 hidden sm:inline">{user.displayName || 'User'}</span>
                  </button>

                  {/* Sign Out Menu */}
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="text-xs text-stone-500">{user.primaryEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          user.signOut()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/handler/sign-up"
                className="bg-wine-600 text-white font-medium px-5 py-2.5 rounded-full hover:bg-wine-700 transition-colors text-sm"
              >
                Sign in to beta
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
