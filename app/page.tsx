import Link from 'next/link'
import { LazyVoiceWidget } from '@/components/LazyVoiceWidget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf9f7] via-white to-[#fef7f0]">
      {/* BETA Badge */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-stone-900 to-stone-800 text-white px-4 py-2 rounded-full text-xs font-mono tracking-wider border border-stone-700 shadow-lg">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        BETA — DEMO DATABASE
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍷%3C/text%3E%3C/svg%3E"
                alt="Sommelier AI wine glass logo"
                width="32"
                height="32"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-stone-900">Sommelier<span className="text-wine-600">Quest</span></span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-sommelier-ai-works" className="text-stone-600 hover:text-stone-900 transition-colors">How it works</a>
              <a href="#sommelier-ai-for-business" className="text-stone-600 hover:text-stone-900 transition-colors">For Business</a>
              <Link href="/handler/sign-in" className="text-stone-600 hover:text-stone-900 transition-colors">Sign in</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/handler/sign-up"
                className="hidden sm:inline-flex bg-wine-600 text-white font-medium px-5 py-2.5 rounded-full hover:bg-wine-700 transition-colors"
              >
                Sign in to beta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-16">
          {/* Voice Widget - Lazy loaded */}
          <LazyVoiceWidget />

          {/* Main headline */}
          <div className="text-center mt-12">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-stone-900 leading-tight mb-8">
              Meet Dionysus
            </h2>

            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Your AI sommelier for premium wine recommendations, corporate events, and large-scale ordering.
            </p>

            <p className="text-base text-stone-500 max-w-xl mx-auto mb-12 italic">
              Connected to partner wine databases • Powered by conversational AI • Built for business
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center bg-wine-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-wine-800 transition-colors text-lg shadow-lg hover:shadow-xl"
              >
                Start Conversation with Dionysus
              </a>
              <a
                href="#sommelier-ai-for-business"
                className="inline-flex items-center justify-center border-2 border-wine-700 text-wine-700 font-semibold px-8 py-4 rounded-lg hover:bg-wine-50 transition-colors text-lg"
              >
                For Business & Events
              </a>
            </div>
          </div>
        </section>

        {/* How Dionysus Works */}
        <section id="how-sommelier-ai-works" className="bg-gradient-to-b from-white to-stone-50 py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-6">
              How Dionysus Works
            </h2>
            <p className="text-lg text-stone-600 text-center max-w-2xl mx-auto mb-16">
              Conversational AI meets premium wine curation. Describe your needs and receive intelligent, personalized recommendations from partner wine databases.
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">1</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Start Conversation</h3>
                <p className="text-stone-600 leading-relaxed">Hit play to begin speaking with Dionysus, your AI wine expert. For business inquiries, he'll immediately ask about your event or bulk order needs.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">2</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Describe Your Needs</h3>
                <p className="text-stone-600 leading-relaxed">Tell Dionysus about your event size, budget, food pairings, or corporate requirements. Natural conversation at its finest.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-200 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-md">3</div>
                <h3 className="font-bold text-stone-900 text-lg mb-3">Receive Recommendations</h3>
                <p className="text-stone-600 leading-relaxed">Premium selections with tasting notes, pairings, and scalable ordering options. All from connected partner databases.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Dionysus */}
        <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-6">
              About Dionysus
            </h2>
            <p className="text-lg text-stone-600 text-center max-w-2xl mx-auto mb-8">
              Dionysus is an AI sommelier built for modern wine discovery. Unlike traditional wine lists, Dionysus engages in natural conversation to understand your needs—whether you're selecting a bottle for dinner or sourcing 500 bottles for a corporate gala.
            </p>
            <p className="text-lg text-stone-600 text-center max-w-2xl mx-auto mb-4">
              <span className="font-semibold">Now in BETA:</span> Dionysus draws from curated partner wine databases, not a proprietary collection. This approach gives you access to premium selections worldwide while maintaining database freshness and accuracy.
            </p>
            <p className="text-base text-stone-500 text-center max-w-2xl mx-auto">
              Perfect for individual wine lovers, restaurants, corporate events, wine programs, and bulk ordering. Available 24/7, always ready to help.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍷%3C/text%3E%3C/svg%3E"
                  alt="Premium wine recommendations icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Premium Wine Curation</h3>
                <p className="text-stone-600">Dionysus understands red, white, rosé, and sparkling selections from every major region. Get personalized recommendations matched to your taste, occasion, and budget—from £12 everyday bottles to £500+ investments.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍽️%3C/text%3E%3C/svg%3E"
                  alt="Food pairing icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Expert Food Pairing</h3>
                <p className="text-stone-600">Tell Dionysus what you're serving—from casual weeknight dinners to multi-course galas. He delivers perfect wine matches with sommelier-level expertise for every scenario.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E📦%3C/text%3E%3C/svg%3E"
                  alt="Bulk ordering icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Bulk & B2B Ordering</h3>
                <p className="text-stone-600">Sourcing wine for 50 guests? 500? Dionysus scales with you, offering corporate pricing, bulk logistics support, and curated wine programs for restaurants and hospitality.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🌍%3C/text%3E%3C/svg%3E"
                  alt="Global wine access icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Global Wine Access</h3>
                <p className="text-stone-600">Curated access to premium wines from partner databases worldwide. From iconic Bordeaux to emerging boutique regions, discover wines beyond what's on your local shelf.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Dionysus for Enterprise */}
        <section id="sommelier-ai-for-business" className="py-24 bg-gradient-to-b from-white to-stone-50 border-y border-stone-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-stone-900">
              Dionysus for Enterprise
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
              Restaurants seeking sommelier recommendations. Wine retailers wanting a competitive edge. Hotels, venues, and corporate event teams planning sophisticated gatherings. Dionysus integrates seamlessly into your customer experience.
            </p>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10">
              We offer API access, custom integrations, white-label solutions, and dedicated enterprise support. Connect to partner wine databases, scale ordering infrastructure, and delight your clients with AI-powered wine expertise.
            </p>

            <a
              href="mailto:hello@sommelier.quest?subject=Dionysus Enterprise Inquiry"
              className="inline-flex items-center justify-center bg-wine-700 text-white font-semibold px-10 py-4 rounded-lg hover:bg-wine-800 transition-colors text-lg shadow-lg hover:shadow-xl"
            >
              Inquire About Enterprise Solutions
            </a>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="p-4 bg-white rounded-lg border border-stone-100">
                <p className="text-3xl font-bold text-wine-600">24/7</p>
                <p className="text-stone-600 text-sm mt-1">Always Available</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-stone-100">
                <p className="text-3xl font-bold text-wine-600">API</p>
                <p className="text-stone-600 text-sm mt-1">Full Integration</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-stone-100">
                <p className="text-3xl font-bold text-wine-600">Global</p>
                <p className="text-stone-600 text-sm mt-1">Partner Databases</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dionysus FAQ */}
        <section className="py-24 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Is Dionysus really free to use?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Yes. Dionysus is free for individuals and organizations during the BETA period. Start conversing immediately by hitting play above. Sign in to save preferences and conversation history. Enterprise SLAs and premium support are available for business customers—contact us for details.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Is this really a demo? What about the database?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Yes, we're in BETA. Dionysus is powered by curated partner wine databases, not a proprietary collection. This gives you access to real, up-to-date wine selections worldwide. As we mature, we'll integrate additional partners and expand the selection. Recommendations are based on real, available wines.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  How accurate are Dionysus's recommendations?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Dionysus draws on sommelier knowledge spanning thousands of wines from major regions worldwide. Recommendations consider your taste preferences, budget, occasion, event size, and food pairings to deliver expert-level suggestions. The AI continuously learns and improves.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  Can my restaurant/business use Dionysus?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Absolutely. Restaurants, wine retailers, hotels, event venues, and corporates can integrate Dionysus via API, custom integrations, or white-label solutions. We offer dedicated enterprise support, SLAs, and bulk ordering infrastructure. Email us to explore options.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group shadow-sm">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-stone-900 flex justify-between items-center hover:text-wine-600">
                  What if I want to place a large order?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-600">Tell Dionysus your event size, quantity, and requirements when you start a conversation. He'll provide recommendations at scale, connect you to wholesale pricing, and coordinate with our partner fulfillment network. Reach out to our team for enterprise-scale logistics.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-stone-50 border-t border-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍷%3C/text%3E%3C/svg%3E"
                alt="SommelierQuest logo"
                width="32"
                height="32"
                className="w-8 h-8"
              />
              <span className="font-bold text-lg text-stone-900">Sommelier<span className="text-wine-600">Quest</span></span>
            </div>

            <nav className="flex gap-6 text-sm text-stone-600 flex-wrap justify-center">
              <a href="#how-sommelier-ai-works" className="hover:text-wine-600 transition-colors">How It Works</a>
              <span className="text-stone-300">•</span>
              <a href="#sommelier-ai-for-business" className="hover:text-wine-600 transition-colors">Enterprise</a>
              <span className="text-stone-300">•</span>
              <a href="mailto:hello@sommelier.quest" className="hover:text-wine-600 transition-colors">Contact</a>
            </nav>
          </div>

          <div className="border-t border-stone-200 pt-8">
            <p className="text-center text-stone-600 text-xs">
              © {new Date().getFullYear()} SommelierQuest. AI Sommelier Powered by Dionysus • Partner Database Connected • BETA.<br />
              <span className="text-stone-500">Drink responsibly. For consumers of legal drinking age only.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
