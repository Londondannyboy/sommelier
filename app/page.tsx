import { LazyVoiceWidget } from '@/components/LazyVoiceWidget'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Aionysus | Buy Wine Online UK - AI Sommelier & Wine Expert",
  description: "Buy wine online from Aionysus, your AI sommelier. Shop 3,800+ fine wines with instant recommendations, food pairings & expert guidance. Buy wine online UK with free delivery.",
  keywords: ["buy wine online", "buy wine online UK", "wine online UK", "AI sommelier", "AI wine taster", "wine shop", "fine wine", "wine delivery UK"],
  alternates: {
    canonical: "https://aionysus.wine",
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black relative overflow-hidden">
      {/* Champagne bubbles rising UP like fizz in a glass */}
      <div className="champagne-bubbles" aria-hidden="true">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
      </div>

      {/* Dramatic radial gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,10,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-[100px]" />
      </div>

      {/* BETA Badge */}
      <div className="fixed top-24 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-gold-900/80 to-gold-800/80 text-gold-200 px-4 py-2 rounded-full text-xs font-mono tracking-wider border border-gold-600/50 shadow-[0_0_20px_rgba(212,165,10,0.3)] backdrop-blur-sm">
        <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
        BETA
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero - Voice Widget First (above the fold) */}
        <section className="max-w-5xl mx-auto px-4 pt-28 pb-8">
          {/* Visible H1 with primary keyword */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
            Buy Wine Online
          </h1>
          <p className="text-xl md:text-2xl text-gold-200/70 text-center mb-2">
            with Your AI Sommelier
          </p>

          {/* Quick intro */}
          <div className="text-center mb-6">
            <p className="text-gold-400/80 text-lg md:text-xl font-light">
              Meet your divine wine guide. Tell her what you want, she'll find the perfect bottle.
            </p>
          </div>

          {/* Voice Widget - THE STAR */}
          <LazyVoiceWidget />

          {/* SEO Image with keyword alt text */}
          <div className="flex justify-center mt-8">
            <Image
              src="/aionysus-classic-icon.png"
              alt="Buy wine online with Aionysus AI sommelier - your personal wine expert"
              width={120}
              height={120}
              className="opacity-60"
            />
          </div>
        </section>

        {/* How Aionysus Works - Fun, punchy */}
        <section id="how-it-works" className="bg-gradient-to-b from-stone-950 to-black py-20 border-t border-gold-800/20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">Dead Simple</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              How to Buy Wine Online
            </h2>
            <p className="text-lg text-gold-200/70 text-center max-w-2xl mx-auto mb-12">
              No wine degree required. No endless scrolling. Just tell her what you want and buy wine online in seconds.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_50px_rgba(212,165,10,0.6)] transition-all group-hover:scale-110">
                  1
                </div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">Tap & Talk</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  Hit that golden face. Start chatting. It's that easy. No forms, no filters, no faff.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_50px_rgba(212,165,10,0.6)] transition-all group-hover:scale-110">
                  2
                </div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">Tell Her Everything</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  "Under £50 for a birthday." "Something to impress my in-laws." "I hate oaky Chardonnay." She gets it.
                </p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_50px_rgba(212,165,10,0.6)] transition-all group-hover:scale-110">
                  3
                </div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">Buy Wine Online Instantly</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  One perfect pick. Not 200 options. Tasting notes, food pairings, the works. Buy wine online and it's on its way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Aionysus - Playful */}
        <section className="py-20 bg-black border-t border-gold-800/20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">Why Bother?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Why Buy Wine Online with Us?
            </h2>
            <p className="text-lg text-gold-200/70 text-center max-w-2xl mx-auto mb-12">
              Because life's too short for mediocre wine. Our AI sommelier actually understands what you want.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-b from-stone-900/60 to-stone-950/60 rounded-2xl p-8 border border-gold-700/20">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">She Actually Knows Wine</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  3,800+ bottles in her brain. First Growths to hidden gems. Bordeaux to Burgundy. Investment grades to Tuesday night treats. She's done her homework.
                </p>
              </div>
              <div className="bg-gradient-to-b from-stone-900/60 to-stone-950/60 rounded-2xl p-8 border border-gold-700/20">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">Actually Listens</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  Change your mind? She adapts. Want something cheaper? Done. More full-bodied? On it. She's not a menu—she's a conversation.
                </p>
              </div>
              <div className="bg-gradient-to-b from-stone-900/60 to-stone-950/60 rounded-2xl p-8 border border-gold-700/20">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">Instant Expertise</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  No waiting for the sommelier. No pretending you know what "minerality" means. Just honest, instant advice from someone who won't judge you.
                </p>
              </div>
              <div className="bg-gradient-to-b from-stone-900/60 to-stone-950/60 rounded-2xl p-8 border border-gold-700/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-gold-300 text-xl mb-3">One Perfect Pick</h3>
                <p className="text-gold-100/60 leading-relaxed">
                  Not 50 options that all look the same. One recommendation. Perfect for YOU. With actual reasons why it's perfect.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Divine Touch - About Aionysus */}
        <section className="py-20 bg-gradient-to-b from-stone-950 to-black border-t border-gold-800/20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">The Goddess</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Meet Aionysus
            </h2>
            <p className="text-xl text-gold-200/70 leading-relaxed mb-8">
              Named after the god of wine (with a feminine twist, because why not), Aionysus is your AI sommelier who actually understands what "I need something for dinner with my boss" means.
            </p>
            <p className="text-lg text-gold-100/50 leading-relaxed mb-8">
              She's trained on thousands of wines, vintages, and regions. She knows which 2010s are drinking beautifully now and which need another decade. She won't try to upsell you. She just wants you to drink better wine.
            </p>
            <blockquote className="text-2xl font-serif italic text-gold-400/80 border-l-4 border-gold-500/50 pl-6 text-left">
              "Where there is no wine, there is no love."
            </blockquote>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-black border-t border-gold-800/20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">Got Questions?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              FAQ
            </h2>

            <div className="space-y-4">
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Is this actually free?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Yep. Free during beta. We're building something special and want you to try it. Tap her face, have a chat, find some wine.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  What wines do you have?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">3,800+ wines and counting. Red, white, rosé, sparkling, dessert. Bordeaux First Growths to everyday drinkers. Burgundy Grand Crus to Champagne legends. Ask her—she'll tell you what's available.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Can I buy wine online here?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Yes! You can buy wine online from our collection of 3,800+ bottles. Chat with Aionysus, find your perfect wine, and add to cart. UK delivery available.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  How does she know so much?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">We fed her thousands of wines with tasting notes, critic scores, vintage info, food pairings, and pricing. She's like a master sommelier who never sleeps and never judges your budget.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Enterprise or API access?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Absolutely. Drop us a line at <a href="mailto:hello@aionysus.wine" className="text-gold-400 hover:text-gold-300 hover:underline">hello@aionysus.wine</a> and let's chat.</p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-stone-950 to-black border-t border-gold-800/20">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Ready to Buy Wine Online?
            </h2>
            <p className="text-gold-200/70 mb-8">
              Scroll back up and tap that golden face. Tell her what you want and buy wine online in seconds.
            </p>
            <ScrollToTopButton />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gold-800/30 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent mb-1">
                Aionysus
              </h3>
              <p className="text-gold-500/60 text-sm italic">Goddess of Wine</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/wines" className="text-gold-400/70 hover:text-gold-300 transition-colors">
                Buy Wine Online
              </Link>
              <Link href="/wines" className="text-gold-400/70 hover:text-gold-300 transition-colors">
                Wine Shop UK
              </Link>
              <Link href="/privacy" className="text-gold-400/70 hover:text-gold-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gold-400/70 hover:text-gold-300 transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:hello@aionysus.wine" className="text-gold-400/70 hover:text-gold-300 transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gold-800/20 text-center">
            <p className="text-gold-500/40 text-sm">
              © {new Date().getFullYear()} Aionysus. All rights reserved.
            </p>
            <p className="text-gold-500/30 text-xs mt-2">
              Must be of legal drinking age to purchase alcohol. Please drink responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
