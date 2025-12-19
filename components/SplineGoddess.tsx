'use client';

import { Suspense, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';

interface SplineGoddessProps {
  isPlaying?: boolean;
  sceneUrl?: string;
}

export default function SplineGoddess({
  isPlaying = false,
  // Default to a placeholder - replace with your own Spline scene URL
  sceneUrl = 'https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode'
}: SplineGoddessProps) {
  const splineRef = useRef<Application | null>(null);

  // Handle Spline scene load
  const onLoad = (spline: Application) => {
    splineRef.current = spline;

    // You can find objects in your scene by name and control them
    // Example: const goddess = spline.findObjectByName('Goddess');

    console.log('Spline scene loaded');
  };

  // React to isPlaying state changes
  useEffect(() => {
    if (!splineRef.current) return;

    // Control your Spline animation based on isPlaying
    // Options depend on how you set up your Spline scene:

    // Option 1: Trigger an event/state in Spline
    // splineRef.current.emitEvent('mouseDown', 'Goddess');

    // Option 2: Control a variable in Spline
    // splineRef.current.setVariable('isSpeaking', isPlaying);

    // Option 3: Find and animate an object directly
    // const goddess = splineRef.current.findObjectByName('Goddess');
    // if (goddess) {
    //   goddess.scale.x = isPlaying ? 1.05 : 1;
    //   goddess.scale.y = isPlaying ? 1.05 : 1;
    // }

    console.log('Spline goddess speaking:', isPlaying);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full">
      {/* Glow effect behind the 3D scene */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isPlaying
            ? 'bg-gradient-radial from-gold-500/30 via-gold-500/10 to-transparent blur-xl scale-110'
            : 'bg-gradient-radial from-gold-500/10 via-transparent to-transparent blur-lg'
        }`}
      />

      {/* Spline 3D scene */}
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      }>
        <Spline
          scene={sceneUrl}
          onLoad={onLoad}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
