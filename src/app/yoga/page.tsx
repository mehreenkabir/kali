'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import SubscribeButton from '@/components/SubscribeButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const YogaPage: React.FC = () => {
  const { data: session } = useSession();
  const isSubscribed = session?.user?.subscriptionTier && 
                      session?.user?.subscriptionTier !== 'none' && 
                      session?.user?.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen flex flex-col pastel-dream-gradient text-slate-800">
      <Header theme="light" />

      <main className="flex-grow">
        <section className="min-h-full flex items-center justify-center px-3 xs:px-4 sm:px-6 md:px-8 py-16 xs:py-20 sm:py-24 md:py-32 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20 xs:pb-24 sm:pb-28 md:pb-32">
          <div className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Main Message */}
            <p className="font-dreamy text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-700 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mb-8 xs:mb-10 sm:mb-12 md:mb-14 lg:mb-16 leading-relaxed xs:leading-relaxed sm:leading-loose px-4 fade-in-up">
              Yoga is not just a practice I learned; it is the rhythm of my soul.
              It is my heritage, my sanctuary, and my offering to you. 
              We move beyond poses into the poetry of presence. 
              Listen to the frequency of nature, of compassion, and of the light within.
            </p>

            {/* Conditional Content Based on Subscription Status */}
            {isSubscribed ? (
              // For Subscribers: Portal Access
              <div className="w-full max-w-2xl space-y-8">
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50">
                  <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-6">
                    Welcome to Your Sacred Sanctuary ✨
                  </h2>
                  <p className="font-dreamy text-lg text-slate-600 mb-8">
                    Your spiritual journey awaits. Access your personalized portal with curated content just for you.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { title: 'Portal Dashboard', icon: '🌟', href: '/portal', desc: 'Your personalized home' },
                      { title: 'Mood Tracking', icon: '🎭', href: '/portal/mood', desc: 'Daily spiritual weather' },
                      { title: 'Sacred Journal', icon: '📖', href: '/portal/journal', desc: 'Reflect & grow' },
                      { title: 'Profile Settings', icon: '⚙️', href: '/portal/profile', desc: 'Customize your journey' }
                    ].map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="group bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/40 transition-all hover:scale-105 hover:shadow-lg"
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-serif text-sm font-medium text-slate-800">{item.title}</h3>
                        <p className="font-dreamy text-xs text-slate-600">{item.desc}</p>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/portal"
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-serif tracking-wider uppercase px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Enter Your Portal
                  </Link>
                </div>

                {/* Tier-Specific Features */}
                {session?.user?.subscriptionTier === 'sanctum' && (
                  <div className="bg-gradient-to-r from-amber-100/80 to-orange-100/80 backdrop-blur-md rounded-3xl p-6 border border-white/50">
                    <h3 className="font-serif text-xl text-slate-800 mb-4">✨ Inner Sanctum Exclusive</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white/40 rounded-xl p-4">
                        <div className="text-xl mb-2">🌿</div>
                        <h4 className="font-serif text-sm font-medium">Ayurvedic Guidance</h4>
                        <p className="font-dreamy text-xs text-slate-600">Personalized wellness</p>
                      </div>
                      <div className="bg-white/40 rounded-xl p-4">
                        <div className="text-xl mb-2">💍</div>
                        <h4 className="font-serif text-sm font-medium">Custom Jewelry</h4>
                        <p className="font-dreamy text-xs text-slate-600">Sacred adornments</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // For Non-Subscribers: Subscription Options
              <div className="space-y-6 xs:space-y-8">
                {/* Subscription Buttons */}
                <div className="space-y-4 xs:space-y-6">
                  <SubscribeButton
                    tier="sanctuary"
                    className="inline-block bg-white/50 backdrop-blur-md text-slate-700 font-serif tracking-widest uppercase px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-white/80 hover:scale-105 hover:shadow-2xl button-glow fade-in-up focus-ring"
                  >
                    Join The Sanctuary - $33/month
                  </SubscribeButton>

                  <SubscribeButton
                    tier="sanctum"
                    className="inline-block bg-slate-800/80 backdrop-blur-md text-white font-serif tracking-widest uppercase px-6 xs:px-8 sm:px-10 md:px-12 py-2.5 xs:py-3 sm:py-3.5 md:py-4 text-xs xs:text-sm sm:text-base rounded-full transition-all duration-300 hover:bg-slate-900/90 hover:scale-105 hover:shadow-2xl button-glow fade-in-up animation-delay-200 focus-ring"
                  >
                    Enter The Inner Sanctum - $55/month
                  </SubscribeButton>
                </div>

                {/* Features Preview */}
                <div className="mt-8 xs:mt-12 pt-6 xs:pt-8 border-t border-white/30">
                  <p className="font-dreamy text-sm xs:text-base text-slate-600 mb-6">
                    What awaits you in the sanctuary:
                  </p>
                  
                  {/* The Sanctuary Features */}
                  <div className="mb-8">
                    <h3 className="font-serif text-lg text-slate-700 mb-4">🌸 The Sanctuary ($33/month)</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 max-w-2xl mx-auto">
                      {[
                        { icon: '🧘‍♀️', title: 'Personalized Meditation Portal', desc: 'Daily guided sessions' },
                        { icon: '📖', title: 'Akashic Records Access', desc: 'Ancient wisdom library' },
                        { icon: '💎', title: 'Crystal Guidance', desc: 'Monthly crystal insights' },
                        { icon: '🔮', title: 'Tarot Forecasts', desc: 'Personal spiritual guidance' },
                        { icon: '📝', title: 'Mood & Journal Tracking', desc: 'Track your spiritual growth' },
                        { icon: '✨', title: 'Daily Spiritual Insights', desc: 'Personalized content' }
                      ].map((feature, index) => (
                        <div key={index} className="bg-white/30 backdrop-blur-sm rounded-xl p-3 xs:p-4 text-center">
                          <div className="text-lg xs:text-xl mb-1">{feature.icon}</div>
                          <h4 className="font-serif text-xs xs:text-sm text-slate-700 font-medium mb-1">{feature.title}</h4>
                          <p className="font-dreamy text-xs text-slate-600">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The Inner Sanctum Features */}
                  <div className="bg-gradient-to-r from-amber-100/50 to-orange-100/50 rounded-3xl p-6 border border-white/40">
                    <h3 className="font-serif text-lg text-slate-700 mb-4">✨ The Inner Sanctum ($55/month)</h3>
                    <p className="font-dreamy text-sm text-slate-600 mb-4">Everything in The Sanctuary, plus:</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
                      {[
                        { icon: '🌿', title: 'Ayurvedic Masterpath', desc: 'Personalized wellness guidance' },
                        { icon: '💍', title: 'Custom Crystal Jewelry', desc: 'Sacred pieces made for you' },
                        { icon: '⚡', title: 'Youth Elixir Practices', desc: 'Ancient longevity secrets' },
                        { icon: '🌈', title: 'Personal Aura Readings', desc: 'Monthly energy insights' }
                      ].map((feature, index) => (
                        <div key={index} className="bg-white/40 backdrop-blur-sm rounded-xl p-3 xs:p-4 text-center">
                          <div className="text-lg xs:text-xl mb-1">{feature.icon}</div>
                          <h4 className="font-serif text-xs xs:text-sm text-slate-700 font-medium mb-1">{feature.title}</h4>
                          <p className="font-dreamy text-xs text-slate-600">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <p className="font-dreamy text-sm text-slate-600 mb-4">
                    ✨ Start your 7-day free trial. Cancel anytime. ✨
                  </p>
                  <p className="font-serif text-xs text-slate-500">
                    Join thousands of souls on their sacred journey to inner peace and spiritual awakening.
                  </p>
                </div>
              </div>
            )}

            {/* Already have account prompt */}
            {!session && (
              <div className="mt-8 pt-6 border-t border-white/30">
                <p className="font-dreamy text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-slate-800 hover:text-slate-900 underline">
                    Sign in to your portal
                  </Link>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <GlobalFooter theme="light" />
    </div>
  );
};

export default YogaPage;
