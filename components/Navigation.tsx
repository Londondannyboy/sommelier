'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AuthButtons } from './AuthButtons'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`nav-sticky transition-all duration-300 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-wine-700 to-wine-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white text-2xl">&#127863;</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-wine-900 text-lg">Sommelier</span>
              <span className="text-wine-600 font-bold text-lg">.AI</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <AuthButtons />
          </div>
        </div>
      </div>
    </nav>
  )
}
