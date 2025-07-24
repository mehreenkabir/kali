'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';

interface DashboardData {
  recentMood?: {
    todayLogged: boolean;
    todayMood: string | null;
    needsCheck: boolean;
  };
  todaysContent?: {
    focus: string;
    affirmation: string;
    crystalOfDay: {
      name: string;
      purpose: string;
    };
  };
  progressStats?: {
    thirtyDayStats: {
      mood_entries: number;
      journal_entries: number;
      meditation_sessions: number;
    };
  };
}

export default function PortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-dreamy text-xl text-white">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const subscriptionTier = session.user.subscriptionTier;
  const userName = session.user.name || 'Beautiful Soul';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Welcome Header */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-4">
                Welcome, {userName} ✨
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-6">
                Your sacred spiritual sanctuary awaits
              </p>
            </div>

            {/* Daily Check-in */}
            {dashboardData?.recentMood?.needsCheck && (
              <div className="mb-8 bg-gradient-to-r from-rose-100/80 to-pink-100/80 backdrop-blur-sm rounded-3xl p-6 border border-white/50">
                <div className="text-center">
                  <h2 className="font-serif text-xl text-slate-800 mb-3">🌈 How is your soul today?</h2>
                  <p className="font-dreamy text-sm text-slate-600 mb-4">Take a moment to check in with yourself</p>
                  <Link 
                    href="/portal/mood"
                    className="inline-block bg-white/70 hover:bg-white text-slate-800 font-serif px-6 py-3 rounded-full transition-all hover:scale-105"
                  >
                    Track My Mood
                  </Link>
                </div>
              </div>
            )}

            {/* Today's Spiritual Content */}
            {dashboardData?.todaysContent && (
              <div className="mb-8 bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                <h2 className="font-serif text-2xl text-slate-800 mb-6">Today's Spiritual Focus: {dashboardData.todaysContent.focus}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/40 rounded-2xl p-6">
                    <h3 className="font-serif text-lg text-slate-800 mb-3">💎 Crystal of the Day</h3>
                    <p className="font-dreamy text-xl text-purple-600 mb-2">{dashboardData.todaysContent.crystalOfDay.name}</p>
                    <p className="text-sm text-slate-600">{dashboardData.todaysContent.crystalOfDay.purpose}</p>
                  </div>

                  <div className="bg-white/40 rounded-2xl p-6">
                    <h3 className="font-serif text-lg text-slate-800 mb-3">✨ Daily Affirmation</h3>
                    <p className="font-dreamy text-slate-700 italic">"{dashboardData.todaysContent.affirmation}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-slate-800 mb-6 text-center">Sacred Tools & Practices</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Essential Tools */}
                <Link href="/portal/mood" className="group bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🎭</div>
                  <h3 className="font-serif text-lg text-slate-800 mb-2">Mood Tracker</h3>
                  <p className="font-dreamy text-sm text-slate-600">Check in with your spiritual weather</p>
                </Link>

                <Link href="/portal/journal" className="group bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                  <h3 className="font-serif text-lg text-slate-800 mb-2">Sacred Journal</h3>
                  <p className="font-dreamy text-sm text-slate-600">Reflect and record your journey</p>
                </Link>

                <Link href="/portal/profile" className="group bg-white/30 hover:bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 transition-all hover:scale-105 hover:shadow-lg">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                  <h3 className="font-serif text-lg text-slate-800 mb-2">Profile Settings</h3>
                  <p className="font-dreamy text-sm text-slate-600">Customize your spiritual path</p>
                </Link>

                {/* Subscription Tier Features */}
                {(subscriptionTier === 'sanctuary' || subscriptionTier === 'sanctum') && (
                  <div className="group bg-gradient-to-r from-purple-200/50 to-pink-200/50 backdrop-blur-md rounded-2xl p-6 border border-white/40 cursor-pointer hover:scale-105 transition-all">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🧘‍♀️</div>
                    <h3 className="font-serif text-lg text-slate-800 mb-2">Meditation Portal</h3>
                    <p className="font-dreamy text-sm text-slate-600">Guided spiritual practices</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Overview */}
            {dashboardData?.progressStats && (
              <div className="mb-8 bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                <h2 className="font-serif text-2xl text-slate-800 mb-6 text-center">Your Spiritual Journey (Last 30 Days)</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center bg-white/40 rounded-2xl p-6">
                    <div className="text-3xl mb-2">🎭</div>
                    <div className="font-serif text-2xl text-purple-600">{dashboardData.progressStats.thirtyDayStats.mood_entries}</div>
                    <div className="font-dreamy text-sm text-slate-600">Mood Check-ins</div>
                  </div>

                  <div className="text-center bg-white/40 rounded-2xl p-6">
                    <div className="text-3xl mb-2">📖</div>
                    <div className="font-serif text-2xl text-green-600">{dashboardData.progressStats.thirtyDayStats.journal_entries}</div>
                    <div className="font-dreamy text-sm text-slate-600">Journal Entries</div>
                  </div>

                  <div className="text-center bg-white/40 rounded-2xl p-6">
                    <div className="text-3xl mb-2">🧘‍♀️</div>
                    <div className="font-serif text-2xl text-blue-600">{dashboardData.progressStats.thirtyDayStats.meditation_sessions}</div>
                    <div className="font-dreamy text-sm text-slate-600">Meditation Sessions</div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Status */}
            <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 backdrop-blur-md rounded-3xl p-8 border border-white/40">
              <div className="text-center">
                <h2 className="font-serif text-2xl text-slate-800 mb-4">
                  {subscriptionTier === 'sanctuary' ? '🌸 The Sanctuary Member' :
                   subscriptionTier === 'sanctum' ? '✨ Inner Sanctum Member' :
                   '🌱 Spiritual Seeker'}
                </h2>
                
                {subscriptionTier === 'none' ? (
                  <div>
                    <p className="font-dreamy text-slate-600 mb-6">Ready to deepen your spiritual journey?</p>
                    <div className="space-y-4">
                      <Link 
                        href="/yoga"
                        className="inline-block bg-white/70 hover:bg-white text-slate-800 font-serif px-6 py-3 rounded-full transition-all hover:scale-105 mr-4"
                      >
                        Join The Sanctuary - $33/month
                      </Link>
                      <Link 
                        href="/yoga"
                        className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-serif px-6 py-3 rounded-full transition-all hover:scale-105"
                      >
                        Enter The Inner Sanctum - $55/month
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-dreamy text-slate-600 mb-4">
                      Thank you for being part of our spiritual community ✨
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      {subscriptionTier === 'sanctuary' && [
                        '🧘‍♀️ Personalized Meditations',
                        '📖 Akashic Records Access',
                        '💎 Crystal Guidance',
                        '🔮 Tarot Forecasts',
                        '📝 Unlimited Tracking',
                        '✨ Daily Insights'
                      ].map((feature, index) => (
                        <div key={index} className="bg-white/40 rounded-xl p-3 text-center">
                          <span className="font-dreamy text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}

                      {subscriptionTier === 'sanctum' && [
                        '🌸 Everything in Sanctuary',
                        '🌿 Ayurvedic Guidance',
                        '💍 Custom Crystal Jewelry',
                        '⚡ Youth Elixir Practices',
                        '🌈 Personal Aura Readings',
                        '👥 One-on-One Coaching'
                      ].map((feature, index) => (
                        <div key={index} className="bg-white/40 rounded-xl p-3 text-center">
                          <span className="font-dreamy text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
}
