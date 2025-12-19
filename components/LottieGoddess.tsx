'use client';

import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieGoddessProps {
  isPlaying?: boolean;
  animationData?: object;
  // For file-based loading
  animationPath?: string;
}

export default function LottieGoddess({
  isPlaying = false,
  animationData: providedAnimationData,
  animationPath = '/animations/goddess.json'
}: LottieGoddessProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<object | null>(providedAnimationData || null);
  const [loading, setLoading] = useState(!providedAnimationData);
  const [error, setError] = useState<string | null>(null);

  // Load animation from path if not provided directly
  useEffect(() => {
    if (providedAnimationData) {
      setAnimationData(providedAnimationData);
      setLoading(false);
      return;
    }

    async function loadAnimation() {
      try {
        const response = await fetch(animationPath);
        if (!response.ok) throw new Error('Failed to load animation');
        const data = await response.json();
        setAnimationData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading Lottie animation:', err);
        setError('Animation not found');
        setLoading(false);
      }
    }

    loadAnimation();
  }, [animationPath, providedAnimationData]);

  // Control animation playback based on isPlaying
  useEffect(() => {
    if (!lottieRef.current) return;

    if (isPlaying) {
      // Play the animation when speaking
      lottieRef.current.play();
      // Play faster when speaking
      lottieRef.current.setSpeed(1.5);
    } else {
      // Play slowly (idle animation)
      lottieRef.current.setSpeed(0.3);
    }
  }, [isPlaying]);

  if (loading) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <p className="text-gold-500/50 text-sm">{error || 'No animation'}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Glow effect behind the animation */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isPlaying
            ? 'bg-gradient-radial from-gold-500/40 via-gold-500/15 to-transparent blur-2xl scale-125'
            : 'bg-gradient-radial from-gold-500/15 via-transparent to-transparent blur-xl'
        }`}
      />

      {/* Breathing scale effect */}
      <div
        className={`relative w-full h-full transition-transform duration-300 ${
          isPlaying ? 'animate-[speaking-breathe_1s_ease-in-out_infinite]' : ''
        }`}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
          autoplay={true}
          className="w-full h-full"
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid slice'
          }}
        />
      </div>

      {/* Speaking indicator rings */}
      {isPlaying && (
        <>
          <div className="absolute inset-0 rounded-full border border-gold-500/30 animate-[speaking-ring_2s_ease-out_infinite]" />
          <div className="absolute inset-0 rounded-full border border-gold-400/20 animate-[speaking-ring_2s_ease-out_0.5s_infinite]" />
        </>
      )}
    </div>
  );
}
