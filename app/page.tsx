import { LazyVoiceWidget } from '@/components/LazyVoiceWidget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black relative overflow-hidden">
      {/* Champagne bubbles rising UP like fizz in a glass - LOTS of them! */}
      <div className="champagne-bubbles" aria-hidden="true">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>

      {/* Dramatic radial gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,10,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Decorative vine border at top */}
      <div className="fixed top-20 left-0 right-0 z-30 text-center text-gold-500/30 text-sm tracking-[0.5em] pointer-events-none">
        ✦ ❧ ✦ ❧ ✦
      </div>

      {/* BETA Badge - Golden themed */}
      <div className="fixed top-24 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-gold-900/80 to-gold-800/80 text-gold-200 px-4 py-2 rounded-full text-xs font-mono tracking-wider border border-gold-600/50 shadow-[0_0_20px_rgba(212,165,10,0.3)] backdrop-blur-sm">
        <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></span>
        BETA
      </div>

      {/* Hero Section - more breathing room */}
      <main className="relative z-10">
        <section className="max-w-5xl mx-auto px-4 pt-36 pb-20 relative">
          {/* H1 for SEO */}
          <h1 className="sr-only">AI Sommelier & AI Wine Taster - Aionysus</h1>

          {/* Voice Widget - Lazy loaded */}
          <LazyVoiceWidget />

          {/* Decorative divider */}
          <div className="divider-ornate max-w-md mx-auto mt-12">
            <span className="text-gold-500 text-lg">🍇</span>
          </div>
        </section>

        {/* How Our AI Sommelier Works - Dark dramatic theme */}
        <section id="how-sommelier-ai-works" className="bg-gradient-to-b from-stone-950 to-black py-24 border-t border-gold-800/20">
          <div className="max-w-4xl mx-auto px-4">
            {/* Decorative header */}
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">The Divine Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              How Our Sommelier Works
            </h2>
            <p className="text-lg text-gold-200/70 text-center max-w-2xl mx-auto mb-16">
              Talk to Aionysus like you would a sommelier. Tell her what you're after. Get expert recommendations instantly.
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_40px_rgba(212,165,10,0.6)] transition-all">1</div>
                <h3 className="font-bold text-gold-300 text-lg mb-3">Tap Her Face</h3>
                <p className="text-gold-100/60 leading-relaxed">Start speaking with Aionysus. No forms, no menus, no filters. Just conversation.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_40px_rgba(212,165,10,0.6)] transition-all">2</div>
                <h3 className="font-bold text-gold-300 text-lg mb-3">Tell Her What You Want</h3>
                <p className="text-gold-100/60 leading-relaxed">Budget, occasion, food pairing, investment goals—whatever's on your mind. She'll understand.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-[0_0_30px_rgba(212,165,10,0.4)] group-hover:shadow-[0_0_40px_rgba(212,165,10,0.6)] transition-all">3</div>
                <h3 className="font-bold text-gold-300 text-lg mb-3">Get Your Wine</h3>
                <p className="text-gold-100/60 leading-relaxed">Expert picks with tasting notes, drinking windows, and real prices. No upsells, no games.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose an AI Wine Taster - Dark dramatic */}
        <section className="py-24 bg-black border-t border-gold-800/20">
          <div className="max-w-4xl mx-auto px-4">
            {/* Decorative header */}
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">✦ Divine Expertise ✦</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-6 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Why Choose a Divine Sommelier
            </h2>
            <p className="text-lg text-gold-200/70 text-center max-w-2xl mx-auto mb-4">
              Buying fine wine shouldn't require a sommelier on retainer. Aionysus gives you that expertise—instantly, conversationally, 24/7.
            </p>
            <p className="text-base text-gold-400/50 text-center max-w-2xl mx-auto mb-12">
              Currently featuring 500+ wines across premium regions. Investment-grade Bordeaux, First Growths, Grand Cru Classé, and more.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-gradient-to-b from-stone-900/80 to-stone-950/80 rounded-xl p-6 border border-gold-700/30 hover:border-gold-500/50 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all hover-lift">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="font-bold text-gold-300 text-lg mb-2">No More Guessing</h3>
                <p className="text-gold-100/60">Tell her your budget, your occasion, your taste. Get one perfect recommendation—not a wall of 200 bottles to scroll through.</p>
              </article>
              <article className="bg-gradient-to-b from-stone-900/80 to-stone-950/80 rounded-xl p-6 border border-gold-700/30 hover:border-gold-500/50 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all hover-lift">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="font-bold text-gold-300 text-lg mb-2">Investment Intelligence</h3>
                <p className="text-gold-100/60">Know which vintages hold value. Understand classifications. Get the story behind the wine—not just a pretty label.</p>
              </article>
              <article className="bg-gradient-to-b from-stone-900/80 to-stone-950/80 rounded-xl p-6 border border-gold-700/30 hover:border-gold-500/50 hover:shadow-[0_0_30px_rgba(212,165,10,0.15)] transition-all hover-lift">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="font-bold text-gold-300 text-lg mb-2">Actually Conversational</h3>
                <p className="text-gold-100/60">Ask follow-ups. Change your mind. Say "something cheaper" or "more full-bodied." She keeps up.</p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ - Dark dramatic theme */}
        <section className="py-24 bg-gradient-to-b from-stone-950 to-black border-t border-gold-800/20">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">🍇 Questions 🍇</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Is this free?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Yes. Free during BETA. Tap her face and start talking.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  What wines do you have?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Over 500 wines and growing. Investment-grade Bordeaux, legendary vintages, First Growths, and Grand Cru Classé. Ask Aionysus—she'll tell you what's available.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Can I actually buy wine here?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Not yet—this is a demo. We're building the purchasing experience. For now, Aionysus helps you discover and learn. When you find something you want, she'll connect you to our team.</p>
              </details>
              <details className="bg-stone-900/50 rounded-xl border border-gold-700/30 group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-gold-200 flex justify-between items-center hover:text-gold-400">
                  Enterprise or API access?
                  <span className="text-gold-500/60 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-gold-100/60">Sure. Drop us a line at <a href="mailto:hello@aionysus.wine" className="text-gold-400 hover:text-gold-300 hover:underline">hello@aionysus.wine</a></p>
              </details>
            </div>
          </div>
        </section>

        {/* Your Journey with Aionysus - Dark dramatic timeline */}
        <section className="py-24 bg-black border-t border-gold-800/20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-gold-500/60 text-sm tracking-[0.3em] uppercase">✦ Your Divine Journey ✦</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
              Your Journey with Aionysus
            </h2>
            <p className="text-gold-200/60 text-center max-w-2xl mx-auto mb-16">
              From first sip to last drop, the goddess guides you through every step of discovering exceptional wine.
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line - golden */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-500/50 via-gold-600/30 to-gold-500/50 -translate-x-1/2"></div>

              <div className="space-y-12 md:space-y-0">
                {/* Step 1 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-gold-400 font-mono text-sm mb-2">01</span>
                    <h3 className="font-bold text-gold-300 text-xl mb-2">Search</h3>
                    <p className="text-gold-100/60">Tell Aionysus what you're looking for. Budget, occasion, food pairing, or investment goal—speak naturally, and she understands.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-600/30 to-gold-800/30 border border-gold-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,165,10,0.2)]">🔍</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="hidden md:flex items-center justify-end pr-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-600/30 to-gold-800/30 border border-gold-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,165,10,0.2)]">💡</div>
                  </div>
                  <div className="md:pl-12">
                    <span className="inline-block text-gold-400 font-mono text-sm mb-2">02</span>
                    <h3 className="font-bold text-gold-300 text-xl mb-2">Advise</h3>
                    <p className="text-gold-100/60">The goddess analyses 500+ wines instantly. She considers vintage, classification, drinking window, and investment potential to find your perfect match.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-gold-400 font-mono text-sm mb-2">03</span>
                    <h3 className="font-bold text-gold-300 text-xl mb-2">Select</h3>
                    <p className="text-gold-100/60">Receive one expert recommendation at a time—complete with tasting notes, food pairings, critic scores, and real pricing.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-600/30 to-gold-800/30 border border-gold-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,165,10,0.2)]">🍷</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="hidden md:flex items-center justify-end pr-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-600/30 to-gold-800/30 border border-gold-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,165,10,0.2)]">🛒</div>
                  </div>
                  <div className="md:pl-12">
                    <span className="inline-block text-gold-400 font-mono text-sm mb-2">04</span>
                    <h3 className="font-bold text-gold-300 text-xl mb-2">Checkout</h3>
                    <p className="text-gold-100/60">Add to cart and complete your purchase. Case discounts, trade pricing, and delivery handled seamlessly.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-gold-400 font-mono text-sm mb-2">05</span>
                    <h3 className="font-bold text-gold-300 text-xl mb-2">Enjoy</h3>
                    <p className="text-gold-100/60">Savour a perfectly chosen bottle. Whether it's a Tuesday night treat or a milestone celebration, the goddess helped you find something special.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold-600/30 to-gold-800/30 border border-gold-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,165,10,0.2)]">✨</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divine quote */}
            <blockquote className="divine-quote mt-16 max-w-xl mx-auto">
              Where there is no wine, there is no love.
            </blockquote>
          </div>
        </section>
      </main>
    </div>
  )
}
