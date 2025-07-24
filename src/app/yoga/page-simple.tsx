'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import SubscribeButton from '@/components/SubscribeButton';
import React from 'react';

const YogaPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pastel-dream-gradient text-slate-800">
      <Header theme="light" />

      <main className="flex-grow">
        <section className="min-h-full flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 py-16 xs:py-20 sm:py-24 md:py-32 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-24 sm:pb-28 md:pb-32">
          <div className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto text-center flex flex-col items-center">
            
            <p className="font-dreamy text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 leading-relaxed xs:leading-relaxed sm:leading-loose px-4 fade-in-up">
              Yoga is not just a practice I learned; it is the rhythm of my soul.
              It is my heritage, my sanctuary, and my offering to you. 
              We move beyond poses into the poetry of presence. 
              Listen to the frequency of nature, of compassion, and of the light within.
            </p>

            <div className="space-y-4 xs:space-y-6">
              {/* Subscribe to Sanctuary */}
              <SubscribeButton
                tier="sanctuary"
                className="inline-block bg-white/50 backdrop-blur-md text-slate-700 font-serif tracking-widest uppercase px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-white/80 hover:scale-105 hover:shadow-2xl button-glow fade-in-up focus-ring"
              >
                Join The Sanctuary - $33/month
              </SubscribeButton>

              {/* Subscribe to Inner Sanctum */}
              <SubscribeButton
                tier="sanctum"
                className="inline-block bg-slate-800/80 backdrop-blur-md text-white font-serif tracking-widest uppercase px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-slate-900/90 hover:scale-105 hover:shadow-2xl button-glow fade-in-up animation-delay-200 focus-ring"
              >
                Enter The Inner Sanctum - $55/month
              </SubscribeButton>

              {/* Features Preview */}
              <div className="mt-8 xs:mt-12 pt-6 xs:pt-8 border-t border-white/30">
                <p className="font-dreamy text-sm xs:text-base text-slate-600 mb-4">
                  What awaits you in the sanctuary:
                </p>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 max-w-md mx-auto">
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 xs:p-4">
                    <div className="text-lg xs:text-xl mb-1">🧘‍♀️</div>
                    <p className="font-serif text-xs xs:text-sm text-slate-700">
                      Daily Mood Tracking
                    </p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 xs:p-4">
                    <div className="text-lg xs:text-xl mb-1">📖</div>
                    <p className="font-serif text-xs xs:text-sm text-slate-700">
                      Sacred Journal
                    </p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 xs:p-4">
                    <div className="text-lg xs:text-xl mb-1">💎</div>
                    <p className="font-serif text-xs xs:text-sm text-slate-700">
                      Crystal Guidance
                    </p>
                  </div>
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 xs:p-4">
                    <div className="text-lg xs:text-xl mb-1">✨</div>
                    <p className="font-serif text-xs xs:text-sm text-slate-700">
                      Custom Jewelry
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GlobalFooter theme="light" />
    </div>
  );
};

export default YogaPage;
