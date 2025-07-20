'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';
import React from 'react';

// In YogaPage.tsx
export default function YogaPage() {
  return (
    <div className="min-h-screen flex flex-col pastel-dream-gradient text-slate-800">

      <Header />

      <main className="flex-grow">
        {/*
          A single, full-screen section to create a focused, immersive experience.
          'flex items-center justify-center' vertically and horizontally centers the content block.
          Added proper bottom padding for footer clearance on all screen sizes.
        */}
        <section className="min-h-full flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 py-16 xs:py-20 sm:py-24 md:py-32 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-24 sm:pb-28 md:pb-32">
          
          <div className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center flex flex-col items-center">
            
            {/* 
              The Mission Statement.
              Positioned first to set the tone and philosophy before the CTA.
              The margin-bottom creates a deliberate pause before the action.
            */}
            <p className="font-dreamy text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 leading-relaxed xs:leading-relaxed sm:leading-loose px-4 fade-in-up">
              Yoga is not just a practice I learned; it is the rhythm of my soul.
              It is my heritage, my sanctuary, and my offering to you. 
              We move beyond poses into the poetry of presence. 
              Listen the frequency of nature, of compassion, and of the light within.
            </p>

            {/* 
              The Single, Focused Call to Action.
              Now positioned last, it serves as the clear, final step after the user has absorbed the philosophy.
            */}
            <Link
              href="/subscribe" // Points to the subscription page
              className="inline-block bg-white/50 backdrop-blur-md text-slate-700 font-serif tracking-widest uppercase px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-white/80 hover:scale-105 hover:shadow-2xl button-glow fade-in-up animation-delay-400 focus-ring"
              aria-label="Access The Kalianïa Method subscription offerings"
            >
              <span className="sr-only">Access yoga sanctuary subscription</span>
              The Kalianïa Method
            </Link>

          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}