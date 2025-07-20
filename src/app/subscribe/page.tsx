'use client';

import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';
import React, { useRef, MouseEvent, useState } from 'react';

// --- SVGs ---
const EtherealCheck = () => <svg className="w-5 h-5 mr-3 text-amber-800/80 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>;
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => <svg className={`w-5 h-5 text-amber-900/80 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>;

// --- Reusable Components ---
const FeatureListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start mb-3"><EtherealCheck /><span className="font-sans text-base text-slate-700">{children}</span></li>
);

const AccordionItem = ({ title, children, index, openIndex, setOpenIndex }: { title: string; children: React.ReactNode; index: number; openIndex: number | null; setOpenIndex: (index: number | null) => void; }) => {
  const isOpen = index === openIndex;
  return (
    <div className="border-b border-amber-800/10">
      <button onClick={() => setOpenIndex(isOpen ? null : index)} className="w-full flex justify-between items-center text-left py-3 xs:py-4 focus-ring" aria-expanded={isOpen}>
        <span className="font-dreamy text-lg xs:text-xl text-slate-800 pr-2">{title}</span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="pt-2 pb-3 xs:pb-4 pr-4 xs:pr-6 font-sans text-xs xs:text-sm text-slate-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string; }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const { left, top, width, height } = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 20;
      const y = (e.clientY - top - height / 2) / 20;
      cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.05, 1.05, 1.05)`;
    }
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    }
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`relative w-full h-full transition-transform duration-300 ease-out ${className}`} tabIndex={0}>
      <span className="sr-only">Tarot card, interactive tilt effect</span>
      {children}
    </div>
  );
};


// --- The Perfected Page ---
export default function SubscribePage() {
  const [openSanctuaryAccordion, setOpenSanctuaryAccordion] = useState<number | null>(null); // State for Card 2
  const [openSanctumAccordion, setOpenSanctumAccordion] = useState<number | null>(null);   // NEW State for Card 3

  const sanctuaryFeatures = [
    { title: "Personalized Meditation Portal", content: "As soon as you join our community, you'll get to create your very own unique profile. With your intentions in mind, I'll lovingly curate a delightful flow of guided meditations just for you, perfectly aligned with your personal journey. Let's embark on this beautiful adventure together!" },
    { title: "Akashic Records Access", content: "Imagine a cozy digital library filled with timeless wisdom and contemporary thoughts! Here, you'll discover my entire collection of heartfelt writings, insightful essays, and channeled messages, lovingly refreshed with new gems every month." },
    { title: "Curated Crystal Collection", content: "A lovely, high-vibrational crystal, lovingly selected just for you and the community, will arrive at your doorstep to enhance your practice." },
    { title: "Meditation Haven", content: "Whenever you seek a moment of clarity, peace, or inspiration, dive into our ever-expanding collection of soothing sessions designed for sleep, focus, manifestation, and nurturing your daily spiritual practice." },
    { title: "Tarot Forecast", content: "You'll receive a warm, personal reading right in your portal, providing you with friendly guidance and clarity for the journey ahead." },
  ];

  const sanctumFeatures = [
    { title: "Ayurvedic Culinary Masterpath", content: "A complete digital masterclass in the art of nourishment. Learn to embody the ancient wisdom of Ayurveda, transforming food into a source of vibrant health, mental clarity, and radiant energy." },
    { title: "Handmade Crystal Jewelry", content: "Receive a beautiful piece of heirloom-quality crystal jewelry, lovingly handmade and infused with a specific intention to support your journey each year." },
    { title: "The Youth Elixir", content: "Unlock a private collection of sacred practices, nutritional secrets, and energetic techniques designed to cultivate ageless vitality and a luminous inner glow." },
    { title: "Aura Readings", content: "Two personal sessions to illuminate your energetic signature. Gain profound clarity on your path, your gifts, and the frequency you broadcast to the world." }
  ];

  return (
    <div className="min-h-screen flex flex-col pastel-dream-gradient text-slate-800 overflow-hidden">
      <Header />

      <main className="flex-grow">
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
                  <div className="mb-4 xs:mb-5 sm:mb-6"><span className="font-serif text-3xl xs:text-4xl sm:text-5xl font-light text-slate-800">$888</span><span className="font-sans text-slate-500 ml-1 xs:ml-2 text-sm xs:text-base">/ month</span></div>
                  <div className="mb-4 xs:mb-5 sm:mb-6 text-left flex-grow">
                    <h3 className="font-serif text-lg xs:text-xl text-slate-700 mb-3 xs:mb-4 text-center">The Heart of The Sanctuary:</h3>
                    {sanctuaryFeatures.map((item, index) => (
                      <AccordionItem key={index} index={index} title={item.title} openIndex={openSanctuaryAccordion} setOpenIndex={setOpenSanctuaryAccordion}>
                        {item.content}
                      </AccordionItem>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link href="/contact" className="inline-block w-full max-w-sm mx-auto text-center font-serif tracking-widest uppercase px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base rounded-full bg-slate-700 text-white hover:bg-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500">
                      Choose this Path
                    </Link>
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
                    <div className="mb-4 xs:mb-5 sm:mb-6"><span className="font-serif text-4xl xs:text-5xl sm:text-6xl font-light text-slate-900">$9999</span><span className="font-sans text-slate-500 ml-1 xs:ml-2 text-sm xs:text-base">/ year</span></div>
                    
                    {/* --- NEW ACCORDION MENU FOR INNER SANCTUM --- */}
                    <div className="my-4 xs:my-5 sm:my-6 p-3 xs:p-4 bg-amber-700/5 rounded-lg text-left flex-grow">
                      <h3 className="font-sans text-sm xs:text-base text-amber-900 mb-3 xs:mb-4">Includes full Sanctuary access, plus your alchemical tools:</h3>
                      <div className="space-y-2 xs:space-y-3">
                        {sanctumFeatures.map((item, index) => (
                          <AccordionItem key={index} index={index} title={item.title} openIndex={openSanctumAccordion} setOpenIndex={setOpenSanctumAccordion}>
                            {item.content}
                          </AccordionItem>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href="/contact" className="inline-block w-full max-w-sm mx-auto text-center font-serif tracking-widest uppercase px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 text-sm xs:text-base rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 button-glow">
                        Begin the Ascent
                      </Link>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
            
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}