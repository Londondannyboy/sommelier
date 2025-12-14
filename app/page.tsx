import Link from 'next/link'
import { VoiceWidget } from '@/components/VoiceWidget'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
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
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-12">
          {/* H1 with keyword - visible */}
          <h1 className="text-center text-2xl font-bold text-wine-700 mb-4">
            Sommelier AI - Your Personal AI Wine Expert
          </h1>

          {/* Voice Widget */}
          <VoiceWidget />

          {/* Main headline */}
          <div className="text-center mt-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight mb-6">
              Never pick the wrong<br />wine again
            </h2>

            <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
              SommelierQuest is the best sommelier AI for wine recommendations. Our AI sommelier listens to what you want and recommends the perfect wine for any occasion, food pairing, or budget.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center bg-wine-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-wine-800 transition-colors text-lg"
              >
                Ask our Sommelier AI about wine
              </a>
              <a
                href="#sommelier-ai-for-business"
                className="inline-flex items-center justify-center bg-stone-900 text-white font-semibold px-8 py-4 rounded-lg hover:bg-stone-800 transition-colors text-lg"
              >
                Sommelier AI for Business
              </a>
            </div>
          </div>
        </section>

        {/* How Sommelier AI Works */}
        <section id="how-sommelier-ai-works" className="bg-white py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-6">
              How Our Sommelier AI Works
            </h2>
            <p className="text-lg text-stone-500 text-center max-w-2xl mx-auto mb-16">
              SommelierQuest uses advanced sommelier AI technology to provide personalized wine recommendations through natural voice conversation. Our AI sommelier is trained on thousands of wines.
            </p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-wine-100 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-bold text-stone-900 text-xl mb-3">Start the Sommelier AI</h3>
                <p className="text-stone-500 leading-relaxed">Tap the play button to begin a voice conversation with Sofia, our sommelier AI assistant and personal wine expert.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-wine-100 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-bold text-stone-900 text-xl mb-3">Tell the Sommelier AI your needs</h3>
                <p className="text-stone-500 leading-relaxed">Describe the occasion, your taste preferences, budget, or what food you are eating. The sommelier AI understands natural conversation.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-wine-100 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-bold text-stone-900 text-xl mb-3">Get Sommelier AI recommendations</h3>
                <p className="text-stone-500 leading-relaxed">Our sommelier AI suggests specific wines with tasting notes, prices, and food pairing suggestions tailored to you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Sommelier AI */}
        <section className="py-24 bg-[#faf9f7]">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-6">
              What is Sommelier AI?
            </h2>
            <p className="text-lg text-stone-500 text-center max-w-2xl mx-auto mb-8">
              Sommelier AI is an artificial intelligence wine advisor that provides expert-level wine recommendations through natural voice conversation. SommelierQuest brings you the best sommelier AI technology - like having a professional sommelier in your pocket, available 24/7.
            </p>
            <p className="text-lg text-stone-500 text-center max-w-2xl mx-auto mb-16">
              Whether you are looking for wine recommendations for a dinner party, trying to find the perfect wine pairing for steak, or want to learn about wine regions, our sommelier AI can help. SommelierQuest makes expert AI sommelier advice accessible to everyone, completely free.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <article className="bg-white rounded-xl p-6 border border-stone-100">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍷%3C/text%3E%3C/svg%3E"
                  alt="Sommelier AI wine recommendations icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Sommelier AI Wine Recommendations</h3>
                <p className="text-stone-500">Our sommelier AI knows red wine, white wine, rosé, and sparkling wines from every major wine region. Get personalized AI sommelier recommendations matched to your taste.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍽️%3C/text%3E%3C/svg%3E"
                  alt="Sommelier AI food pairing icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Sommelier AI Food Pairings</h3>
                <p className="text-stone-500">Tell our sommelier AI what you are eating and get the perfect wine match. The AI sommelier understands food and wine pairing from classic to creative combinations.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E💰%3C/text%3E%3C/svg%3E"
                  alt="Sommelier AI budget wine icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Sommelier AI for Any Budget</h3>
                <p className="text-stone-500">Our sommelier AI recommends wines at every price point. From everyday bottles under £15 to special occasion splurges, the AI sommelier finds great wines within your budget.</p>
              </article>
              <article className="bg-white rounded-xl p-6 border border-stone-100">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🌍%3C/text%3E%3C/svg%3E"
                  alt="Sommelier AI wine regions icon"
                  width="48"
                  height="48"
                  className="w-12 h-12 mb-4"
                />
                <h3 className="font-bold text-stone-900 text-lg mb-2">Sommelier AI Wine Education</h3>
                <p className="text-stone-500">Our sommelier AI teaches you about wine regions including Bordeaux, Burgundy, Napa Valley, and Tuscany. Learn about grape varieties, tasting notes, and wine terminology with our AI sommelier.</p>
              </article>
            </div>
          </div>
        </section>

        {/* Sommelier AI for Business */}
        <section id="sommelier-ai-for-business" className="py-24 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Sommelier AI for Business
            </h2>
            <p className="text-lg text-gray-200 max-w-xl mx-auto mb-6">
              Restaurants, wine retailers, and hospitality businesses can integrate our sommelier AI into their customer experience. Help your guests find the perfect wine with SommelierQuest sommelier AI technology.
            </p>
            <p className="text-lg text-gray-200 max-w-xl mx-auto mb-10">
              SommelierQuest offers enterprise sommelier AI solutions including API access, custom integrations, and white-label AI sommelier products. Contact us to learn how our sommelier AI can enhance your business.
            </p>

            <a
              href="mailto:hello@sommelier.quest?subject=Sommelier AI for Business Inquiry"
              className="inline-flex items-center justify-center bg-white text-stone-900 font-semibold px-8 py-4 rounded-lg hover:bg-stone-100 transition-colors text-lg"
            >
              Contact Us About Sommelier AI Enterprise
            </a>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-gray-300 text-sm">Sommelier AI Always On</p>
              </div>
              <div>
                <p className="text-3xl font-bold">API</p>
                <p className="text-gray-300 text-sm">Sommelier AI Integration</p>
              </div>
              <div>
                <p className="text-3xl font-bold">1000s</p>
                <p className="text-gray-300 text-sm">Wines in Sommelier AI</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sommelier AI FAQ */}
        <section className="py-24 bg-[#faf9f7]">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-12">
              Sommelier AI FAQ
            </h2>

            <div className="space-y-4">
              <details className="bg-white rounded-xl border border-stone-100 group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-stone-900 flex justify-between items-center">
                  Is the Sommelier AI free to use?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-500">Yes, our sommelier AI is completely free to use. Start using the SommelierQuest sommelier AI immediately by tapping the play button above. Sign in to save your preferences and get even more personalized AI sommelier recommendations over time.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-stone-900 flex justify-between items-center">
                  How accurate is the Sommelier AI?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-500">Our sommelier AI is trained on professional sommelier knowledge covering thousands of wines from wine regions worldwide. The AI sommelier recommendations consider your taste preferences, budget, occasion, and food pairings to provide relevant, expert-level wine suggestions.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-stone-900 flex justify-between items-center">
                  What is Sommelier AI?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-500">Sommelier AI is an artificial intelligence sommelier that uses advanced AI technology to provide personalized wine recommendations through natural voice conversation. SommelierQuest brings you the best sommelier AI - like having a professional sommelier available on demand to help you discover wines you will love.</p>
              </details>
              <details className="bg-white rounded-xl border border-stone-100 group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-stone-900 flex justify-between items-center">
                  Can businesses integrate the Sommelier AI?
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-500">Absolutely. SommelierQuest offers enterprise sommelier AI solutions for restaurants, wine retailers, and hospitality businesses. Contact us for sommelier AI API access, custom integrations, and white-label AI sommelier products tailored to your business needs.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🍷%3C/text%3E%3C/svg%3E"
                alt="Sommelier AI logo"
                width="32"
                height="32"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-stone-900">Sommelier<span className="text-wine-600">Quest</span></span>
            </div>

            <nav className="flex gap-6 text-sm text-stone-600">
              <span>Sommelier AI Wine Recommendations</span>
              <span>•</span>
              <span>Sommelier AI Food Pairings</span>
              <span>•</span>
              <span>Sommelier AI Enterprise</span>
            </nav>
          </div>

          <p className="text-center text-stone-600 text-xs mt-8">
            © {new Date().getFullYear()} SommelierQuest - The Best Sommelier AI. All rights reserved. Drink responsibly.
          </p>
        </div>
      </footer>
    </div>
  )
}
