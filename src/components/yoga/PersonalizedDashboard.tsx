// FILE: src/components/yoga/PersonalizedDashboard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  action: string;
  href?: string;
  onClick?: () => void;
  gradient: string;
  available: boolean;
}

interface PersonalizedDashboardProps {
  className?: string;
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [selectedMood, setSelectedMood] = useState<string>('');

  const tier = session?.user?.subscriptionTier || 'none';
  const isActive = session?.user?.subscriptionStatus === 'active';

  // Mood-based content suggestions
  const moods = [
    { emoji: '🌅', label: 'Energize', key: 'energize' },
    { emoji: '🕯️', label: 'Center', key: 'center' },
    { emoji: '🌙', label: 'Release', key: 'release' },
    { emoji: '💫', label: 'Transform', key: 'transform' },
    { emoji: '🦋', label: 'Flow', key: 'flow' }
  ];

  // Dashboard cards based on subscription tier
  const getDashboardCards = (): DashboardCard[] => {
    const baseCards: DashboardCard[] = [
      {
        title: 'Daily Intention',
        description: 'Set your sacred intention for today',
        icon: '🌟',
        action: 'Set Intention',
        gradient: 'from-rose-200 to-pink-300',
        available: true
      },
      {
        title: 'Mood-Based Practice',
        description: 'Personalized sessions for your current energy',
        icon: '🎭',
        action: 'Choose Practice',
        gradient: 'from-blue-200 to-cyan-300',
        available: true
      }
    ];

    if (tier === 'sanctuary' && isActive) {
      return [
        ...baseCards,
        {
          title: 'Meditation Portal',
          description: 'Your curated meditation library',
          icon: '🧘‍♀️',
          action: 'Begin Session',
          href: '/portal/meditations',
          gradient: 'from-amber-200 to-yellow-300',
          available: true
        },
        {
          title: 'Akashic Records',
          description: 'Wisdom library & sacred texts',
          icon: '📜',
          action: 'Explore Wisdom',
          href: '/portal/akashic',
          gradient: 'from-emerald-200 to-teal-300',
          available: true
        },
        {
          title: 'Crystal Guidance',
          description: 'Your monthly crystal insights',
          icon: '💎',
          action: 'View Crystal',
          href: '/portal/crystals',
          gradient: 'from-purple-200 to-violet-300',
          available: true
        },
        {
          title: 'Tarot Forecast',
          description: 'Personal guidance & clarity',
          icon: '🔮',
          action: 'Read Cards',
          href: '/portal/tarot',
          gradient: 'from-indigo-200 to-blue-300',
          available: true
        }
      ];
    }

    if (tier === 'sanctum' && isActive) {
      return [
        ...baseCards,
        {
          title: 'All Sanctuary Features',
          description: 'Complete access to wisdom & tools',
          icon: '🏛️',
          action: 'Enter Sanctuary',
          href: '/portal/sanctuary',
          gradient: 'from-amber-200 to-yellow-300',
          available: true
        },
        {
          title: 'Ayurvedic Mastery',
          description: 'Culinary wellness & vitality',
          icon: '🌿',
          action: 'Begin Course',
          href: '/portal/ayurveda',
          gradient: 'from-green-200 to-emerald-300',
          available: true
        },
        {
          title: 'Aura Readings',
          description: 'Deep energetic sessions',
          icon: '✨',
          action: 'Book Session',
          href: '/portal/aura',
          gradient: 'from-purple-200 to-violet-300',
          available: true
        },
        {
          title: 'Crystal Jewelry',
          description: 'Your heirloom collection',
          icon: '💍',
          action: 'View Collection',
          href: '/portal/jewelry',
          gradient: 'from-pink-200 to-rose-300',
          available: true
        },
        {
          title: 'Youth Elixir',
          description: 'Sacred vitality practices',
          icon: '🌸',
          action: 'Access Secrets',
          href: '/portal/elixir',
          gradient: 'from-cyan-200 to-blue-300',
          available: true
        }
      ];
    }

    // For non-subscribers or inactive subscriptions
    return [
      ...baseCards,
      {
        title: 'Sanctuary Preview',
        description: 'Discover what awaits you',
        icon: '🚪',
        action: 'Explore Tiers',
        href: '/subscribe',
        gradient: 'from-slate-200 to-gray-300',
        available: false
      }
    ];
  };

