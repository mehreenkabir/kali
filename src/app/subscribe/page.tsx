'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import FeatureListItem from '@/components/ui/FeatureListItem';
import AccordionItem from '@/components/ui/AccordionItem';
import TiltCard from '@/components/ui/TiltCard';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubscriptionFeature } from '@/types/common';
import { generateKey } from '@/utils/helpers';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { redirectToCheckout } from '@/lib/stripe-client';

// Subscription tier features configuration
const SANCTUARY_FEATURES: SubscriptionFeature[] = [
  { 
    title: "Personalized Meditation Portal", 
    content: "As soon as you join our community, you'll get to create your very own unique profile. With your intentions in mind, I'll lovingly curate a delightful flow of guided meditations just for you, perfectly aligned with your personal journey. Let's embark on this beautiful adventure together!" 
  },
  { 
    title: "Akashic Records Access", 
    content: "Imagine a cozy digital library filled with timeless wisdom and contemporary thoughts! Here, you'll discover my entire collection of heartfelt writings, insightful essays, and channeled messages, lovingly refreshed with new gems every month." 
  },
  { 
    title: "Curated Crystal Collection", 
    content: "A lovely, high-vibrational crystal, lovingly selected just for you and the community, will arrive at your doorstep to enhance your practice." 
  },
  { 
    title: "Meditation Haven", 
    content: "Whenever you seek a moment of clarity, peace, or inspiration, dive into our ever-expanding collection of soothing sessions designed for sleep, focus, manifestation, and nurturing your daily spiritual practice." 
  },
  { 
    title: "Tarot Forecast", 
    content: "You'll receive a warm, personal reading right in your portal, providing you with friendly guidance and clarity for the journey ahead." 
  },
];

const SANCTUM_FEATURES: SubscriptionFeature[] = [
  { 
    title: "Ayurvedic Culinary Masterpath", 
    content: "A complete digital masterclass in the art of nourishment. Learn to embody the ancient wisdom of Ayurveda, transforming food into a source of vibrant health, mental clarity, and radiant energy." 
  },
  { 
    title: "Handmade Crystal Jewelry", 
    content: "Receive a beautiful piece of heirloom-quality crystal jewelry, lovingly handmade and infused with a specific intention to support your journey each year." 
  },
  { 
    title: "The Youth Elixir", 
    content: "Unlock a private collection of sacred practices, nutritional secrets, and energetic techniques designed to cultivate ageless vitality and a luminous inner glow." 
  },
  { 
    title: "Aura Readings", 
    content: "Two personal sessions to illuminate your energetic signature. Gain profound clarity on your path, your gifts, and the frequency you broadcast to the world." 
  }
];

