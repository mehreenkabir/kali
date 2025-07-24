'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import MoodTracker from '@/components/diary/MoodTracker';
import PersonalJournal from '@/components/diary/PersonalJournal';
import Link from 'next/link';

const PortalPage: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'journal' | 'mood'>('overview');

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
  }, [session, status, router, searchParams, update]);

  if (status === 'loading') {
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

  if (!session) {
    return null;
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mt-20 mx-4 p-4 bg-green-100 border border-green-200 rounded-lg text-green-800 text-center">
            🎉 Welcome to your subscription! Your spiritual journey begins now.
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
            
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-2">
                Your Sacred Sanctuary
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-2">
                Welcome back, {session.user.name}
              </p>
              <p className="font-dreamy text-sm text-slate-500">{today}</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/40 backdrop-blur-md rounded-2xl p-1 border border-white/60">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className={`px-6 py-2 rounded-xl font-serif text-sm tracking-wide transition-colors ${
                      currentView === 'overview'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setCurrentView('mood')}
                    className={`px-6 py-2 rounded-xl font-serif text-sm tracking-wide transition-colors ${
                      currentView === 'mood'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Daily Mood
                  </button>
                  <button
                    onClick={() => setCurrentView('journal')}
                    className={`px-6 py-2 rounded-xl font-serif text-sm tracking-wide transition-colors ${
                      currentView === 'journal'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Sacred Journal
                  </button>
                </div>
              </div>
            </div>

            {/* Content Based on Current View */}
            {currentView === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Mood Tracker Preview */}
                  <MoodTracker />
                  
                  {/* Quick Actions */}
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
                    <h3 className="font-serif text-xl text-slate-800 mb-4">Sacred Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/yoga"
                        className="block w-full bg-slate-800 hover:bg-slate-900 text-white text-center py-3 rounded-xl font-serif tracking-wide transition-colors"
                      >
                        🧘‍♀️ Begin Yoga Practice
                      </Link>
                      <button
                        onClick={() => setCurrentView('journal')}
                        className="block w-full bg-white/40 hover:bg-white/60 text-slate-800 text-center py-3 rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                      >
                        📖 Open Sacred Journal
                      </button>
                      <Link
                        href="/settings"
                        className="block w-full bg-white/40 hover:bg-white/60 text-slate-800 text-center py-3 rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                      >
                        ⚙️ Customize Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Personal Journal Preview */}
                  <PersonalJournal />
                  
                  {/* Subscription Status */}
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40">
                    <h3 className="font-serif text-xl text-slate-800 mb-4">Sanctuary Membership</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-dreamy text-slate-600">Current Plan:</span>
                        <span className="font-serif text-slate-800 capitalize">
                          {session.user.subscriptionTier === 'sanctuary' ? 'The Sanctuary' :
                           session.user.subscriptionTier === 'sanctum' ? 'The Inner Sanctum' :
                           'No Active Subscription'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-dreamy text-slate-600">Status:</span>
                        <span className={`font-medium capitalize ${
                          session.user.subscriptionStatus === 'active' ? 'text-green-600' : 'text-slate-600'
                        }`}>
                          {session.user.subscriptionStatus || 'Inactive'}
                        </span>
                      </div>
                      
                      {session.user.subscriptionTier === 'none' ? (
                        <div className="pt-3 border-t border-white/30">
                          <Link
                            href="/subscribe"
                            className="block w-full bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-slate-800 text-center py-3 rounded-xl font-serif tracking-wide transition-colors"
                          >
                            ✨ Unlock Full Experience
                          </Link>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-white/30">
                          <p className="font-dreamy text-green-700 text-sm text-center">
                            🌟 You have access to all sanctuary features
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'mood' && (
              <div className="max-w-2xl mx-auto">
                <MoodTracker className="mb-6" />
                <div className="text-center">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {currentView === 'journal' && (
              <div className="max-w-4xl mx-auto">
                <PersonalJournal className="mb-6" />
                <div className="text-center">
                  <button
                    onClick={() => setCurrentView('overview')}
                    className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                  >
                    ← Back to Overview
                  </button>
                </div>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4">
                <Link
                  href="/"
                  className="font-dreamy text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Home
                </Link>
                <span className="text-slate-400">•</span>
                <Link
                  href="/art"
                  className="font-dreamy text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Art
                </Link>
                <span className="text-slate-400">•</span>
                <Link
                  href="/math"
                  className="font-dreamy text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Math
                </Link>
                <span className="text-slate-400">•</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="font-dreamy text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
};

export default PortalPage;

  if (!session) {
    return null; // Will redirect
  }

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'sanctuary': return 'text-amber-600';
      case 'sanctum': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case 'sanctuary': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sanctum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSubscriptionTier = (tier: string) => {
    switch (tier) {
      case 'sanctuary': return 'The Sanctuary';
      case 'sanctum': return 'The Inner Sanctum';
      default: return 'No Active Subscription';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 xs:px-6 sm:px-8">
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mb-8 p-6 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-slate-800 mb-2">Welcome to Your Sanctuary! ✨</h3>
                    <p className="font-dreamy text-slate-700">Your subscription has been activated successfully. Your spiritual journey begins now.</p>
                  </div>
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="text-slate-600 hover:text-slate-800 text-xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Personalized Welcome */}
            <PersonalizedWelcome className="mb-8" />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 mb-8">
              
              {/* Left Column - Dashboard & Progress */}
              <div className="lg:col-span-2 space-y-6 xs:space-y-8">
                <PersonalizedDashboard />
                <ProgressTracker />
              </div>

              {/* Right Column - Profile & Quick Actions */}
              <div className="space-y-6 xs:space-y-8">
                {/* Profile Card */}
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl xs:text-2xl text-slate-800">
                      Your Profile
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubscriptionBadge(session.user.subscriptionTier || 'none')}`}>
                      {session.user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                      <p className="text-slate-800 font-serif">{session.user.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                      <p className="text-slate-800 font-serif">{session.user.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">Subscription</label>
                      <p className={`font-serif ${getSubscriptionColor(session.user.subscriptionTier || 'none')}`}>
                        {formatSubscriptionTier(session.user.subscriptionTier || 'none')}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-white/30">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-full font-serif tracking-wider transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                  <h3 className="font-serif text-xl text-slate-800 mb-6">Sacred Spaces</h3>
                  
                  <div className="space-y-4">
                    <Link
                      href="/yoga"
                      className="block bg-white/40 hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🧘‍♀️</span>
                        <div>
                          <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Yoga Sanctuary</h4>
                          <p className="font-dreamy text-sm text-slate-600">Guided practices & teachings</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/art"
                      className="block bg-white/40 hover:bg-white/60 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                          <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Art Collaboration</h4>
                          <p className="font-dreamy text-sm text-slate-600">Creative partnerships</p>
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

                    {session.user.subscriptionTier === 'none' && (
                      <Link
                        href="/subscribe"
                        className="block bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 rounded-2xl p-4 transition-all duration-300 hover:scale-105 group border border-purple-300"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <h4 className="font-serif text-slate-800 group-hover:text-slate-900">Upgrade</h4>
                            <p className="font-dreamy text-sm text-slate-600">Unlock full sanctuary</p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Content & Affirmations */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xs:gap-8">
              <ContentRecommendations />
              <MoodBasedAffirmations />
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
};

export default PortalPage;