  const getMoodContent = (mood: string) => {
    const content = {
      energize: {
        practice: 'Sun Salutation Flow',
        duration: '15 minutes',
        description: 'Awaken your inner fire and vitality'
      },
      center: {
        practice: 'Grounding Meditation',
        duration: '10 minutes', 
        description: 'Find your sacred center and balance'
      },
      release: {
        practice: 'Moon Flow & Restore',
        duration: '20 minutes',
        description: 'Let go of what no longer serves'
      },
      transform: {
        practice: 'Chakra Activation',
        duration: '25 minutes',
        description: 'Align and activate your energy centers'
      },
      flow: {
        practice: 'Intuitive Movement',
        duration: '18 minutes',
        description: 'Move with the rhythm of your soul'
      }
    };
    
    return content[mood as keyof typeof content];
  };

  const dashboardCards = getDashboardCards();

  return (
    <div className={`space-y-6 xs:space-y-8 ${className}`}>
      {/* Mood Selector */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
        <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-6 text-center">
          How does your soul feel today?
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.key}
              onClick={() => setSelectedMood(mood.key)}
              className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
                selectedMood === mood.key
                  ? 'bg-white/60 scale-105 shadow-lg'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            >
              <span className="text-2xl xs:text-3xl mb-2">{mood.emoji}</span>
              <span className="font-dreamy text-sm xs:text-base text-slate-700">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mood-based suggestion */}
        {selectedMood && (
          <div className="bg-white/40 rounded-2xl p-4 xs:p-6 border border-white/30 animation-fade-in">
            <div className="text-center">
              <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-2">
                {getMoodContent(selectedMood)?.practice}
              </h3>
              <p className="font-dreamy text-slate-600 mb-3">
                {getMoodContent(selectedMood)?.description}
              </p>
              <span className="inline-block bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium">
                {getMoodContent(selectedMood)?.duration}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              !card.available ? 'opacity-75' : ''
            }`}
          >
            <div className="text-center space-y-4">
              <div className="text-4xl xs:text-5xl">{card.icon}</div>
              <div>
                <h3 className="font-serif text-lg xs:text-xl text-slate-800 mb-2">
                  {card.title}
                </h3>
                <p className="font-dreamy text-sm xs:text-base text-slate-600 mb-4">
                  {card.description}
                </p>
              </div>
              
              {card.href ? (
                <Link
                  href={card.href}
                  className={`inline-block px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    card.available
                      ? 'bg-slate-800 text-white hover:bg-slate-900'
                      : 'bg-slate-400 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {card.action}
                </Link>
              ) : (
                <button
                  onClick={card.onClick}
                  disabled={!card.available}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    card.available
                      ? 'bg-slate-800 text-white hover:bg-slate-900'
                      : 'bg-slate-400 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {card.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade prompt for non-subscribers */}
      {(!session || tier === 'none' || !isActive) && (
        <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 text-center">
          <h3 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-4">
            Unlock Your Full Sanctuary Experience
          </h3>
          <p className="font-dreamy text-lg text-slate-600 mb-6">
            Join our sacred community and access personalized guidance, 
            exclusive content, and transformative practices designed just for you.
          </p>
          <Link
            href="/subscribe"
            className="inline-block bg-slate-800 text-white px-8 py-4 rounded-full font-serif tracking-widest uppercase hover:bg-slate-900 transition-all duration-300 hover:scale-105"
          >
            Explore Sacred Paths
          </Link>
        </div>
      )}
    </div>
  );
};

export default PersonalizedDashboard;
