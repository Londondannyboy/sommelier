'use client'

import { useState, useCallback, useEffect } from 'react'
import { VoiceProvider, useVoice } from '@humeai/voice-react'
import { useUser } from '@stackframe/stack'
import Link from 'next/link'

const SOMMELIER_PROMPT = `You are Sofia, an expert sommelier and wine advisor. Your role is to help people discover wines they'll love, understand food pairings, and learn about wine in an approachable, friendly way.

Key behaviors:
- Greet warmly and ask what brings them to you today
- Ask about their preferences (red/white/rosé, sweet/dry, budget range)
- Consider the occasion (dinner party, casual evening, special celebration, gift)
- Suggest food pairings when relevant
- Explain wine terms in accessible language
- Be enthusiastic and passionate about wine, but never pretentious

When recommending wines:
- Suggest 2-3 specific wines by name when possible
- Explain WHY each wine suits their needs
- Describe tasting notes they can expect
- Mention the region and grape variety
- Give approximate price ranges

Start by warmly greeting the user and asking how you can help them with wine today.`

// Audio waveform visualization component
function AudioWaveform({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-12 px-4">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className={`w-[2px] bg-stone-300 rounded-full transition-all duration-150 ${
            isActive ? 'animate-pulse' : ''
          }`}
          style={{
            height: isActive
              ? `${Math.random() * 100}%`
              : `${20 + Math.sin(i * 0.5) * 15}%`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  )
}

function VoiceInterface({ accessToken, userId }: { accessToken: string; userId?: string }) {
  const { connect, disconnect, status, messages } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)
  const [waveHeights, setWaveHeights] = useState<number[]>([])

  // Generate random wave heights when connected
  useEffect(() => {
    if (status.value === 'connected') {
      const interval = setInterval(() => {
        setWaveHeights([...Array(40)].map(() => 20 + Math.random() * 80))
      }, 150)
      return () => clearInterval(interval)
    } else {
      setWaveHeights([...Array(40)].map((_, i) => 20 + Math.sin(i * 0.5) * 15))
    }
  }, [status.value])

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: '606a18be-4c8e-4877-8fb4-52665831b33d',
        sessionSettings: {
          type: 'session_settings',
          systemPrompt: SOMMELIER_PROMPT,
          ...(userId && { variables: { user_id: userId } }),
        },
      })
    } catch (error) {
      console.error('Failed to connect:', error)
    }
    setIsConnecting(false)
  }, [connect, accessToken, userId])

  const handleDisconnect = useCallback(() => {
    disconnect()
  }, [disconnect])

  const isConnected = status.value === 'connected'
  const isError = status.value === 'error'

  return (
    <div className="flex flex-col items-center">
      {/* Sofia name with wine glass */}
      <div className="mb-8">
        <h2 className="text-8xl md:text-9xl font-serif font-bold text-stone-900 tracking-tight">
          Sofia
        </h2>
      </div>

      {/* Play button with waveform */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isConnected
              ? 'bg-wine-600 hover:bg-wine-700'
              : 'bg-stone-900 hover:bg-stone-800'
          } ${isConnecting ? 'opacity-50' : ''}`}
          aria-label={isConnected ? "Stop conversation" : "Start conversation with Sofia"}
        >
          {isConnecting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isConnected ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div className="flex items-center gap-[2px] h-12 w-64">
          {waveHeights.map((height, i) => (
            <div
              key={i}
              className={`w-[3px] rounded-full transition-all duration-100 ${
                isConnected ? 'bg-wine-400' : 'bg-stone-300'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-stone-500 text-lg mb-16">
        {isConnected
          ? "I'm listening — ask me anything about wine."
          : isError
          ? "Connection error — tap to try again."
          : "Want wine advice? Hit play — I'll help."}
      </p>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="w-full max-w-2xl bg-stone-50 rounded-2xl p-6 max-h-64 overflow-y-auto mb-12">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.type === 'user_message'
                      ? 'bg-wine-600 text-white'
                      : 'bg-white border border-stone-200 text-stone-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {msg.type === 'user_message' && msg.message?.content}
                    {msg.type === 'assistant_message' && msg.message?.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const user = useUser()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getAccessToken() {
      try {
        const response = await fetch('/api/hume-token')
        if (!response.ok) throw new Error('Failed to get access token')
        const data = await response.json()
        setAccessToken(data.accessToken)
      } catch (err) {
        setError('Voice service unavailable. Please try again later.')
        console.error('Error getting Hume token:', err)
      }
    }
    getAccessToken()
  }, [])

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍷</span>
              <span className="font-bold text-xl text-stone-900">Sommelier<span className="text-wine-600">AI</span></span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-stone-600 hover:text-stone-900 transition-colors">How it works</a>
              <a href="#for-business" className="text-stone-600 hover:text-stone-900 transition-colors">For Business</a>
              {user ? (
                <span className="text-stone-600">Hi, {user.displayName || 'there'}</span>
              ) : (
                <Link href="/handler/sign-in" className="text-stone-600 hover:text-stone-900 transition-colors">Sign in</Link>
              )}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              {!user && (
                <Link
                  href="/handler/sign-up"
                  className="hidden sm:inline-flex bg-wine-600 text-white font-medium px-5 py-2.5 rounded-full hover:bg-wine-700 transition-colors"
                >
                  Sign up free
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-4 pt-16 pb-20">
        {error ? (
          <div className="text-center py-20">
            <p className="text-stone-500">{error}</p>
          </div>
        ) : !accessToken ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-2 border-stone-200 border-t-wine-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500">Loading Sofia...</p>
          </div>
        ) : (
          <VoiceProvider>
            <VoiceInterface accessToken={accessToken} userId={user?.id} />
          </VoiceProvider>
        )}

        {/* Main headline */}
        <div className="text-center mt-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight mb-6">
            Never pick the wrong<br />wine again
          </h1>

          <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10 leading-relaxed">
            I'll listen to what you want and recommend the perfect wine for any occasion.
            I know thousands of wines from regions worldwide, food pairings, and can work within any budget. 🍷
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); document.querySelector('button')?.click() }}
              className="inline-flex items-center justify-center bg-wine-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-wine-600 transition-colors text-lg"
            >
              Ask about wine
            </a>
            <a
              href="#for-business"
              className="inline-flex items-center justify-center bg-stone-900 text-white font-semibold px-8 py-4 rounded-lg hover:bg-stone-800 transition-colors text-lg"
            >
              For Businesses
            </a>
          </div>
        </div>
      </main>

      {/* How it works */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-16">
            How Sofia works
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Hit play",
                description: "Tap the play button to start a voice conversation with Sofia, your AI sommelier."
              },
              {
                step: "2",
                title: "Tell me what you need",
                description: "Describe the occasion, your taste preferences, budget, or what you're eating."
              },
              {
                step: "3",
                title: "Get recommendations",
                description: "I'll suggest specific wines with tasting notes, prices, and where to find them."
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-wine-100 text-wine-700 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-stone-900 text-xl mb-3">{item.title}</h3>
                <p className="text-stone-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Sofia knows */}
      <section className="py-24 bg-[#faf9f7]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-6">
            What is Sommelier AI?
          </h2>
          <p className="text-lg text-stone-500 text-center max-w-2xl mx-auto mb-16">
            Sommelier AI is an artificial intelligence wine advisor. Like having a professional sommelier in your pocket — available 24/7, with knowledge of thousands of wines worldwide.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🍷", title: "Wine recommendations", desc: "Red, white, rosé, sparkling — I know them all and can match to your taste." },
              { icon: "🍽️", title: "Food pairings", desc: "Tell me what you're eating and I'll find the perfect wine match." },
              { icon: "💰", title: "Any budget", desc: "From everyday bottles under $15 to special occasion splurges." },
              { icon: "🌍", title: "Every region", desc: "Bordeaux, Napa, Tuscany, Marlborough — I know wines from everywhere." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-stone-100">
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{item.title}</h3>
                <p className="text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Business */}
      <section id="for-business" className="py-24 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Sommelier AI for Business
          </h2>
          <p className="text-lg text-stone-300 max-w-xl mx-auto mb-10">
            Restaurants, wine retailers, and hospitality businesses — integrate Sofia into your customer experience. Help your guests find the perfect wine, every time.
          </p>

          <a
            href="mailto:hello@sommelier.quest?subject=Sommelier AI for Business"
            className="inline-flex items-center justify-center bg-white text-stone-900 font-semibold px-8 py-4 rounded-lg hover:bg-stone-100 transition-colors text-lg"
          >
            Contact us for Enterprise
          </a>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-stone-400 text-sm">Always on</p>
            </div>
            <div>
              <p className="text-3xl font-bold">API</p>
              <p className="text-stone-400 text-sm">Easy integration</p>
            </div>
            <div>
              <p className="text-3xl font-bold">1000s</p>
              <p className="text-stone-400 text-sm">Wines</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#faf9f7]">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 text-center mb-12">
            Questions
          </h2>

          <div className="space-y-4">
            {[
              { q: "Is Sommelier AI free?", a: "Yes! Start using Sofia immediately at no cost. Sign in to save your preferences." },
              { q: "How accurate are the recommendations?", a: "Sofia is trained on professional sommelier knowledge covering thousands of wines. Recommendations consider your taste, budget, and occasion." },
              { q: "What is an AI sommelier?", a: "An AI sommelier uses artificial intelligence to provide personalized wine recommendations through natural conversation — like having a wine expert on demand." },
              { q: "Can businesses integrate Sommelier AI?", a: "Absolutely. Contact us for API access and custom enterprise solutions." },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-xl border border-stone-100 group">
                <summary className="px-6 py-4 cursor-pointer font-medium text-stone-900 flex justify-between items-center">
                  {item.q}
                  <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-6 pb-4 text-stone-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍷</span>
              <span className="font-bold text-xl text-stone-900">Sommelier<span className="text-wine-600">AI</span></span>
            </div>

            <div className="flex gap-6 text-sm text-stone-500">
              <span>Wine Recommendations</span>
              <span>•</span>
              <span>Food Pairings</span>
              <span>•</span>
              <span>Enterprise</span>
            </div>
          </div>

          <p className="text-center text-stone-400 text-xs mt-8">
            © {new Date().getFullYear()} Sommelier AI. Drink responsibly.
          </p>
        </div>
      </footer>
    </div>
  )
}
