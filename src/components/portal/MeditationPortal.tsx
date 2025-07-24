'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMeditationPersonalization } from '@/hooks/useMeditationPersonalization';

interface Meditation {
  id: string;
  title: string;
  duration: string;
  type: 'sleep' | 'focus' | 'manifestation' | 'healing' | 'chakra';
  intention: string;
  description: string;
  audioUrl?: string;
  thumbnail: string;
  isPersonalized: boolean;
}

const MeditationPortal: React.FC = () => {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>('personalized');
  const [userIntention, setUserIntention] = useState('');
  
  // Use personalized meditation data
  const { meditations, personalizedData } = useMeditationPersonalization();

  // Categories based on user's profile and current needs
  const categories = [
    { id: 'personalized', label: 'For You', icon: '⭐' },
    { id: 'sleep', label: 'Sleep', icon: '🌙' },
    { id: 'focus', label: 'Focus', icon: '🎯' },
    { id: 'manifestation', label: 'Manifest', icon: '✨' },
    { id: 'healing', label: 'Healing', icon: '💚' },
    { id: 'chakra', label: 'Chakras', icon: '🌈' }
  ];

  useEffect(() => {
    // Meditations are automatically loaded via the personalization hook
    // Save user intention if needed
    if (userIntention && personalizedData?.user) {
      // Could save intention to user preferences
      console.log('User intention:', userIntention);
    }
  }, [userIntention, personalizedData]);

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header with Intention Setting */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-4">
            Your Meditation Portal
          </h2>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Set today's intention..."
              value={userIntention}
              onChange={(e) => setUserIntention(e.target.value)}
              className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-2xl 
                       text-center font-dreamy placeholder-slate-500 focus:outline-none 
                       focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white/60 text-slate-800 shadow-lg'
                  : 'bg-white/20 text-slate-600 hover:bg-white/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-dreamy">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Meditation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meditations.map((meditation) => (
            <div
              key={meditation.id}
              className="bg-white/40 rounded-2xl p-6 border border-white/30 
                       hover:bg-white/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{meditation.thumbnail}</div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-slate-800 mb-1">
                    {meditation.title}
                  </h3>
                  <p className="font-dreamy text-sm text-slate-600 mb-2">
                    {meditation.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{meditation.duration}</span>
                    {meditation.isPersonalized && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Personalized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 bg-slate-800 text-white py-2 rounded-full 
                               opacity-0 group-hover:opacity-100 transition-opacity">
                Begin Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeditationPortal;
