'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import { SoulProfile } from '@/types/soul';
import MeditationPortal from '@/components/portal/MeditationPortal';
import AkashicRecords from '@/components/portal/AkashicRecords';
import CrystalGuidance from '@/components/portal/CrystalGuidance';
import TarotForecast from '@/components/portal/TarotForecast';
import AyurvedicMasterpath from '@/components/portal/AyurvedicMasterpath';
import CrystalJewelryCollection from '@/components/portal/CrystalJewelryCollection';
import YouthElixir from '@/components/portal/YouthElixir';
import AuraReadings from '@/components/portal/AuraReadings';
import ActivityDashboard from '@/components/portal/ActivityDashboard';
import { usePersonalizedPortal } from '@/hooks/usePersonalizedPortal';

const PortalPage: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentView, setCurrentView] = useState<
    'overview' | 'soul-profile' | 'guidance' | 'practice' | 'journal' | 'mood' | 'profile' | 'activity' |
    'meditations' | 'akashic' | 'crystals' | 'tarot' |
    'ayurveda' | 'jewelry' | 'elixir' | 'aura'
  >('overview');
  const [soulProfile, setSoulProfile] = useState<SoulProfile | null>(null);
  const [isLoadingSoulData, setIsLoadingSoulData] = useState(true);

  // Use personalized portal data
  const {
    personalizedData,
    activityStats,
    loading: personalizedLoading,
    error: personalizedError,
    savePersonalization,
    updatePersonalizationField,
    getMeditationRecommendations,
    getCrystalRecommendations,
    getTarotInsights
  } = usePersonalizedPortal();

  // Track subscription tier initialization
  useEffect(() => {
    if (session?.user?.subscriptionTier && personalizedData) {
      // Subscription tier is already handled in the personalized data
      console.log('User subscription tier:', session.user.subscriptionTier);
    }
  }, [session?.user?.subscriptionTier, personalizedData]);

  // Enhanced navigation structure
  const getNavigationTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: '🏛️' },
      { id: 'soul-profile', label: 'Soul Profile', icon: '✨' },
      { id: 'guidance', label: 'Soul Guidance', icon: '🔮' },
      { id: 'practice', label: 'Sacred Practice', icon: '🧘‍♀️' },
      { id: 'mood', label: 'Daily Mood', icon: '🌈' },
      { id: 'journal', label: 'Sacred Journal', icon: '📖' },
      { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    const sanctuaryTabs = session?.user?.subscriptionTier === 'sanctuary' || 
                          session?.user?.subscriptionTier === 'sanctum' ? [
      { id: 'meditations', label: 'Meditation Portal', icon: '🧘‍♀️' },
      { id: 'akashic', label: 'Akashic Records', icon: '📜' },
      { id: 'crystals', label: 'Crystal Guidance', icon: '💎' },
      { id: 'tarot', label: 'Tarot Forecast', icon: '🔮' }
    ] : [];

    const sanctumTabs = session?.user?.subscriptionTier === 'sanctum' ? [
      { id: 'ayurveda', label: 'Ayurvedic Path', icon: '🌿' },
      { id: 'jewelry', label: 'Crystal Jewelry', icon: '💍' },
      { id: 'elixir', label: 'Youth Elixir', icon: '🌸' },
      { id: 'aura', label: 'Aura Readings', icon: '✨' }
    ] : [];

    return [...baseTabs, ...sanctuaryTabs, ...sanctumTabs];
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Check if user came from successful Stripe checkout
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setShowSuccessMessage(true);
      update();
      const url = new URL(window.location.href);
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url);
    }

    // Create demo soul profile
    createDemoProfile();
  }, [session, status, router, searchParams, update]);

  const createDemoProfile = () => {
    const demoProfile: SoulProfile = {
      id: `demo-${session?.user?.id}`,
      user_id: session?.user?.id || 'demo-user',
      soul_age: 'mature',
      primary_archetype: 'mystic',
      secondary_archetype: 'healer',
      current_spiritual_state: {
        clarity: 7,
        peace: 8,
        vitality: 6,
        connection: 9,
        purpose: 8,
        timestamp: new Date()
      },
      rhythm_pattern: {
        soul_id: `demo-${session?.user?.id}`,
        optimal_practice_time: '06:30',
        energy_cycles: {
          daily_peak: 'morning',
          weekly_flow: ['contemplative', 'active', 'reflective', 'creative', 'integrative', 'social', 'restorative'],
          monthly_themes: ['inner_knowing', 'heart_opening', 'divine_connection']
        },
        preferred_modalities: ['meditation', 'breathwork', 'journaling', 'energy_healing'],
        growth_seasons: {
          current: 'tending',
          duration_weeks: 8
        },
        sacred_pauses: {
          frequency: 'daily',
          duration_minutes: 20
        }
      },
      sacred_intentions: [
        'Deepen connection with divine wisdom',
        'Heal ancestral patterns with love',
        'Serve others through authentic presence'
      ],
      growth_edges: [
        'Trust in divine timing',
        'Embracing vulnerability as strength',
        'Balancing service with self-care'
      ],
      wisdom_threads: [],
      sacred_moments: [],
      created_at: new Date(),
      last_attunement: new Date()
    };

    setSoulProfile(demoProfile);
    setIsLoadingSoulData(false);
  };

  if (status === 'loading' || isLoadingSoulData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-dreamy text-xl text-white">
            Attuning to your soul frequency...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mt-20 mx-4 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 text-center">
            🎉 Welcome to your Soul Portal! Your spiritual transformation journey begins now.
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="ml-4 text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Soul Portal Header */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-2">
                {currentView === 'overview' ? 'Soul Portal Demo' : 'Your Sacred Space'}
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-2">
                {currentView === 'overview' 
                  ? 'Revolutionary Spiritual Intelligence in Action' 
                  : getNavigationTabs().find(tab => tab.id === currentView)?.label || 'Sacred Practice'
                }
              </p>
              {soulProfile && currentView === 'overview' && (
                <p className="font-serif text-sm text-slate-500">
                  Archetype: {soulProfile.primary_archetype} • Soul Age: {soulProfile.soul_age} • Season: {soulProfile.rhythm_pattern.growth_seasons.current}
                </p>
              )}
            </div>

            {/* Enhanced Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-1 border border-white/60 max-w-full overflow-x-auto">
                <div className="flex space-x-1 min-w-max portal-navigation px-2">
                  {getNavigationTabs().map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCurrentView(tab.id as any);
                        // Optional: Track feature usage if needed
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-serif text-sm transition-all duration-200 whitespace-nowrap ${
                        currentView === tab.id 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Views */}
            {currentView === 'overview' && soulProfile && (
              <PersonalizedOverviewView 
                soulProfile={soulProfile} 
                setCurrentView={setCurrentView}
                personalizedData={personalizedData}
                activityStats={activityStats}
              />
            )}

            {currentView === 'soul-profile' && soulProfile && (
              <SoulProfileView soulProfile={soulProfile} />
            )}

            {currentView === 'guidance' && soulProfile && (
              <SoulGuidanceView soulProfile={soulProfile} />
            )}

            {currentView === 'practice' && soulProfile && (
              <SacredPracticeView soulProfile={soulProfile} />
            )}

            {/* Placeholder views for subscription features */}
            {currentView === 'mood' && (
              <ComingSoonView 
                title="Daily Mood Tracking" 
                icon="🌈" 
                description="Track your emotional landscape and spiritual weather patterns"
              />
            )}

            {currentView === 'journal' && (
              <ComingSoonView 
                title="Sacred Journal" 
                icon="📖" 
                description="A private space for your spiritual insights and reflections"
              />
            )}

            {currentView === 'profile' && (
              <ComingSoonView 
                title="Profile Settings" 
                icon="👤" 
                description="Customize your soul portal experience"
              />
            )}

            {currentView === 'activity' && (
              <ActivityDashboard onClose={() => setCurrentView('overview')} />
            )}

            {/* Sanctuary-tier features */}
            {currentView === 'meditations' && (
              <div className="max-w-6xl mx-auto">
                <MeditationPortal />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'akashic' && (
              <div className="max-w-6xl mx-auto">
                <AkashicRecords />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'crystals' && (
              <div className="max-w-6xl mx-auto">
                <CrystalGuidance />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'tarot' && (
              <div className="max-w-6xl mx-auto">
                <TarotForecast />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {/* Sanctum-tier features */}
            {currentView === 'ayurveda' && (
              <div className="max-w-6xl mx-auto">
                <AyurvedicMasterpath />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'jewelry' && (
              <div className="max-w-6xl mx-auto">
                <CrystalJewelryCollection />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'elixir' && (
              <div className="max-w-6xl mx-auto">
                <YouthElixir />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'aura' && (
              <div className="max-w-6xl mx-auto">
                <AuraReadings />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                             rounded-xl font-serif tracking-wide transition-colors 
                             border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
};

// Soul Profile View Component
const SoulProfileView: React.FC<{ soulProfile: SoulProfile }> = ({ soulProfile }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Soul Identity */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
        <h3 className="font-serif text-2xl text-slate-800 mb-6 text-center">Soul Identity</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {soulProfile.primary_archetype === 'mystic' ? '🔮' :
               soulProfile.primary_archetype === 'healer' ? '💫' :
               soulProfile.primary_archetype === 'warrior' ? '⚔️' :
               soulProfile.primary_archetype === 'sage' ? '📚' :
               soulProfile.primary_archetype === 'lover' ? '💖' :
               soulProfile.primary_archetype === 'creator' ? '🎨' :
               soulProfile.primary_archetype === 'sovereign' ? '👑' : '✨'}
            </div>
            <div className="font-serif text-xl text-slate-700 capitalize">
              {soulProfile.primary_archetype} Soul
            </div>
            <div className="font-dreamy text-slate-600 capitalize">
              {soulProfile.soul_age} Soul Age
            </div>
          </div>

          <div className="bg-white/40 rounded-2xl p-4">
            <h4 className="font-serif text-lg text-slate-800 mb-3">Sacred Intentions</h4>
            <ul className="space-y-2">
              {soulProfile.sacred_intentions.map((intention, index) => (
                <li key={index} className="font-dreamy text-slate-700 flex items-start">
                  <span className="text-amber-500 mr-2">✦</span>
                  {intention}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/40 rounded-2xl p-4">
            <h4 className="font-serif text-lg text-slate-800 mb-3">Growth Edges</h4>
            <ul className="space-y-2">
              {soulProfile.growth_edges.map((edge, index) => (
                <li key={index} className="font-dreamy text-slate-700 flex items-start">
                  <span className="text-emerald-500 mr-2">🌱</span>
                  {edge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Spiritual State */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
        <h3 className="font-serif text-2xl text-slate-800 mb-6 text-center">Current Spiritual State</h3>
        
        <div className="space-y-4">
          {[
            { name: 'Clarity', value: soulProfile.current_spiritual_state.clarity, color: 'from-blue-400 to-indigo-600' },
            { name: 'Peace', value: soulProfile.current_spiritual_state.peace, color: 'from-green-400 to-emerald-600' },
            { name: 'Vitality', value: soulProfile.current_spiritual_state.vitality, color: 'from-orange-400 to-red-600' },
            { name: 'Connection', value: soulProfile.current_spiritual_state.connection, color: 'from-purple-400 to-violet-600' },
            { name: 'Purpose', value: soulProfile.current_spiritual_state.purpose, color: 'from-yellow-400 to-amber-600' }
          ].map((aspect) => (
            <div key={aspect.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-serif text-slate-700">{aspect.name}</span>
                <span className="font-serif text-slate-800 font-medium">{aspect.value}/10</span>
              </div>
              <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${aspect.color} transition-all duration-700 ease-out`}
                  style={{ width: `${aspect.value * 10}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white/40 rounded-2xl p-4">
          <h4 className="font-serif text-lg text-slate-800 mb-3">Current Growth Season</h4>
          <div className="text-center">
            <div className="text-3xl mb-2">
              {soulProfile.rhythm_pattern.growth_seasons.current === 'planting' ? '🌱' :
               soulProfile.rhythm_pattern.growth_seasons.current === 'tending' ? '🌿' :
               soulProfile.rhythm_pattern.growth_seasons.current === 'harvesting' ? '🌾' : '🍂'}
            </div>
            <div className="font-serif text-xl text-slate-700 capitalize">
              {soulProfile.rhythm_pattern.growth_seasons.current} Season
            </div>
            <div className="font-dreamy text-slate-600">
              {soulProfile.rhythm_pattern.growth_seasons.duration_weeks} weeks remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Soul Guidance View Component
const SoulGuidanceView: React.FC<{ soulProfile: SoulProfile }> = ({ soulProfile }) => {
  const [guidance, setGuidance] = useState<string>('');
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);

  const generateGuidance = async () => {
    setIsLoadingGuidance(true);
    try {
      // Simulate soul guidance generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const archetypeGuidance = {
        mystic: "The veil between worlds grows thin for you now. Trust the whispers of intuition that come in the quiet moments. Your soul seeks deeper communion with the divine - create space for sacred solitude.",
        healer: "Your healing presence is needed in the world, but first tend to your own sacred wounds. The light you carry can only shine as bright as the love you show yourself. Practice radical self-compassion.",
        warrior: "Your inner fire burns bright with righteous purpose. Channel this sacred rage into compassionate action. The battles worth fighting are those that serve the highest good of all beings.",
        sage: "Ancient wisdom flows through you like a river of stars. Share your knowledge not as doctrine, but as invitation. Your words have the power to unlock doors others didn't know existed.",
        lover: "Your heart is a sacred chalice, overflowing with divine love. In this season, focus on loving boundaries - they are not walls but sacred containers for your precious energy.",
        creator: "The universe wishes to birth new realities through your hands and heart. Trust the creative impulses that arise, even when they seem impractical. Beauty is always practical to the soul.",
        sovereign: "True leadership flows from inner sovereignty. Rule first the kingdom of your own heart with wisdom and compassion. Others will naturally follow your authentic power."
      };

      const selectedGuidance = archetypeGuidance[soulProfile.primary_archetype as keyof typeof archetypeGuidance] || 
        "Your soul is calling you toward greater alignment with your authentic truth. Listen deeply to the wisdom within.";

      setGuidance(selectedGuidance);
    } catch (error) {
      setGuidance("The oracle speaks softly today. Return to your breath and ask again what your soul needs most.");
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 text-center">
        <h3 className="font-serif text-3xl text-slate-800 mb-6">Soul Oracle</h3>
        
        {!guidance && (
          <div className="space-y-6">
            <p className="font-dreamy text-lg text-slate-600 max-w-2xl mx-auto">
              The Soul Oracle reads the patterns of your spiritual journey and offers personalized guidance 
              based on your archetype, current state, and sacred intentions.
            </p>
            
            <button
              onClick={generateGuidance}
              disabled={isLoadingGuidance}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-serif px-8 py-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50"
            >
              <span>Receive Soul Guidance</span>
              <span className="text-xl">🔮</span>
            </button>
          </div>
        )}

        {isLoadingGuidance && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="font-dreamy text-lg text-slate-600">
              The Oracle is attuning to your soul frequency...
            </p>
          </div>
        )}

        {guidance && !isLoadingGuidance && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="text-4xl mb-4">🌟</div>
              <p className="font-dreamy text-lg text-slate-800 leading-relaxed">
                {guidance}
              </p>
            </div>
            
            <button
              onClick={() => setGuidance('')}
              className="font-serif text-slate-600 hover:text-slate-800 transition-colors"
            >
              Receive New Guidance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Sacred Practice View Component
const SacredPracticeView: React.FC<{ soulProfile: SoulProfile }> = ({ soulProfile }) => {
  const [currentPractice, setCurrentPractice] = useState<any>(null);
  const [isLoadingPractice, setIsLoadingPractice] = useState(false);

  const generatePractice = async () => {
    setIsLoadingPractice(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const practices = {
        mystic: {
          title: "Divine Communion Meditation",
          duration: 20,
          description: "A sacred practice to deepen your connection with divine consciousness",
          instructions: [
            "Find a quiet, sacred space where you won't be disturbed",
            "Light a candle or incense to create sacred atmosphere",
            "Sit comfortably with spine naturally erect",
            "Begin with 5 deep breaths, feeling your connection to the divine",
            "Focus on the space between your eyebrows, your spiritual eye",
            "Repeat silently: 'I am one with divine consciousness'",
            "Allow any insights or visions to flow through you naturally",
            "End with gratitude for the divine presence within and around you"
          ]
        },
        healer: {
          title: "Heart Chakra Healing Flow",
          duration: 15,
          description: "A gentle practice to open and heal your heart center",
          instructions: [
            "Place both hands on your heart center",
            "Take 3 deep breaths, sending love to yourself",
            "Visualize emerald green light filling your heart space",
            "Send this healing energy to any areas of pain or trauma",
            "Extend this loving energy to someone who needs healing",
            "Feel the connection between all hearts",
            "Close by affirming: 'I am a vessel of divine healing love'"
          ]
        }
      };

      const practice = practices[soulProfile.primary_archetype as keyof typeof practices] || {
        title: "Sacred Breath Practice",
        duration: 10,
        description: "A foundational practice for spiritual connection",
        instructions: [
          "Find a comfortable seated position",
          "Place one hand on your heart, one on your belly",
          "Breathe deeply and slowly for the full duration",
          "With each breath, feel more centered and present",
          "End with gratitude for this moment of sacred connection"
        ]
      };

      setCurrentPractice(practice);
    } catch (error) {
      console.error('Failed to generate practice:', error);
    } finally {
      setIsLoadingPractice(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
        <h3 className="font-serif text-3xl text-slate-800 mb-6 text-center">Sacred Practice</h3>
        
        {!currentPractice && (
          <div className="text-center space-y-6">
            <p className="font-dreamy text-lg text-slate-600 max-w-2xl mx-auto">
              Receive a personalized spiritual practice curated for your soul archetype and current spiritual state.
            </p>
            
            <button
              onClick={generatePractice}
              disabled={isLoadingPractice}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-serif px-8 py-4 rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50"
            >
              <span>Generate Sacred Practice</span>
              <span className="text-xl">🧘‍♀️</span>
            </button>
          </div>
        )}

        {isLoadingPractice && (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="font-dreamy text-lg text-slate-600">
              Curating your personalized practice...
            </p>
          </div>
        )}

        {currentPractice && !isLoadingPractice && (
          <div className="space-y-6">
            <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <h4 className="font-serif text-2xl text-slate-800 mb-2">{currentPractice.title}</h4>
              <p className="font-dreamy text-slate-600 mb-4">{currentPractice.description}</p>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full">
                <span className="text-sm">⏱️</span>
                <span className="font-serif">{currentPractice.duration} minutes</span>
              </div>
            </div>
            
            <div className="bg-white/40 rounded-2xl p-6">
              <h5 className="font-serif text-lg text-slate-800 mb-4">Practice Instructions</h5>
              <ol className="space-y-3">
                {currentPractice.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-serif mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="font-dreamy text-slate-700">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentPractice(null)}
                className="font-serif text-slate-600 hover:text-slate-800 transition-colors"
              >
                Generate New Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalPage;

// Personalized Overview View with User Analytics
const PersonalizedOverviewView: React.FC<{ 
  soulProfile: SoulProfile; 
  setCurrentView: (view: any) => void;
  personalizedData: any;
  activityStats: any;
}> = ({ soulProfile, setCurrentView, personalizedData, activityStats }) => {

  return (
    <div className="space-y-8">
      {/* Welcome Section with Personalization */}
      <div className="text-center bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
        <div className="text-6xl mb-4">
          {soulProfile.primary_archetype === 'mystic' ? '🔮' :
           soulProfile.primary_archetype === 'healer' ? '💫' :
           soulProfile.primary_archetype === 'warrior' ? '⚔️' :
           soulProfile.primary_archetype === 'sage' ? '📚' :
           soulProfile.primary_archetype === 'lover' ? '💖' :
           soulProfile.primary_archetype === 'creator' ? '🎨' :
           soulProfile.primary_archetype === 'sovereign' ? '👑' : '✨'}
        </div>
        <h2 className="font-serif text-3xl text-slate-800 mb-4">
          Welcome back, {soulProfile.primary_archetype} Soul
        </h2>
        <p className="font-dreamy text-lg text-slate-600 max-w-2xl mx-auto mb-4">
          Your personalized spiritual sanctuary. Track your growth, explore insights, and deepen your practice.
        </p>
        
        {/* User Analytics Quick Stats */}
        {activityStats && (
          <div className="flex justify-center space-x-6 mt-6">
            {activityStats.daysActive && (
              <div className="text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.daysActive}</div>
                <div className="font-dreamy text-sm text-slate-600">Days Active</div>
              </div>
            )}
            {activityStats.currentStreak && (
              <div className="text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.currentStreak}</div>
                <div className="font-dreamy text-sm text-slate-600">Day Streak</div>
              </div>
            )}
            {activityStats.totalSessions && (
              <div className="text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.totalSessions}</div>
                <div className="font-dreamy text-sm text-slate-600">Total Sessions</div>
              </div>
            )}
            {personalizedData?.profileCompletionPercentage && (
              <div className="text-center">
                <div className="font-serif text-2xl text-slate-800">{personalizedData.profileCompletionPercentage}%</div>
                <div className="font-dreamy text-sm text-slate-600">Profile Complete</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personalized Quick Access */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => {
            setCurrentView('soul-profile');
            // Optional: Track feature usage
          }}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Your Soul Profile</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Discover your archetype, soul age, and spiritual state
          </p>
        </button>

        <button
          onClick={() => {
            setCurrentView('mood');
            // Optional: Track mood tracking access
          }}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">🌈</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Daily Mood</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Track your emotional landscape and spiritual weather
          </p>
        </button>

        <button
          onClick={() => {
            setCurrentView('journal');
            // Optional: Track journal access
          }}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">📖</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Sacred Journal</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Document your spiritual insights and reflections
          </p>
        </button>
      </div>

      {/* Activity Dashboard Access */}
      <div className="text-center">
        <button
          onClick={() => setCurrentView('activity')}
          className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                   rounded-xl font-serif tracking-wide transition-colors 
                   border border-white/60"
        >
          📊 View Full Activity Dashboard
        </button>
      </div>

      {/* Subscription Features Preview */}
      {personalizedData?.user?.subscription_tier && (personalizedData.user.subscription_tier === 'sanctuary' || personalizedData.user.subscription_tier === 'sanctum') ? (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
          <h3 className="font-serif text-xl text-purple-800 mb-4">
            🎉 Your {personalizedData.user.subscription_tier === 'sanctuary' ? 'Sanctuary' : 'Inner Sanctum'} Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => setCurrentView('meditations')}
              className="bg-white/50 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
            >
              <div className="text-2xl mb-2">🧘‍♀️</div>
              <div className="font-serif text-purple-800">Meditation Portal</div>
            </button>
            <button
              onClick={() => setCurrentView('akashic')}
              className="bg-white/50 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
            >
              <div className="text-2xl mb-2">📜</div>
              <div className="font-serif text-purple-800">Akashic Records</div>
            </button>
            <button
              onClick={() => setCurrentView('crystals')}
              className="bg-white/50 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
            >
              <div className="text-2xl mb-2">💎</div>
              <div className="font-serif text-purple-800">Crystal Guidance</div>
            </button>
            <button
              onClick={() => setCurrentView('tarot')}
              className="bg-white/50 rounded-xl p-4 text-left hover:bg-white/70 transition-colors"
            >
              <div className="text-2xl mb-2">🔮</div>
              <div className="font-serif text-purple-800">Tarot Forecast</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-6 border border-amber-200">
          <h3 className="font-serif text-xl text-amber-800 mb-4">Unlock Your Full Potential</h3>
          <p className="font-dreamy text-amber-700 mb-4">
            Join thousands in their spiritual transformation journey with personalized guidance, 
            meditation libraries, and sacred tools.
          </p>
          <a 
            href="/subscribe"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-full 
                     font-serif hover:bg-amber-700 transition-colors"
          >
            Explore Subscription Options
          </a>
        </div>
      )}
    </div>
  );
};

// Overview View Component
const OverviewView: React.FC<{ soulProfile: SoulProfile; setCurrentView: (view: any) => void }> = ({ soulProfile, setCurrentView }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
        <div className="text-6xl mb-4">
          {soulProfile.primary_archetype === 'mystic' ? '🔮' :
           soulProfile.primary_archetype === 'healer' ? '💫' :
           soulProfile.primary_archetype === 'warrior' ? '⚔️' :
           soulProfile.primary_archetype === 'sage' ? '📚' :
           soulProfile.primary_archetype === 'lover' ? '💖' :
           soulProfile.primary_archetype === 'creator' ? '🎨' :
           soulProfile.primary_archetype === 'sovereign' ? '👑' : '✨'}
        </div>
        <h2 className="font-serif text-3xl text-slate-800 mb-4">
          Welcome, {soulProfile.primary_archetype} Soul
        </h2>
        <p className="font-dreamy text-lg text-slate-600 max-w-2xl mx-auto">
          This portal demonstrates how our revolutionary spiritual intelligence system creates 
          personalized experiences based on your unique soul signature.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setCurrentView('soul-profile')}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">✨</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Your Soul Profile</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Discover your archetype, soul age, and spiritual state
          </p>
        </button>

        <button
          onClick={() => setCurrentView('guidance')}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">🔮</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Soul Guidance</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Receive personalized wisdom for your journey
          </p>
        </button>

        <button
          onClick={() => setCurrentView('practice')}
          className="bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/40 
                   hover:bg-white/50 transition-all text-left group"
        >
          <div className="text-3xl mb-3">🧘‍♀️</div>
          <h3 className="font-serif text-xl text-slate-800 mb-2">Sacred Practice</h3>
          <p className="font-dreamy text-slate-600 text-sm">
            Curated practices for your soul archetype
          </p>
        </button>
      </div>

      {/* Demo Notice */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-200">
        <div className="text-center">
          <div className="text-2xl mb-3">🌟</div>
          <h3 className="font-serif text-xl text-amber-800 mb-2">
            Experience the Full Portal
          </h3>
          <p className="font-dreamy text-amber-700 mb-4">
            This is just a glimpse of what awaits you in the full spiritual portal. 
            Subscribers gain access to meditation libraries, crystal guidance, tarot forecasts, and more.
          </p>
          <a 
            href="/subscribe"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-full 
                     hover:bg-amber-700 transition-colors font-serif"
          >
            Explore Subscription Options
          </a>
        </div>
      </div>
    </div>
  );
};

// Coming Soon View Component
const ComingSoonView: React.FC<{ title: string; icon: string; description: string }> = ({ title, icon, description }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 border border-white/40">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="font-serif text-3xl text-slate-800 mb-4">{title}</h2>
        <p className="font-dreamy text-lg text-slate-600 mb-8">{description}</p>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
          <p className="font-serif text-purple-800 mb-4">✨ Coming Soon in the Full Portal</p>
          <a 
            href="/subscribe"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full 
                     hover:bg-purple-700 transition-colors font-serif"
          >
            Join to Get Early Access
          </a>
        </div>
      </div>
    </div>
  );
};

// Subscription Feature View Component
const SubscriptionFeatureView: React.FC<{ 
  title: string; 
  icon: string; 
  description: string; 
  tier: 'sanctuary' | 'sanctum' 
}> = ({ title, icon, description, tier }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-12 border border-white/40">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="font-serif text-3xl text-slate-800 mb-4">{title}</h2>
        <p className="font-dreamy text-lg text-slate-600 mb-8">{description}</p>
        
        <div className={`rounded-2xl p-6 border ${
          tier === 'sanctuary' 
            ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-200' 
            : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200'
        }`}>
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              tier === 'sanctuary' 
                ? 'bg-amber-200 text-amber-800' 
                : 'bg-purple-200 text-purple-800'
            }`}>
              {tier === 'sanctuary' ? '🏛️ The Sanctuary' : '💎 The Inner Sanctum'}
            </span>
          </div>
          
          <p className={`font-serif mb-4 ${
            tier === 'sanctuary' ? 'text-amber-800' : 'text-purple-800'
          }`}>
            {tier === 'sanctuary' 
              ? 'Available with Sanctuary membership ($33/month)' 
              : 'Exclusive to Inner Sanctum members ($55/month)'
            }
          </p>
          
          <a 
            href="/subscribe"
            className={`inline-block px-6 py-3 rounded-full transition-colors font-serif text-white ${
              tier === 'sanctuary' 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {tier === 'sanctuary' ? 'Join The Sanctuary' : 'Enter The Inner Sanctum'}
          </a>
        </div>
      </div>
    </div>
  );
};
