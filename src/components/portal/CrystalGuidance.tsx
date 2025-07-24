'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePersonalizedPortal } from '@/hooks/usePersonalizedPortal';

interface Crystal {
  id: string;
  name: string;
  image: string;
  properties: string[];
  chakras: string[];
  zodiacSigns: string[];
  description: string;
  careInstructions: string;
  monthlyTheme?: string;
}

const CrystalGuidance: React.FC = () => {
  const { data: session } = useSession();
  const [currentCrystal, setCurrentCrystal] = useState<Crystal | null>(null);
  
  // Use personalized crystal data
  const { personalizedData, getCrystalRecommendations } = usePersonalizedPortal();
  const personalizedCrystals = getCrystalRecommendations();

  // This month's featured crystal
  const monthlyFeatured: Crystal = {
    id: 'monthly-1',
    name: 'Rose Quartz',
    image: '💗',
    properties: ['Unconditional Love', 'Emotional Healing', 'Self-Compassion'],
    chakras: ['Heart'],
    zodiacSigns: ['Taurus', 'Libra'],
    description: 'This month, we embrace the gentle energy of Rose Quartz to open our hearts to divine love. Known as the stone of unconditional love, Rose Quartz teaches us to love ourselves first so we may love others authentically.',
    careInstructions: 'Cleanse under moonlight, charge with loving intentions',
    monthlyTheme: 'Opening the Heart to Divine Love'
  };

  useEffect(() => {
    // Set monthly featured crystal as default
    setCurrentCrystal(monthlyFeatured);
  }, []);

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Crystal Guidance & Collection
          </h2>
          <p className="font-dreamy text-slate-600">
            Your monthly crystal companion and personalized recommendations
          </p>
        </div>

        {/* This Month's Crystal */}
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 
                      border border-pink-200">
          <div className="text-center mb-6">
            <span className="inline-block bg-white/50 px-4 py-2 rounded-full 
                           text-sm font-medium text-purple-700 mb-4">
              🌙 This Month's Crystal
            </span>
            <h3 className="font-serif text-3xl text-slate-800 mb-2">
              {monthlyFeatured.name}
            </h3>
            <p className="font-dreamy text-purple-600 italic">
              {monthlyFeatured.monthlyTheme}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{monthlyFeatured.image}</div>
              <p className="font-dreamy text-slate-700">
                {monthlyFeatured.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-lg text-slate-800 mb-2">Properties</h4>
                <div className="flex flex-wrap gap-2">
                  {monthlyFeatured.properties.map((prop) => (
                    <span key={prop} className="bg-white/50 px-3 py-1 rounded-full text-sm">
                      {prop}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg text-slate-800 mb-2">Care Instructions</h4>
                <p className="font-dreamy text-sm text-slate-600">
                  {monthlyFeatured.careInstructions}
                </p>
              </div>

              <div className="pt-4">
                <div className="bg-amber-100 border border-amber-200 rounded-2xl p-4">
                  <p className="text-sm text-amber-800 font-medium text-center">
                    🚚 Your Rose Quartz will ship within 7 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div>
          <h3 className="font-serif text-xl text-slate-800 mb-4 text-center">
            Crystals Aligned with Your Energy
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {personalizedCrystals.map((crystal: any) => (
              <div
                key={crystal.id}
                className="bg-white/40 rounded-2xl p-4 border border-white/30 
                         hover:bg-white/50 transition-all cursor-pointer"
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{crystal.image}</div>
                  <h4 className="font-serif text-lg text-slate-800 mb-2">
                    {crystal.name}
                  </h4>
                  <p className="font-dreamy text-sm text-slate-600 mb-3">
                    {crystal.description}
                  </p>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {crystal.chakras.map((chakra: string) => (
                      <span key={chakra} className="text-xs bg-purple-100 
                                                   text-purple-700 px-2 py-1 rounded-full">
                        {chakra}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crystal Journey */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <h3 className="font-serif text-lg text-slate-800 mb-4">
            Your Crystal Journey
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-dreamy text-slate-600">Crystals Received</span>
              <span className="font-medium text-slate-800">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-dreamy text-slate-600">Member Since</span>
              <span className="font-medium text-slate-800">November 2023</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-dreamy text-slate-600">Next Crystal Ships</span>
              <span className="font-medium text-slate-800">February 1st</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalGuidance;
