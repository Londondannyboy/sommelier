'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-stone-50 border-t border-stone-100 py-12 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2 justify-center">
          {/* Wine glass icon */}
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="footer-wine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9f1239"/>
                <stop offset="100%" stopColor="#7f1d1d"/>
              </linearGradient>
            </defs>
            <path d="M8 6 C8 6 7 14 10 17 C12 19 14 20 16 20 C18 20 20 19 22 17 C25 14 24 6 24 6 Z" fill="url(#footer-wine-gradient)" opacity="0.9"/>
            <rect x="15" y="20" width="2" height="6" fill="#78716c"/>
            <ellipse cx="16" cy="28" rx="5" ry="2" fill="#78716c"/>
          </svg>
          <span className="font-serif font-bold text-xl text-wine-700">Aionysus</span>
        </Link>
        <p className="text-stone-500 italic text-sm mt-2 mb-6">Where there is no wine, there is no love</p>

        {/* Navigation Links */}
        <nav className="flex justify-center gap-6 mb-6">
          <Link href="/wines" className="text-stone-600 hover:text-wine-600 transition-colors text-sm">
            Wines
          </Link>
          <Link href="/cart" className="text-stone-600 hover:text-wine-600 transition-colors text-sm">
            Cart
          </Link>
          <a href="mailto:hello@aionysus.wine" className="text-stone-600 hover:text-wine-600 transition-colors text-sm">
            Contact
          </a>
        </nav>

        <div className="border-t border-stone-200 pt-6">
          <p className="text-stone-400 text-xs">
            © {new Date().getFullYear()} Aionysus • BETA<br />
            <a href="mailto:hello@aionysus.wine" className="hover:text-wine-600 transition-colors">hello@aionysus.wine</a>
          </p>
          <p className="text-stone-400 text-xs mt-4">Drink responsibly.</p>
        </div>
      </div>
    </footer>
  )
}
