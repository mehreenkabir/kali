// FILE: src/components/yoga/MoodBasedAffirmations.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Affirmation {
  id: string;
  text: string;
  author?: string;
  category: string;
  mood: string[];
  tier?: 'free' | 'sanctuary' | 'sanctum';
}

interface MoodBasedAffirmationsProps {
  className?: string;
}

const MoodBasedAffirmations: React.FC<MoodBasedAffirmationsProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [selectedMood, setSelectedMood] = useState<string>('empowered');
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const moods = [
    { key: 'empowered', label: 'Empowered', icon: '👑', color: 'from-purple-400 to-pink-400' },
    { key: 'peaceful', label: 'Peaceful', icon: '🕊️', color: 'from-blue-400 to-cyan-400' },
    { key: 'grateful', label: 'Grateful', icon: '🙏', color: 'from-green-400 to-emerald-400' },
    { key: 'creative', label: 'Creative', icon: '🎨', color: 'from-orange-400 to-red-400' },
    { key: 'healing', label: 'Healing', icon: '🌸', color: 'from-pink-400 to-rose-400' },
    { key: 'confident', label: 'Confident', icon: '✨', color: 'from-yellow-400 to-amber-400' }
  ];

  const affirmations: Affirmation[] = [
    // Empowered
    {
      id: '1',
      text: 'I am the sovereign of my own reality, weaving magic with every breath.',
      category: 'Self-Empowerment',
      mood: ['empowered', 'confident'],
      tier: 'free'
    },
    {
      id: '2',
      text: 'My inner light illuminates every path I choose to walk.',
      category: 'Self-Empowerment',
      mood: ['empowered', 'confident'],
      tier: 'free'
    },
    {
      id: '3',
      text: 'I trust the divine feminine wisdom that flows through me.',
      category: 'Divine Feminine',
      mood: ['empowered', 'peaceful'],
      tier: 'sanctuary'
    },
    
    // Peaceful
    {
      id: '4',
      text: 'In this moment, I am held by the gentle embrace of the universe.',
      category: 'Inner Peace',
      mood: ['peaceful', 'healing'],
      tier: 'free'
    },
    {
      id: '5',
      text: 'My breath is a bridge between heaven and earth, calming my soul.',
      category: 'Breathwork',
      mood: ['peaceful', 'healing'],
      tier: 'free'
    },
    {
      id: '6',
      text: 'The sacred silence within me contains all the answers I seek.',
      category: 'Meditation',
      mood: ['peaceful'],
      tier: 'sanctuary'
    },
    
    // Grateful
    {
      id: '7',
      text: 'Every challenge has been a sacred teacher, guiding me home to myself.',
      category: 'Gratitude',
      mood: ['grateful', 'healing'],
      tier: 'free'
    },
    {
      id: '8',
      text: 'I honor the journey that brought me to this moment of awareness.',
      category: 'Gratitude',
      mood: ['grateful', 'peaceful'],
      tier: 'free'
    },
    {
      id: '9',
      text: 'My heart overflows with appreciation for the magic in ordinary moments.',
      category: 'Heart Opening',
      mood: ['grateful'],
      tier: 'sanctuary'
    },
    
    // Creative
    {
      id: '10',
      text: 'I am a vessel for divine creativity, channeling beauty into the world.',
      category: 'Creative Expression',
      mood: ['creative', 'empowered'],
      tier: 'free'
    },
    {
      id: '11',
      text: 'My authentic expression is a gift to the collective consciousness.',
      category: 'Authentic Self',
      mood: ['creative', 'confident'],
      tier: 'sanctuary'
    },
    {
      id: '12',
      text: 'Through sacred artistry, I birth new realities into existence.',
      category: 'Co-Creation',
      mood: ['creative'],
      tier: 'sanctum'
    },
    
    // Healing
    {
      id: '13',
      text: 'Every cell in my body remembers its perfect, divine blueprint.',
      category: 'Physical Healing',
      mood: ['healing', 'peaceful'],
      tier: 'free'
    },
    {
      id: '14',
      text: 'I release what no longer serves and welcome profound transformation.',
      category: 'Emotional Healing',
      mood: ['healing', 'empowered'],
      tier: 'sanctuary'
    },
    {
      id: '15',
      text: 'The ancestral wounds within me are transmuted into wisdom and light.',
      category: 'Ancestral Healing',
      mood: ['healing'],
      tier: 'sanctum'
    },
    
    // Confident
    {
      id: '16',
      text: 'I stand in my power, radiant and unshakeable in my truth.',
      category: 'Self-Confidence',
      mood: ['confident', 'empowered'],
      tier: 'free'
    },
    {
      id: '17',
      text: 'My voice carries the frequency of love and transformation.',
      category: 'Authentic Voice',
      mood: ['confident', 'creative'],
      tier: 'sanctuary'
    },
    {
      id: '18',
      text: 'I am the alchemist of my own becoming, transmuting fear into love.',
      category: 'Shadow Work',
      mood: ['confident', 'healing'],
      tier: 'sanctum'
    }
  ];

  const getAvailableAffirmations = () => {
    const userTier = session?.user?.subscriptionTier || 'none';
    
    return affirmations.filter(affirmation => {
      // Check mood match
      const moodMatch = affirmation.mood.includes(selectedMood);
      
      // Check tier access
      let tierAccess = false;
      if (affirmation.tier === 'free') {
        tierAccess = true;
      } else if (affirmation.tier === 'sanctuary' && (userTier === 'sanctuary' || userTier === 'sanctum')) {
        tierAccess = true;
      } else if (affirmation.tier === 'sanctum' && userTier === 'sanctum') {
        tierAccess = true;
      }
      
      return moodMatch && tierAccess;
    });
  };

  const generateNewAffirmation = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const availableAffirmations = getAvailableAffirmations();
      if (availableAffirmations.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableAffirmations.length);
        setCurrentAffirmation(availableAffirmations[randomIndex]);
      }
      setIsGenerating(false);
    }, 1000);
  };

  useEffect(() => {
    generateNewAffirmation();
  }, [selectedMood, session]);

  const selectedMoodData = moods.find(mood => mood.key === selectedMood);
  const availableCount = getAvailableAffirmations().length;

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Sacred Affirmations
          </h2>
          <p className="font-dreamy text-slate-600">
            Personalized mantras for your current energy
          </p>
        </div>

        {/* Mood Selection */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-slate-800 text-center">
            How are you feeling today?
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.key}
                onClick={() => setSelectedMood(mood.key)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-2xl transition-all duration-300 ${
                  selectedMood === mood.key
                    ? `bg-gradient-to-br ${mood.color} text-white shadow-lg scale-105`
                    : 'bg-white/40 text-slate-600 hover:bg-white/60'
                }`}
              >
                <span className="text-2xl">{mood.icon}</span>
                <span className="font-dreamy text-sm xs:text-base">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Affirmation */}
        {currentAffirmation && (
          <div className={`bg-gradient-to-br ${selectedMoodData?.color} rounded-3xl p-6 xs:p-8 text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-6xl">{selectedMoodData?.icon}</div>
              <div className="absolute bottom-4 left-4 text-4xl rotate-12">✨</div>
              <div className="absolute top-1/2 left-1/4 text-3xl -rotate-12">🌙</div>
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <blockquote className="font-serif text-xl xs:text-2xl leading-relaxed italic">
                "{currentAffirmation.text}"
              </blockquote>
              
              <div className="space-y-2">
                <div className="font-dreamy text-white/80">
                  {currentAffirmation.category}
                </div>
                {currentAffirmation.author && (
                  <div className="font-dreamy text-sm text-white/70">
                    — {currentAffirmation.author}
                  </div>
                )}
              </div>
              
              {/* Tier Badge */}
              {currentAffirmation.tier !== 'free' && (
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-dreamy">
                    {currentAffirmation.tier === 'sanctuary' ? '🏛️ Sanctuary' : '⭐ Sanctum'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={generateNewAffirmation}
            disabled={isGenerating}
            className="w-full bg-slate-800 text-white py-4 rounded-full font-serif text-lg tracking-wide transition-all duration-300 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Channeling...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>New Affirmation</span>
              </>
            )}
          </button>

          {/* Available Count */}
          <div className="text-center text-sm text-slate-600 font-dreamy">
            {availableCount} affirmations available for this mood
          </div>
        </div>

        {/* Upgrade Prompt */}
        {(!session || session.user?.subscriptionTier === 'none') && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center border border-purple-200">
            <div className="text-2xl mb-3">🔮</div>
            <h3 className="font-serif text-lg text-slate-800 mb-2">
              Unlock Sacred Wisdom
            </h3>
            <p className="font-dreamy text-slate-600 text-sm mb-4">
              Access premium affirmations and personalized guidance with a subscription.
            </p>
            <button className="bg-slate-800 text-white px-6 py-2 rounded-full font-dreamy text-sm hover:bg-slate-900 transition-colors">
              Explore Subscriptions
            </button>
          </div>
        )}

        {/* Usage Stats */}
        {session && (
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <div className="font-dreamy text-slate-600 text-sm">
              You've received <span className="font-semibold text-slate-800">12</span> affirmations this week
            </div>
            <div className="font-dreamy text-slate-500 text-xs mt-1">
              Daily practice strengthens your manifestation power ✨
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodBasedAffirmations;
