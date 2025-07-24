'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import ProfileSettings from '@/components/profile/ProfileSettings';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  subscription_status: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  zodiac_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  favorite_crystals?: string[];
  spiritual_goals?: string[];
  meditation_experience?: string;
  preferred_practice_time?: string;
  intention_focus?: string;
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address_line1?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  phone_number?: string;
  profileCompletionPercentage?: number;
  crystalRecommendations?: any[];
}

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'spiritual' | 'preferences' | 'subscription'>('personal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchProfile();
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      // Update via the personalization API for comprehensive updates
      const response = await fetch('/api/user/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setShowSuccess(true);
        await fetchProfile();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-dreamy text-xl text-white">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-6xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-4">
                Sacred Profile
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-6">
                Customize your spiritual journey and preferences
              </p>
              
              {/* Navigation */}
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 mb-6">
                <Link href="/portal" className="hover:text-slate-800 transition-colors font-dreamy">
                  Portal
                </Link>
                <span>→</span>
                <span className="font-medium text-slate-800">Profile Settings</span>
              </div>

              {/* Profile Completion */}
              {profile.profileCompletionPercentage !== undefined && (
                <div className="inline-block bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {profile.profileCompletionPercentage === 100 ? '🌟' : '📝'}
                    </div>
                    <div className="text-left">
                      <div className="font-serif text-sm text-slate-800">Profile Completion</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${profile.profileCompletionPercentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {profile.profileCompletionPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-2xl text-green-800 text-center animate-fadeIn">
                <span className="text-2xl mr-2">✨</span>
                Profile updated successfully!
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/30 backdrop-blur-md rounded-2xl p-1 border border-white/40">
                <div className="flex space-x-1">
                  {[
                    { id: 'personal', label: 'Personal', icon: '👤' },
                    { id: 'spiritual', label: 'Spiritual', icon: '✨' },
                    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                    { id: 'subscription', label: 'Subscription', icon: '💎' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-serif text-sm transition-all ${
                        activeTab === tab.id 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-800 hover:bg-white/30'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto">
              {activeTab === 'personal' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Personal Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name || ''}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.email || ''}
                          disabled
                          className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-xl 
                                   text-slate-600 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          value={profile.birth_date || ''}
                          onChange={(e) => setProfile({...profile, birth_date: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Birth Time
                        </label>
                        <input
                          type="time"
                          value={profile.birth_time || ''}
                          onChange={(e) => setProfile({...profile, birth_time: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                      
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Birth Location
                        </label>
                        <input
                          type="text"
                          value={profile.birth_location || ''}
                          onChange={(e) => setProfile({...profile, birth_location: e.target.value})}
                          placeholder="City, Country"
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-dreamy text-sm text-slate-600 block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone_number || ''}
                        onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <button
                      onClick={() => handleProfileUpdate(profile)}
                      disabled={isSaving}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-serif 
                               py-3 rounded-full transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Personal Information'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'spiritual' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Spiritual Profile</h2>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Sun Sign ☉
                        </label>
                        <select
                          value={profile.zodiac_sign || ''}
                          onChange={(e) => setProfile({...profile, zodiac_sign: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="">Select...</option>
                          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                            .map(sign => (
                              <option key={sign} value={sign.toLowerCase()}>{sign}</option>
                            ))
                          }
                        </select>
                      </div>
                      
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Moon Sign ☽
                        </label>
                        <select
                          value={profile.moon_sign || ''}
                          onChange={(e) => setProfile({...profile, moon_sign: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="">Select...</option>
                          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                            .map(sign => (
                              <option key={sign} value={sign.toLowerCase()}>{sign}</option>
                            ))
                          }
                        </select>
                      </div>
                      
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Rising Sign ↑
                        </label>
                        <select
                          value={profile.rising_sign || ''}
                          onChange={(e) => setProfile({...profile, rising_sign: e.target.value})}
                          className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                   text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          <option value="">Select...</option>
                          {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                            .map(sign => (
                              <option key={sign} value={sign.toLowerCase()}>{sign}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-dreamy text-sm text-slate-600 block mb-2">
                        Meditation Experience
                      </label>
                      <select
                        value={profile.meditation_experience || ''}
                        onChange={(e) => setProfile({...profile, meditation_experience: e.target.value})}
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="">Select your experience level...</option>
                        <option value="beginner">Beginner - Just starting my journey</option>
                        <option value="intermediate">Intermediate - Regular practice</option>
                        <option value="advanced">Advanced - Deep daily practice</option>
                        <option value="teacher">Teacher - Guiding others</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-dreamy text-sm text-slate-600 block mb-2">
                        Spiritual Goals
                      </label>
                      <textarea
                        value={profile.spiritual_goals?.join('\n') || ''}
                        onChange={(e) => setProfile({
                          ...profile, 
                          spiritual_goals: e.target.value.split('\n').filter(g => g.trim())
                        })}
                        rows={4}
                        placeholder="Enter each goal on a new line..."
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 
                                 resize-none"
                      />
                    </div>

                    <div>
                      <label className="font-dreamy text-sm text-slate-600 block mb-2">
                        Preferred Practice Time
                      </label>
                      <select
                        value={profile.preferred_practice_time || ''}
                        onChange={(e) => setProfile({...profile, preferred_practice_time: e.target.value})}
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="">Select preferred time...</option>
                        <option value="early_morning">Early Morning (4am-6am)</option>
                        <option value="morning">Morning (6am-9am)</option>
                        <option value="midday">Midday (11am-2pm)</option>
                        <option value="evening">Evening (5pm-8pm)</option>
                        <option value="night">Night (8pm-11pm)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleProfileUpdate(profile)}
                      disabled={isSaving}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-serif 
                               py-3 rounded-full transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Spiritual Profile'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  {/* Crystal Preferences */}
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                    <h3 className="font-serif text-xl text-slate-800 mb-4">Crystal Preferences</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="font-dreamy text-sm text-slate-600 block mb-2">
                          Favorite Crystals
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                          {['Amethyst', 'Rose Quartz', 'Clear Quartz', 'Citrine', 'Black Tourmaline', 
                            'Selenite', 'Labradorite', 'Moonstone', 'Carnelian']
                            .map(crystal => (
                              <label key={crystal} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={profile.favorite_crystals?.includes(crystal) || false}
                                  onChange={(e) => {
                                    const current = profile.favorite_crystals || [];
                                    if (e.target.checked) {
                                      setProfile({...profile, favorite_crystals: [...current, crystal]});
                                    } else {
                                      setProfile({
                                        ...profile, 
                                        favorite_crystals: current.filter(c => c !== crystal)
                                      });
                                    }
                                  }}
                                  className="rounded border-white/60 bg-white/40"
                                />
                                <span className="font-dreamy text-sm text-slate-700">{crystal}</span>
                              </label>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                    <h3 className="font-serif text-xl text-slate-800 mb-4">Notifications</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                        <span className="font-dreamy text-slate-700">Daily mood check-in reminders</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                        <span className="font-dreamy text-slate-700">Weekly spiritual insights</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="rounded border-white/60 bg-white/40" />
                        <span className="font-dreamy text-slate-700">New content alerts</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-white/60 bg-white/40" />
                        <span className="font-dreamy text-slate-700">Crystal jewelry updates</span>
                      </label>
                    </div>

                    <button
                      onClick={() => handleProfileUpdate(profile)}
                      disabled={isSaving}
                      className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white font-serif 
                               py-3 rounded-full transition-colors disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'subscription' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Subscription Details</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-white/40 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-lg text-slate-800">Current Plan</h3>
                          <p className="font-dreamy text-slate-600">
                            {profile.subscription_tier === 'sanctuary' ? 'The Sanctuary' :
                             profile.subscription_tier === 'sanctum' ? 'The Inner Sanctum' :
                             'No Active Subscription'}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                          profile.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {profile.subscription_status || 'Inactive'}
                        </div>
                      </div>

                      {profile.subscription_tier !== 'none' && (
                        <>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-dreamy text-slate-600">Monthly Price:</span>
                              <span className="font-medium text-slate-800">
                                ${profile.subscription_tier === 'sanctuary' ? '33' : '55'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-dreamy text-slate-600">Next Billing:</span>
                              <span className="font-medium text-slate-800">
                                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3">
                            <Link
                              href="/subscribe"
                              className="block w-full bg-white/60 hover:bg-white/80 text-slate-800 
                                       text-center py-3 rounded-full font-serif tracking-wide 
                                       transition-colors border border-white/60"
                            >
                              Manage Subscription
                            </Link>
                            {profile.subscription_tier === 'sanctuary' && (
                              <Link
                                href="/subscribe"
                                className="block w-full bg-gradient-to-r from-purple-200 to-pink-200 
                                         hover:from-purple-300 hover:to-pink-300 text-slate-800 
                                         text-center py-3 rounded-full font-serif tracking-wide 
                                         transition-colors border border-purple-300"
                              >
                                Upgrade to Inner Sanctum
                              </Link>
                            )}
                          </div>
                        </>
                      )}

                      {profile.subscription_tier === 'none' && (
                        <Link
                          href="/subscribe"
                          className="block w-full bg-purple-500 hover:bg-purple-600 text-white 
                                   text-center py-3 rounded-full font-serif tracking-wide 
                                   transition-colors"
                        >
                          Explore Subscriptions
                        </Link>
                      )}
                    </div>

                    {/* Crystal Recommendations if available */}
                    {profile.crystalRecommendations && profile.crystalRecommendations.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
                        <h3 className="font-serif text-lg text-purple-800 mb-4">
                          Your Crystal Recommendations
                        </h3>
                        <div className="space-y-3">
                          {profile.crystalRecommendations.slice(0, 3).map((rec, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <span className="text-2xl">💎</span>
                              <div>
                                <div className="font-medium text-purple-800">{rec.crystal_type}</div>
                                <div className="font-dreamy text-sm text-purple-600">{rec.reason}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Back to Portal */}
            <div className="mt-8 text-center">
              <Link
                href="/portal"
                className="inline-block bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                         rounded-xl font-serif tracking-wide transition-colors border border-white/60"
              >
                ← Back to Portal
              </Link>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
}