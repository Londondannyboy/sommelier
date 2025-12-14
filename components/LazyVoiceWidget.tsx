'use client'

import dynamic from 'next/dynamic'

// Lazy load VoiceWidget - heavy component with Hume SDK
const VoiceWidget = dynamic(
  () => import('@/components/VoiceWidget').then(mod => mod.VoiceWidget),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <p className="text-8xl md:text-9xl font-serif font-bold text-stone-900 tracking-tight">
            Sofia
          </p>
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-stone-200 animate-pulse" />
          <div className="flex items-center gap-[2px] h-12 w-64">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-stone-200"
                style={{ height: `${20 + Math.sin(i * 0.5) * 15}%` }}
              />
            ))}
          </div>
        </div>
        <p className="text-stone-500 text-lg mb-8">Loading voice assistant...</p>
      </div>
    ),
  }
)

export function LazyVoiceWidget() {
  return <VoiceWidget />
}
