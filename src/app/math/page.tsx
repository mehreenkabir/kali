// FILE: app/math/page.tsx
'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const MathPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-mario-blue">
      <Header theme="light" />

      <main className="flex-grow flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 xs:pb-18 sm:pb-20 md:pb-24">
        <div 
          className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl aspect-video crisp-edges border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8"
          style={{ backgroundImage: "url('/assets/math/start-screen-bg.png')" }}
        >
          <div className="relative w-[60%] xs:w-[65%] sm:w-[70%] h-[50%] xs:h-[55%] sm:h-[60%] md:h-[70%] mb-6 xs:mb-8 sm:mb-10 md:mb-12 fade-in-up">
            <Image
              src="/assets/math/kaliania-math-logo.png"
              alt="Kalianïa Math Logo"
              layout="fill"
              objectFit="contain"
              priority
              className="crisp-edges"
            />
          </div>

          <Link 
            href="/math/world-map"
            className="pixel-button animate-pulse p-2 xs:p-3 sm:p-4 focus-ring text-center"
            style={{ animationDuration: '1.5s' }}
            aria-label="Start Math Odyssey"
          >
            <span className="sr-only">Begin your math adventure</span>
            <span className="text-sm xs:text-lg sm:text-xl md:text-2xl text-white text-outline-lg">
              PRESS START
            </span>
          </Link>
        </div>
      </main>

      <GlobalFooter theme="light" />
    </div>
  );
};

export default MathPage;