'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';

interface ProfileData {
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
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  phone_number?: string;
  preferred_metals?: string[];
  ring_size?: string;
  bracelet_size?: string;
  necklace_length_preference?: string;
  crystal_allergies?: string[];
  profile_completion_percentage?: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'spiritual' | 'shipping' | 'subscription'>('personal');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

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
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: keyof ProfileData, value: string, checked: boolean) => {
    const currentArray = (formData[field] as string[]) || [];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(result.profile);
        setShowSuccess(true);
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
          <p className="font-dreamy text-xl text-white">Loading your sacred profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const crystalOptions = [
    'Amethyst', 'Rose Quartz', 'Clear Quartz', 'Black Tourmaline', 'Citrine',
    'Labradorite', 'Moonstone', 'Garnet', 'Aquamarine', 'Tigers Eye',
    'Hematite', 'Carnelian', 'Aventurine', 'Sodalite', 'Fluorite'
  ];

  const metalOptions = ['Gold', 'Silver', 'Rose Gold', 'Platinum', 'Copper', 'Brass'];
  
  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const spiritualGoalOptions = [
    'Inner Peace', 'Spiritual Growth', 'Manifestation', 'Healing', 'Intuition Development',
    'Energy Work', 'Meditation Mastery', 'Emotional Balance', 'Connection to Nature',
    'Past Life Exploration', 'Chakra Alignment', 'Psychic Development'
  ];

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
              {profile.profile_completion_percentage !== undefined && (
                <div className="inline-block bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/40">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {profile.profile_completion_percentage === 100 ? '🌟' : '📝'}
                    </div>
                    <div className="text-left">
                      <div className="font-serif text-sm text-slate-800">Profile Completion</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                            style={{ width: `${profile.profile_completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {profile.profile_completion_percentage}%
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
                    { id: 'shipping', label: 'Shipping', icon: '📦' },
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
              
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Personal & Astrological Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birth Date */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Birth Date</label>
                      <input
                        type="date"
                        value={formData.birth_date || ''}
                        onChange={(e) => handleInputChange('birth_date', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Birth Time */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Birth Time (optional)</label>
                      <input
                        type="time"
                        value={formData.birth_time || ''}
                        onChange={(e) => handleInputChange('birth_time', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Birth Location */}
                    <div className="md:col-span-2">
                      <label className="block font-serif text-sm text-slate-700 mb-2">Birth Location</label>
                      <input
                        type="text"
                        placeholder="City, State, Country"
                        value={formData.birth_location || ''}
                        onChange={(e) => handleInputChange('birth_location', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Zodiac Sign */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Zodiac Sign</label>
                      <select
                        value={formData.zodiac_sign || ''}
                        onChange={(e) => handleInputChange('zodiac_sign', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="">Select your sign</option>
                        {zodiacSigns.map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>

                    {/* Moon Sign */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Moon Sign (optional)</label>
                      <select
                        value={formData.moon_sign || ''}
                        onChange={(e) => handleInputChange('moon_sign', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="">Select moon sign</option>
                        {zodiacSigns.map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>

                    {/* Rising Sign */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Rising Sign (optional)</label>
                      <select
                        value={formData.rising_sign || ''}
                        onChange={(e) => handleInputChange('rising_sign', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="">Select rising sign</option>
                        {zodiacSigns.map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone_number || ''}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Spiritual Preferences Tab */}
              {activeTab === 'spiritual' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Spiritual Journey & Preferences</h2>
                  
                  <div className="space-y-6">
                    {/* Meditation Experience */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-3">Meditation Experience</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['beginner', 'intermediate', 'advanced'].map(level => (
                          <label key={level} className="flex items-center p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                            <input
                              type="radio"
                              name="meditation_experience"
                              value={level}
                              checked={formData.meditation_experience === level}
                              onChange={(e) => handleInputChange('meditation_experience', e.target.value)}
                              className="mr-3"
                            />
                            <span className="font-dreamy capitalize">{level}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Practice Time */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-3">Preferred Practice Time</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['morning', 'afternoon', 'evening', 'night'].map(time => (
                          <label key={time} className="flex items-center p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                            <input
                              type="radio"
                              name="preferred_practice_time"
                              value={time}
                              checked={formData.preferred_practice_time === time}
                              onChange={(e) => handleInputChange('preferred_practice_time', e.target.value)}
                              className="mr-3"
                            />
                            <span className="font-dreamy capitalize">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Intention Focus */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Current Intention Focus</label>
                      <textarea
                        placeholder="What are you focusing on in your spiritual journey right now?"
                        value={formData.intention_focus || ''}
                        onChange={(e) => handleInputChange('intention_focus', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Spiritual Goals */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-3">Spiritual Goals (select all that apply)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {spiritualGoalOptions.map(goal => (
                          <label key={goal} className="flex items-center p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={(formData.spiritual_goals || []).includes(goal)}
                              onChange={(e) => handleArrayChange('spiritual_goals', goal, e.target.checked)}
                              className="mr-3"
                            />
                            <span className="font-dreamy text-sm">{goal}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Favorite Crystals */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-3">Favorite Crystals (select all that resonate)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {crystalOptions.map(crystal => (
                          <label key={crystal} className="flex items-center p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                            <input
                              type="checkbox"
                              checked={(formData.favorite_crystals || []).includes(crystal)}
                              onChange={(e) => handleArrayChange('favorite_crystals', crystal, e.target.checked)}
                              className="mr-3"
                            />
                            <span className="font-dreamy text-sm">{crystal}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information Tab */}
              {activeTab === 'shipping' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.shipping_first_name || ''}
                        onChange={(e) => handleInputChange('shipping_first_name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.shipping_last_name || ''}
                        onChange={(e) => handleInputChange('shipping_last_name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className="md:col-span-2">
                      <label className="block font-serif text-sm text-slate-700 mb-2">Address Line 1</label>
                      <input
                        type="text"
                        placeholder="Street address"
                        value={formData.shipping_address_line1 || ''}
                        onChange={(e) => handleInputChange('shipping_address_line1', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className="md:col-span-2">
                      <label className="block font-serif text-sm text-slate-700 mb-2">Address Line 2 (optional)</label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc."
                        value={formData.shipping_address_line2 || ''}
                        onChange={(e) => handleInputChange('shipping_address_line2', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.shipping_city || ''}
                        onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">State/Province</label>
                      <input
                        type="text"
                        value={formData.shipping_state || ''}
                        onChange={(e) => handleInputChange('shipping_state', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.shipping_postal_code || ''}
                        onChange={(e) => handleInputChange('shipping_postal_code', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block font-serif text-sm text-slate-700 mb-2">Country</label>
                      <select
                        value={formData.shipping_country || 'US'}
                        onChange={(e) => handleInputChange('shipping_country', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>

                    {/* Jewelry Preferences */}
                    {(profile.subscription_tier === 'sanctuary' || profile.subscription_tier === 'sanctum') && (
                      <>
                        <div className="md:col-span-2">
                          <h3 className="font-serif text-lg text-slate-800 mb-4 pt-6 border-t border-white/30">Jewelry Preferences</h3>
                        </div>

                        {/* Ring Size */}
                        <div>
                          <label className="block font-serif text-sm text-slate-700 mb-2">Ring Size</label>
                          <select
                            value={formData.ring_size || ''}
                            onChange={(e) => handleInputChange('ring_size', e.target.value)}
                            className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                          >
                            <option value="">Select size</option>
                            {Array.from({length: 13}, (_, i) => i + 4).map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>

                        {/* Preferred Metals */}
                        <div>
                          <label className="block font-serif text-sm text-slate-700 mb-3">Preferred Metals</label>
                          <div className="grid grid-cols-2 gap-3">
                            {metalOptions.map(metal => (
                              <label key={metal} className="flex items-center p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={(formData.preferred_metals || []).includes(metal)}
                                  onChange={(e) => handleArrayChange('preferred_metals', metal, e.target.checked)}
                                  className="mr-3"
                                />
                                <span className="font-dreamy text-sm">{metal}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                  <h2 className="font-serif text-2xl text-slate-800 mb-6">Subscription Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/40 rounded-2xl p-6">
                        <h3 className="font-serif text-lg text-slate-800 mb-2">Current Plan</h3>
                        <p className="font-dreamy text-2xl text-purple-600 capitalize mb-2">
                          {profile.subscription_tier === 'none' ? 'No Subscription' : 
                           profile.subscription_tier === 'sanctuary' ? 'The Sanctuary' : 'The Inner Sanctum'}
                        </p>
                        <p className="text-sm text-slate-600 capitalize">
                          Status: {profile.subscription_status}
                        </p>
                      </div>

                      <div className="bg-white/40 rounded-2xl p-6">
                        <h3 className="font-serif text-lg text-slate-800 mb-2">Monthly Rate</h3>
                        <p className="font-dreamy text-2xl text-green-600">
                          {profile.subscription_tier === 'sanctuary' ? '$33/month' :
                           profile.subscription_tier === 'sanctum' ? '$55/month' : 'Free'}
                        </p>
                        <p className="text-sm text-slate-600">
                          Automatically renewed
                        </p>
                      </div>
                    </div>

                    {profile.subscription_tier !== 'none' && (
                      <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl p-6">
                        <h3 className="font-serif text-lg text-slate-800 mb-4">Your Spiritual Features</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {profile.subscription_tier === 'sanctuary' && [
                            '🧘‍♀️ Personalized Meditation Portal',
                            '📖 Akashic Records Access', 
                            '💎 Crystal Guidance',
                            '🔮 Tarot Forecasts',
                            '📝 Mood & Journal Tracking',
                            '✨ Spiritual Insights'
                          ].map(feature => (
                            <div key={feature} className="flex items-center text-slate-700">
                              <span className="mr-2">{feature.split(' ')[0]}</span>
                              <span className="font-dreamy">{feature.substring(feature.indexOf(' ') + 1)}</span>
                            </div>
                          ))}

                          {profile.subscription_tier === 'sanctum' && [
                            '🧘‍♀️ Everything in Sanctuary',
                            '🌿 Ayurvedic Masterpath',
                            '💍 Custom Crystal Jewelry',
                            '⚡ Youth Elixir Practices',
                            '🌈 Personal Aura Readings',
                            '👥 One-on-One Coaching'
                          ].map(feature => (
                            <div key={feature} className="flex items-center text-slate-700">
                              <span className="mr-2">{feature.split(' ')[0]}</span>
                              <span className="font-dreamy">{feature.substring(feature.indexOf(' ') + 1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.subscription_tier === 'none' && (
                      <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl p-6 text-center">
                        <h3 className="font-serif text-lg text-slate-800 mb-4">Ready to Begin Your Spiritual Journey?</h3>
                        <div className="space-y-4">
                          <Link 
                            href="/yoga"
                            className="inline-block bg-white/70 hover:bg-white text-slate-800 font-serif px-6 py-3 rounded-full transition-all hover:scale-105"
                          >
                            Explore The Sanctuary - $33/month
                          </Link>
                          <br />
                          <Link 
                            href="/yoga"
                            className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-serif px-6 py-3 rounded-full transition-all hover:scale-105"
                          >
                            Enter The Inner Sanctum - $55/month
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-serif px-8 py-4 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
}
