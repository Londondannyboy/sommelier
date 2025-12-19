'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black border-t border-gold-800/30 py-12 mt-auto">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2 justify-center group">
          {/* Golden goddess portrait icon */}
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gold-500/50 shadow-[0_0_10px_rgba(212,165,10,0.3)] group-hover:shadow-[0_0_15px_rgba(212,165,10,0.5)] transition-shadow">
            <img
              src="/aionysus.jpg"
              alt="Aionysus"
              className="w-full h-full object-cover object-[center_15%]"
            />
          </div>
          <span className="font-serif font-bold text-xl bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">Aionysus</span>
        </Link>
        <p className="text-gold-500/60 italic text-sm mt-2 mb-6">Where there is no wine, there is no love</p>

        {/* Navigation Links */}
        <nav className="flex justify-center gap-6 mb-6">
          <Link href="/wines" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
            Wines
          </Link>
          <Link href="/cart" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
            Cart
          </Link>
          <a href="mailto:hello@aionysus.wine" className="text-stone-400 hover:text-gold-400 transition-colors text-sm">
            Contact
          </a>
        </nav>

        <div className="border-t border-gold-800/30 pt-6">
          <p className="text-stone-500 text-xs">
            © {new Date().getFullYear()} Aionysus • BETA<br />
            <a href="mailto:hello@aionysus.wine" className="hover:text-gold-400 transition-colors">hello@aionysus.wine</a>
          </p>
          <p className="text-stone-600 text-xs mt-4">Drink responsibly.</p>
        </div>
      </div>
    </footer>
  )
}
