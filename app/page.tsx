import { LazyVoiceWidget } from '@/components/LazyVoiceWidget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9f7] via-white to-[#fef7f0] relative">
      {/* Aionysus Watermark Background - Full Screen */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
        <img
          src="/aionysus.jpg"
          alt="Aionysus AI Sommelier background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* BETA Badge */}
      <div className="fixed top-20 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-stone-900 to-stone-800 text-white px-4 py-2 rounded-full text-xs font-mono tracking-wider border border-stone-700 shadow-lg">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        BETA
      </div>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-5xl mx-auto px-4 pt-24 pb-16 relative">
          {/* H1 for SEO */}
          <h1 className="sr-only">AI Sommelier & AI Wine Taster - Aionysus</h1>

          {/* Voice Widget - Lazy loaded */}
          <LazyVoiceWidget />

          {/* Supporting text */}
          <div className="text-center mt-8 relative z-10">
            <p className="text-base text-stone-500 max-w-xl mx-auto italic">
              Your AI sommelier for premium wine recommendations
            </p>
          </div>
        </section>

        {/* How Our AI Sommelier Works */}
        <section id="how-sommelier-ai-works" className="bg-gradient-to-b from-white to-stone-50 py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-6">
              How Our AI Sommelier Works
            </h2>
            <p className="text-lg text-stone-600 text-center max-w-2xl mx-auto mb-16">
              Talk to Aionysus like you would a sommelier. Tell her what you're after. Get expert recommendations instantly.
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">1</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Hit Play</h3>
                <p className="text-stone-600 leading-relaxed">Start speaking with Aionysus. No forms, no menus, no filters. Just conversation.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">2</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Tell Her What You Want</h3>
                <p className="text-stone-600 leading-relaxed">Budget, occasion, food pairing, investment goals—whatever's on your mind. She'll understand.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">3</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Get Your Wine</h3>
                <p className="text-stone-600 leading-relaxed">Expert picks with tasting notes, drinking windows, and real prices. No upsells, no games.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose an AI Wine Taster */}
        <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-6">
              Why Choose an AI Wine Taster
            </h2>
            <p className="text-lg text-stone-600 text-center max-w-2xl mx-auto mb-4">
              Buying fine wine shouldn't require a sommelier on retainer. Aionysus gives you that expertise—instantly, conversationally, 24/7.
            </p>
            <p className="text-base text-stone-500 text-center max-w-2xl mx-auto mb-12">
              Currently featuring 500+ wines across premium regions. Investment-grade Bordeaux, First Growths, Grand Cru Classé, and more.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">No More Guessing</h3>
                <p className="text-stone-600">Tell her your budget, your occasion, your taste. Get one perfect recommendation—not a wall of 200 bottles to scroll through.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">Investment Intelligence</h3>
                <p className="text-stone-600">Know which vintages hold value. Understand classifications. Get the story behind the wine—not just a pretty label.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="font-bold text-stone-900 text-lg mb-2">Actually Conversational</h3>
                <p className="text-stone-600">Ask follow-ups. Change your mind. Say "something cheaper" or "more full-bodied." She keeps up.</p>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Is this free?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Yes. Free during BETA. Hit play and start talking.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  What wines do you have?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Over 500 wines and growing. Investment-grade Bordeaux, legendary vintages, First Growths, and Grand Cru Classé. Ask Aionysus—she'll tell you what's available.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Can I actually buy wine here?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Not yet—this is a demo. We're building the purchasing experience. For now, Aionysus helps you discover and learn. When you find something you want, she'll connect you to our team.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Enterprise or API access?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Sure. Drop us a line at <a href="mailto:hello@aionysus.wine" className="text-wine-600 hover:underline">hello@aionysus.wine</a></p>
              </details>
            </div>
          </div>
        </section>

        {/* Your Journey with Our AI Sommelier - SEO Section */}
        <section className="py-24 bg-gradient-to-b from-white to-stone-50 border-t border-stone-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-4">
              Your Journey with Aionysus
            </h2>
            <p className="text-stone-600 text-center max-w-2xl mx-auto mb-16">
              From first sip to last drop, our AI sommelier guides you through every step of discovering exceptional wine.
            </p>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-wine-200 -translate-x-1/2"></div>

              <div className="space-y-12 md:space-y-0">
                {/* Step 1 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-wine-600 font-mono text-sm mb-2">01</span>
                    <h3 className="font-bold text-stone-900 text-xl mb-2">Search</h3>
                    <p className="text-stone-600">Tell our AI wine taster what you're looking for. Budget, occasion, food pairing, or investment goal—speak naturally, and Aionysus understands.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-12 h-12 bg-wine-100 rounded-full flex items-center justify-center text-2xl">🔍</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="hidden md:flex items-center justify-end pr-12">
                    <div className="w-12 h-12 bg-wine-100 rounded-full flex items-center justify-center text-2xl">💡</div>
                  </div>
                  <div className="md:pl-12">
                    <span className="inline-block text-wine-600 font-mono text-sm mb-2">02</span>
                    <h3 className="font-bold text-stone-900 text-xl mb-2">Advise</h3>
                    <p className="text-stone-600">Your AI sommelier analyses 500+ wines instantly. She considers vintage, classification, drinking window, and investment potential to find your perfect match.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-wine-600 font-mono text-sm mb-2">03</span>
                    <h3 className="font-bold text-stone-900 text-xl mb-2">Select</h3>
                    <p className="text-stone-600">Receive one expert recommendation at a time—complete with tasting notes, food pairings, critic scores, and real pricing. No walls of bottles to scroll through.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-12 h-12 bg-wine-100 rounded-full flex items-center justify-center text-2xl">🍷</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center md:mb-16">
                  <div className="hidden md:flex items-center justify-end pr-12">
                    <div className="w-12 h-12 bg-wine-100 rounded-full flex items-center justify-center text-2xl">🛒</div>
                  </div>
                  <div className="md:pl-12">
                    <span className="inline-block text-wine-600 font-mono text-sm mb-2">04</span>
                    <h3 className="font-bold text-stone-900 text-xl mb-2">Checkout</h3>
                    <p className="text-stone-600">Add to cart and complete your purchase. Case discounts, trade pricing, and delivery handled seamlessly. Collecting or investing—we've got you covered.</p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                  <div className="md:text-right md:pr-12">
                    <span className="inline-block text-wine-600 font-mono text-sm mb-2">05</span>
                    <h3 className="font-bold text-stone-900 text-xl mb-2">Enjoy</h3>
                    <p className="text-stone-600">Savour a perfectly chosen bottle. Whether it's a Tuesday night treat or a milestone celebration, your AI wine taster helped you find something special.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-start pl-12">
                    <div className="w-12 h-12 bg-wine-100 rounded-full flex items-center justify-center text-2xl">✨</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA text */}
            <p className="text-center text-stone-500 mt-16 max-w-xl mx-auto">
              Aionysus combines the expertise of a master sommelier with the convenience of AI. Whether you're new to wine or a seasoned collector, our AI sommelier and AI wine taster is ready to help you discover your next favourite bottle.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