const SubscribePage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [openSanctuaryAccordion, setOpenSanctuaryAccordion] = useState<number | null>(null);
  const [openSanctumAccordion, setOpenSanctumAccordion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (tier: 'sanctuary' | 'sanctum') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    
    try {
      // Redirect to Stripe checkout
      await redirectToCheckout(tier);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCurrentTier = (tier: string) => {
    return session?.user.subscriptionTier === tier && session?.user.subscriptionStatus === 'active';
  };

  return (
    <div className="min-h-screen flex flex-col pastel-dream-gradient text-slate-800 overflow-hidden">
      <Header />

      <main className="flex-grow">
        {/* Current Subscription Status - only show if user is logged in */}
        {session && (
          <section className="px-4 xs:px-6 sm:px-8 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 xs:p-8 border border-white/30">
                <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-4">
                  Welcome back, {session.user.name}
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <span className="text-slate-700">Current Subscription:</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    session.user.subscriptionTier === 'none' ? 'bg-gray-100 text-gray-800' :
                    session.user.subscriptionTier === 'sanctuary' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {session.user.subscriptionTier === 'none' ? 'No Active Subscription' :
                     session.user.subscriptionTier === 'sanctuary' ? 'The Sanctuary' :
                     'The Inner Sanctum'}
                  </span>
                  {session.user.subscriptionTier !== 'none' && (
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      session.user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {session.user.subscriptionStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="min-h-full flex items-center justify-center px-4 xs:px-6 sm:px-8 py-20 xs:py-24 sm:py-24 md:py-32 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-24 xs:pb-28 sm:pb-32 md:pb-36">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8 items-stretch">
            
            {/* --- Card 1: The Invitation (The High Priestess) --- */}
            <div className="fade-in-up md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <TiltCard>
                <div className="tarot-card relative w-full h-full p-6 xs:p-7 sm:p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col text-center bg-slate-800 text-slate-100">
                  <h2 className="font-serif text-2xl xs:text-2xl sm:text-3xl md:text-4xl text-amber-200/90 mb-6 xs:mb-7 sm:mb-8 text-glow">The Kalianïa Method</h2>
                  <div className="flex-grow flex items-center justify-center">
                    <p className="font-dreamy text-lg xs:text-xl sm:text-2xl md:text-3xl text-slate-100/90 leading-relaxed xs:leading-relaxed sm:leading-loose">
                      Should the path grow dim and shadows long, <br className="hidden xs:block"/>
                      my light is here to help you find your own. <br/><br className="hidden xs:block"/>
                      I offer not a map, but a steady hand to hold, <br className="hidden xs:block"/>
                      a quiet space to let your grace unfold. <br/><br className="hidden xs:block"/>
                      For the brightest lantern is the one you carry; <br className="hidden xs:block"/>
                      I am simply here to help you remember how to let it burn.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* --- Card 2: The Sanctuary (The Empress) --- */}
            <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
              <TiltCard>
                <div className="tarot-card relative w-full h-full p-6 xs:p-7 sm:p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col text-center bg-amber-50">
                  <h2 className="font-serif text-2xl xs:text-2xl sm:text-3xl text-slate-700 mb-2">The Sanctuary</h2>
                  <div className="mb-4 xs:mb-5 sm:mb-6"><span className="font-serif text-3xl xs:text-4xl sm:text-5xl font-light text-slate-800">$33</span><span className="font-sans text-slate-500 ml-1 xs:ml-2 text-sm xs:text-base">/ month</span></div>
                  <div className="mb-4 xs:mb-5 sm:mb-6 text-left flex-grow">
                    <h3 className="font-serif text-lg xs:text-xl text-slate-700 mb-3 xs:mb-4 text-center">The Heart of The Sanctuary:</h3>
                    {SANCTUARY_FEATURES.map((feature, index) => (
                      <AccordionItem 
                        key={generateKey('sanctuary', index)}
                        index={index} 
                        title={feature.title} 
                        openIndex={openSanctuaryAccordion} 
                        setOpenIndex={setOpenSanctuaryAccordion}
                      >
                        {feature.content}
                      </AccordionItem>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleSubscribe('sanctuary')}
                      disabled={isLoading || isCurrentTier('sanctuary')}
                      className={`inline-block w-full max-w-sm mx-auto text-center font-serif tracking-widest uppercase px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                        isCurrentTier('sanctuary') 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-slate-700 text-white hover:bg-slate-800'
                      }`}
                    >
                      {isLoading ? 'Processing...' : 
                       isCurrentTier('sanctuary') ? 'Current Plan' :
                       session ? 'Choose this Path' : 'Sign In to Subscribe'}
                    </button>
                  </div>
                </div>
              </TiltCard>
            </div>

            {/* --- Card 3: The Inner Sanctum (The Sun) --- */}
            <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
              <TiltCard>
                <div className="relative w-full h-full">
                  <div className="absolute -inset-1.5 rounded-2xl aurora-border-bg opacity-75 blur-xl"></div>
                  <div className="tarot-card relative w-full h-full p-6 xs:p-7 sm:p-8 md:p-10 rounded-2xl shadow-2xl flex flex-col text-center bg-white">
                    <div className="mb-1 xs:mb-1.5 sm:mb-2 font-serif text-amber-800 tracking-widest uppercase text-xs xs:text-sm">The Path of Devotion</div>
                    <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl text-slate-800 mb-2">The Inner Sanctum</h2>
                    <div className="mb-4 xs:mb-5 sm:mb-6"><span className="font-serif text-4xl xs:text-5xl sm:text-6xl font-light text-slate-900">$55</span><span className="font-sans text-slate-500 ml-1 xs:ml-2 text-sm xs:text-base">/ month</span></div>
                    
                    {/* --- NEW ACCORDION MENU FOR INNER SANCTUM --- */}
                    <div className="my-4 xs:my-5 sm:my-6 p-3 xs:p-4 bg-amber-700/5 rounded-lg text-left flex-grow">
                      <h3 className="font-sans text-sm xs:text-base text-amber-900 mb-3 xs:mb-4">Includes full Sanctuary access, plus your alchemical tools:</h3>
                      <div className="space-y-2 xs:space-y-3">
                        {SANCTUM_FEATURES.map((feature, index) => (
                          <AccordionItem 
                            key={generateKey('sanctum', index)}
                            index={index} 
                            title={feature.title} 
                            openIndex={openSanctumAccordion} 
                            setOpenIndex={setOpenSanctumAccordion}
                          >
                            {feature.content}
                          </AccordionItem>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={() => handleSubscribe('sanctum')}
                        disabled={isLoading || isCurrentTier('sanctum')}
                        className={`inline-block w-full max-w-sm mx-auto text-center font-serif tracking-widest uppercase px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 button-glow ${
                          isCurrentTier('sanctum') 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-slate-800 text-white hover:bg-slate-900'
                        }`}
                      >
                        {isLoading ? 'Processing...' : 
                         isCurrentTier('sanctum') ? 'Current Plan' :
                         session ? 'Begin the Ascent' : 'Sign In to Subscribe'}
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
            
          </div>
        </section>
      </main>

      <GlobalFooter theme="light" />
    </div>
  );
};

export default SubscribePage;