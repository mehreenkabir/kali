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

                {/* Alternative: Browse all options */}
                <Link
                  href="/subscribe"
                  className="inline-block text-slate-600 font-serif tracking-wide px-4 py-2 text-sm transition-colors hover:text-slate-800 fade-in-up animation-delay-400"
                >
                  Explore All Sacred Paths →
                </Link>

                {/* Sign In Invitation */}
                <div className="pt-8">
                  <Link
                    href="/auth/signin"
                    className="inline-block text-slate-600 font-dreamy px-4 py-2 text-sm underline decoration-1 underline-offset-2 transition-colors hover:text-slate-800"
                  >
                    Already a member? Sign in to your sanctuary
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <GlobalFooter theme="light" />
      </div>
    );
  }

  // If user is logged in, show the personalized sanctuary experience
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Personalized Welcome */}
            <PersonalizedWelcome className="mb-8" />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xs:gap-8 mb-8">
              
              {/* Left Column - Content & Affirmations */}
              <div className="xl:col-span-2 space-y-6 xs:space-y-8">
                <ContentRecommendations />
                <MoodBasedAffirmations />
              </div>

              {/* Right Column - Progress & Quick Actions */}
              <div className="space-y-6 xs:space-y-8">
                <ProgressTracker />

                {/* Subscription Status */}
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                  <h3 className="font-serif text-xl text-slate-800 mb-4">Your Sacred Journey</h3>
                  
                  {session.user.subscriptionTier === 'none' ? (
                    <div className="space-y-4">
                      <p className="font-dreamy text-slate-600">
                        Unlock deeper practices and wisdom with a sanctuary subscription.
                      </p>
                      <Link
                        href="/subscribe"
                        className="block w-full bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-slate-800 text-center py-3 rounded-full font-serif tracking-wide transition-all duration-300 border border-purple-300"
                      >
                        Explore Subscriptions ✨
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {session.user.subscriptionTier === 'sanctuary' ? '🏛️' : '⭐'}
                        </span>
                        <div>
                          <p className="font-serif text-slate-800">
                            {session.user.subscriptionTier === 'sanctuary' ? 'The Sanctuary' : 'The Inner Sanctum'}
                          </p>
                          <p className="font-dreamy text-sm text-slate-600">Active Subscription</p>
                        </div>
                      </div>
                      
                      {/* Tier-specific features */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-green-500">✓</span>
                          <span className="font-dreamy text-slate-600">Unlimited meditations</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-green-500">✓</span>
                          <span className="font-dreamy text-slate-600">Sacred teachings</span>
                        </div>
                        {session.user.subscriptionTier === 'sanctum' && (
                          <>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-purple-500">✓</span>
                              <span className="font-dreamy text-slate-600">Akashic records</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-purple-500">✓</span>
                              <span className="font-dreamy text-slate-600">Crystal guidance</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Upgrade option for sanctuary users */}
                      {session.user.subscriptionTier === 'sanctuary' && (
                        <SubscribeButton
                          tier="sanctum"
                          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-full font-serif tracking-wide transition-colors text-sm"
                        >
                          Upgrade to Inner Sanctum
                        </SubscribeButton>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation to Other Worlds */}
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                  <h3 className="font-serif text-xl text-slate-800 mb-6">Explore Other Worlds</h3>
                  
                  <div className="space-y-4">
                    <Link
                      href="/art"
                      className="block bg-white/40 hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                          <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Art Sanctuary</h4>
                          <p className="font-dreamy text-sm text-slate-600">Co-creative artistry</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/math"
                      className="block bg-white/40 hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎮</span>
                        <div>
                          <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Math Adventure</h4>
                          <p className="font-dreamy text-sm text-slate-600">Gamified learning</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/portal"
                      className="block bg-white/40 hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🏠</span>
                        <div>
                          <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Your Portal</h4>
                          <p className="font-dreamy text-sm text-slate-600">Personal dashboard</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Banner - Inspiration */}
            <div className="bg-gradient-to-r from-purple-200/60 to-pink-200/60 backdrop-blur-md rounded-3xl p-8 xs:p-12 text-center border border-white/40">
              <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-4">
                Your Practice is Your Prayer
              </h2>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 max-w-2xl mx-auto">
                Every breath, every movement, every moment of stillness is a sacred conversation between your soul and the divine.
              </p>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
};

export default YogaPage;
