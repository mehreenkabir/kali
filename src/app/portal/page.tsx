'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import MoodTracker from '@/components/diary/MoodTracker';
import PersonalJournal from '@/components/diary/PersonalJournal';
import PortalProfileEditor from '@/components/profile/PortalProfileEditor';
import Link from 'next/link';

const PortalPage: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'journal' | 'mood' | 'profile'>('overview');

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
                  <button
                    onClick={() => setCurrentView('profile')}
                    className={`px-6 py-2 rounded-xl font-serif text-sm tracking-wide transition-colors ${
                      currentView === 'profile'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Profile
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
                      <button
                        onClick={() => setCurrentView('profile')}
                        className="block w-full bg-white/40 hover:bg-white/60 text-slate-800 text-center py-3 rounded-xl font-serif tracking-wide transition-colors border border-white/60"
                      >
                        👤 Edit Profile
                      </button>
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

            {currentView === 'profile' && (
              <div className="max-w-4xl mx-auto">
                <PortalProfileEditor className="mb-6" />
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
