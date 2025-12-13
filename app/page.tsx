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
- Share interesting stories about wines and regions

When recommending wines:
- Suggest 2-3 specific wines by name when possible
- Explain WHY each wine suits their needs
- Describe tasting notes they can expect (fruits, spices, oak, tannins)
- Mention the region and grape variety
- Give approximate price ranges ($15-25, $30-50, etc.)

Your wine knowledge includes all major regions: Bordeaux, Burgundy, Champagne, Tuscany, Piedmont, Rioja, Napa Valley, and many more.

Start by warmly greeting the user and asking how you can help them with wine today.`

function VoiceInterface({ accessToken, userId }: { accessToken: string; userId?: string }) {
  const { connect, disconnect, status, messages } = useVoice()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = useCallback(async () => {
    setIsConnecting(true)
    try {
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: '606a18be-4c8e-4877-8fb4-52665831b33d',
        sessionSettings: {
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
    <div className="flex flex-col items-center gap-6">
      {/* Voice Button */}
      <div className="relative group">
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          disabled={isConnecting}
          className={`
            relative w-40 h-40 rounded-full flex items-center justify-center
            transition-all duration-500 ease-out
            ${isConnected
              ? 'bg-gradient-to-br from-wine-600 to-wine-800 shadow-2xl shadow-wine-500/40 scale-105'
              : 'bg-gradient-to-br from-wine-700 to-wine-900 shadow-xl hover:shadow-2xl hover:shadow-wine-500/30 hover:scale-105'
            }
            ${isConnecting ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
          `}
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full bg-wine-500 blur-xl transition-opacity duration-500 ${isConnected ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`} />

          {/* Button content */}
          <div className="relative z-10">
            {isConnecting ? (
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isConnected ? (
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse mb-2" />
                <span className="text-white/90 text-sm font-medium">Listening</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <svg className="w-14 h-14 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
                <span className="text-white/80 text-xs">Tap to speak</span>
              </div>
            )}
          </div>
        </button>

        {/* Pulse rings when active */}
        {isConnected && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-wine-400 animate-ping opacity-20" />
            <div className="absolute -inset-2 rounded-full border border-wine-300 animate-pulse opacity-30" />
          </>
        )}
      </div>

      {/* Status */}
      <div className="text-center">
        <p className={`text-lg font-medium ${isError ? 'text-red-600' : 'text-wine-800'}`}>
          {isConnecting && 'Connecting to Sofia...'}
          {isConnected && 'Sofia is listening'}
          {isError && 'Connection error. Please try again.'}
          {!isConnecting && !isConnected && !isError && 'Meet Sofia, your AI sommelier'}
        </p>
        <p className="text-wine-500 text-sm mt-1">
          {isConnected ? 'Ask about wines, pairings, or recommendations' : 'Tap the button to start a conversation'}
        </p>
      </div>

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="w-full max-w-2xl bg-gradient-to-b from-stone-50 to-white rounded-2xl p-6 max-h-80 overflow-y-auto border border-stone-200 shadow-inner">
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    msg.type === 'user_message'
                      ? 'bg-wine-700 text-white rounded-br-md'
                      : 'bg-white border border-stone-200 text-stone-700 rounded-bl-md shadow-sm'
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

      {/* Suggestions */}
      {messages.length === 0 && !isConnected && (
        <div className="w-full max-w-2xl">
          <p className="text-xs font-medium text-wine-400 uppercase tracking-wider mb-3 text-center">Try asking</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "What wine pairs with steak?",
              "Recommend a wine under $30",
              "Tell me about Burgundy",
              "Best wine for a dinner party?",
            ].map((question, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur border border-wine-100 rounded-xl px-4 py-3 text-sm text-wine-600 text-center hover:bg-white hover:border-wine-200 transition-colors cursor-default"
              >
                {question}
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
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wine-900 via-wine-800 to-wine-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="text-xl">&#127863;</span>
            <span className="text-wine-100 text-sm font-medium">AI-Powered Wine Expertise</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Your Personal<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wine-200 to-amber-200">Sommelier AI</span>
          </h1>

          <p className="text-lg text-wine-100/80 max-w-xl mx-auto mb-8">
            Get expert wine recommendations, perfect food pairings, and expand your wine knowledge through natural conversation.
          </p>

          {!user && (
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/handler/sign-in"
                className="inline-flex items-center gap-2 bg-white text-wine-800 font-semibold px-6 py-3 rounded-full hover:bg-wine-50 transition-colors shadow-lg"
              >
                Sign in to save preferences
              </Link>
            </div>
          )}

          {user && (
            <p className="text-wine-200 text-sm">
              Welcome back, {user.displayName || user.primaryEmail}
            </p>
          )}
        </div>
      </div>

      {/* Voice Interface */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 p-8 md:p-12 border border-stone-100">
          {error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-stone-600">{error}</p>
            </div>
          ) : !accessToken ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-3 border-wine-100 border-t-wine-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-wine-600">Preparing your sommelier...</p>
            </div>
          ) : (
            <VoiceProvider>
              <VoiceInterface accessToken={accessToken} userId={user?.id} />
            </VoiceProvider>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-b from-wine-50/50 to-stone-50 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine-900 mb-3">What Sofia Can Help With</h2>
            <p className="text-wine-600">Your AI sommelier is trained on thousands of wines and pairings</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "&#127863;",
                title: "Wine Recommendations",
                description: "Get personalized suggestions based on your taste preferences, occasion, and budget."
              },
              {
                icon: "&#127860;",
                title: "Perfect Pairings",
                description: "Discover which wines complement your meal, from casual dinners to special occasions."
              },
              {
                icon: "&#127758;",
                title: "Explore Regions",
                description: "Learn about wine regions from Bordeaux to Napa, and discover hidden gems."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md hover:border-wine-100 transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-wine-100 to-wine-50 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                </div>
                <h3 className="font-semibold text-wine-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-wine-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-wine-950 text-wine-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            <span className="text-xl mr-2">&#127863;</span>
            Sommelier AI - Your personal wine expert
          </p>
          <p className="text-wine-400 text-xs mt-2">Drink responsibly. Must be of legal drinking age.</p>
        </div>
      </footer>
    </div>
  )
}
