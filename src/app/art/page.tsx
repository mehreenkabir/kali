'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';
import React, { useRef } from 'react';
import { useMouseTracking } from '@/hooks/useMouseTracking';
import { PORTFOLIO_IMAGES } from '@/utils/constants';
import { generateKey } from '@/utils/helpers';

const ArtPage: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Use custom hook for mouse tracking
  useMouseTracking(canvasRef);

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-atelier-dark custom-cursor">
      {/* Hidden Art Collage Layer */}
      <div className="absolute inset-0 z-0 grid grid-cols-2 grid-rows-2">
        {PORTFOLIO_IMAGES.map((imageSrc, index) => (
          <div
            key={generateKey('portfolio', index)}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
            role="img"
            aria-label={`Portfolio artwork ${index + 1}`}
          />
        ))}
      </div>

      {/* Interactive Canvas Mask Layer */}
      <div 
        ref={canvasRef} 
        className="absolute inset-0 z-10 bg-atelier-dark canvas-mask"
        aria-hidden="true"
      />

      <Header theme="dark" />

      <main className="relative z-20 flex-grow flex items-center justify-center text-center p-4 xs:p-6 sm:p-8 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-24 sm:pb-28 md:pb-32">
        <div className="max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl px-4">
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 xs:mb-5 sm:mb-6 text-glow">
            Let's Create Something Beautiful.
          </h1>

          <p className="font-dreamy text-lg xs:text-xl sm:text-2xl md:text-3xl text-white/80 leading-relaxed xs:leading-relaxed sm:leading-loose mb-8 xs:mb-10 sm:mb-12 px-2">
            My art is a conversation. My code is a craft.
            <br className="hidden sm:block" />
            This space is an invitation to build a digital world
            <br className="hidden sm:block" />
            that feels as true and alive as your own soul.
          </p>

          <Link
            href="/contact"
            className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white font-serif tracking-widest uppercase px-8 xs:px-10 sm:px-12 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base rounded-full transition-all duration-300 hover:bg-white/40 hover:scale-105 hover:shadow-2xl button-glow"
            aria-label="Begin collaboration"
          >
            Begin a Collaboration
          </Link>
        </div>
      </main>

      <GlobalFooter theme="dark" />
    </div>
  );
};

export default ArtPage;