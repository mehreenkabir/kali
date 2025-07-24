// FILE: src/app/settings/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import ProfileSettings from '@/components/profile/ProfileSettings';
import Link from 'next/link';

const SettingsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileUpdateCount, setProfileUpdateCount] = useState(0);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin?callbackUrl=/settings');
      return;
    }
  }, [session, status, router]);

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
    return null; // Will redirect
  }

  const handleProfileUpdate = (profile: any) => {
    setProfileUpdateCount(prev => prev + 1);
    console.log('Profile updated:', profile);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Header Section */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-4">
                Sacred Profile Settings
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-6">
                Customize your spiritual journey and jewelry preferences
              </p>
              
              {/* Breadcrumb Navigation */}
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
                <Link href="/portal" className="hover:text-slate-800 transition-colors font-dreamy">
                  Portal
                </Link>
                <span>→</span>
                <span className="font-medium text-slate-800">Settings</span>
              </div>
            </div>

            {/* Profile Settings Component */}
            <ProfileSettings 
              className="mb-8"
              onProfileUpdate={handleProfileUpdate}
            />

            {/* Additional Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8">
              
              {/* Subscription Management */}
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-4">
                  Subscription Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-dreamy text-slate-600">Current Plan:</span>
                    <span className="font-serif text-slate-800">
                      {session.user.subscriptionTier === 'sanctuary' ? 'The Sanctuary' :
                       session.user.subscriptionTier === 'sanctum' ? 'The Inner Sanctum' :
                       'No Active Subscription'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-dreamy text-slate-600">Status:</span>
                    <span className={`font-medium ${
                      session.user.subscriptionStatus === 'active' ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {session.user.subscriptionStatus || 'Inactive'}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/30">
                    {session.user.subscriptionTier === 'none' ? (
                      <Link
                        href="/subscribe"
                        className="block w-full bg-slate-800 hover:bg-slate-900 text-white text-center py-3 rounded-full font-serif tracking-wide transition-colors"
                      >
                        Explore Subscriptions
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/subscribe"
                          className="block w-full bg-white/40 hover:bg-white/60 text-slate-800 text-center py-3 rounded-full font-serif tracking-wide transition-colors border border-white/60"
                        >
                          Manage Subscription
                        </Link>
                        {session.user.subscriptionTier === 'sanctuary' && (
                          <Link
                            href="/subscribe"
                            className="block w-full bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-slate-800 text-center py-3 rounded-full font-serif tracking-wide transition-colors border border-purple-300"
                          >
                            Upgrade to Inner Sanctum
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Crystal Recommendations */}
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-4">
                  Crystal Guidance
                </h3>
                <div className="space-y-4">
                  <p className="font-dreamy text-slate-600 text-sm">
                    Based on your astrological profile, we'll recommend personalized crystals and create custom jewelry for your spiritual journey.
                  </p>
                  
                  {session.user.subscriptionTier !== 'none' ? (
                    <div className="bg-green-100 border border-green-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-600">✓</span>
                        <span className="font-serif text-green-800">Crystal Guidance Active</span>
                      </div>
                      <p className="font-dreamy text-green-700 text-sm">
                        You'll receive personalized crystal recommendations and have access to custom jewelry creation.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-100 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-amber-600">⏳</span>
                        <span className="font-serif text-amber-800">Upgrade Required</span>
                      </div>
                      <p className="font-dreamy text-amber-700 text-sm">
                        Subscribe to unlock personalized crystal guidance and custom jewelry.
                      </p>
                    </div>
                  )}

                  <button className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-full font-serif tracking-wide transition-colors">
                    View My Recommendations
                  </button>
                </div>
              </div>

              {/* Privacy & Notifications */}
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-4">
                  Privacy & Notifications
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                    <span className="font-dreamy text-slate-600">Email updates about new content</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                    <span className="font-dreamy text-slate-600">Crystal recommendation notifications</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/60 bg-white/40" />
                    <span className="font-dreamy text-slate-600">Monthly astrological insights</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                    <span className="font-dreamy text-slate-600">Order and shipping updates</span>
                  </label>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
                <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-4">
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <button className="w-full bg-white/40 hover:bg-white/60 text-slate-800 py-3 rounded-full font-serif tracking-wide transition-colors border border-white/60">
                    Download My Data
                  </button>
                  <button className="w-full bg-white/40 hover:bg-white/60 text-slate-800 py-3 rounded-full font-serif tracking-wide transition-colors border border-white/60">
                    Reset Preferences
                  </button>
                  <button className="w-full bg-red-100 hover:bg-red-200 text-red-800 py-3 rounded-full font-serif tracking-wide transition-colors border border-red-200">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 xs:mt-12 text-center">
              <div className="inline-flex space-x-4">
                <Link
                  href="/portal"
                  className="bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 rounded-full font-serif tracking-wide transition-colors border border-white/60"
                >
                  ← Back to Portal
                </Link>
                <Link
                  href="/yoga"
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-full font-serif tracking-wide transition-colors"
                >
                  Continue Journey →
                </Link>
              </div>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
};

export default SettingsPage;
