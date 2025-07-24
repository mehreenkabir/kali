// FILE: src/components/profile/ProfileSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface UserProfile {
  // Personal & Spiritual Info
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  zodiacSign?: string;
  moonSign?: string;
  risingSign?: string;
  
  // Spiritual Preferences
  favoriteCrystals?: string[];
  spiritualGoals?: string[];
  meditationExperience?: 'beginner' | 'intermediate' | 'advanced';
  preferredPracticeTime?: 'morning' | 'afternoon' | 'evening' | 'night';
  intentionFocus?: string;
  
  // Shipping Information
  shippingFirstName?: string;
  shippingLastName?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Jewelry Preferences
  preferredMetals?: string[];
  ringSize?: string;
  braceletSize?: string;
  necklaceLengthPreference?: string;
  crystalAllergies?: string[];
  
  // Profile Status
  profileCompleted?: boolean;
  addressVerified?: boolean;
  astrologyProfileCompleted?: boolean;
  jewelryProfileCompleted?: boolean;
}

interface ProfileSettingsProps {
  className?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ className = '', onProfileUpdate }) => {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<'personal' | 'spiritual' | 'shipping' | 'jewelry'>('personal');
  const [profile, setProfile] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Load user profile on component mount
  useEffect(() => {
    if (session?.user?.id) {
      loadUserProfile();
    }
  }, [session?.user?.id]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!session?.user?.id) {
      signIn();
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSaveMessage('Profile saved successfully! ✨');
        
        // Update session if needed
        await update();
        
        // Trigger callback if provided
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Error saving profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArrayField = (field: keyof UserProfile, value: string, checked: boolean) => {
    const currentArray = (profile[field] as string[]) || [];
    let newArray;
    
    if (checked) {
      newArray = [...currentArray, value];
    } else {
      newArray = currentArray.filter(item => item !== value);
    }
    
    updateProfile(field, newArray);
  };

  const crystalOptions = [
    'Amethyst', 'Rose Quartz', 'Clear Quartz', 'Black Tourmaline', 'Citrine',
    'Labradorite', 'Moonstone', 'Selenite', 'Green Aventurine', 'Carnelian',
    'Lapis Lazuli', 'Malachite', 'Tiger\'s Eye', 'Fluorite', 'Obsidian'
  ];

  const spiritualGoalsOptions = [
    'Inner Peace', 'Manifestation', 'Healing', 'Protection', 'Love & Relationships',
    'Abundance', 'Spiritual Growth', 'Intuition Development', 'Energy Clearing',
    'Grounding', 'Chakra Balancing', 'Past Life Healing', 'Shadow Work'
  ];

  const metalOptions = ['Sterling Silver', 'Gold Filled', 'Rose Gold', 'Copper', 'Brass'];

  const tabs = [
    { key: 'personal', label: 'Personal', icon: '👤' },
    { key: 'spiritual', label: 'Spiritual', icon: '🔮' },
    { key: 'shipping', label: 'Shipping', icon: '📦' },
    { key: 'jewelry', label: 'Jewelry', icon: '💎' }
  ];

  if (!session) {
    return (
      <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 text-center ${className}`}>
        <h2 className="font-serif text-2xl text-slate-800 mb-4">Complete Your Sacred Profile</h2>
        <p className="font-dreamy text-slate-600 mb-6">
          Sign in to personalize your spiritual journey and receive custom crystal jewelry.
        </p>
        <button
          onClick={() => signIn()}
          className="bg-slate-800 text-white px-8 py-3 rounded-full font-serif tracking-wide hover:bg-slate-900 transition-colors"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Your Sacred Profile
          </h2>
          <p className="font-dreamy text-slate-600">
            Customize your spiritual journey and jewelry preferences
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`p-4 rounded-2xl text-center font-dreamy ${
            saveMessage.includes('Error') 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 xs:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-white/60 text-slate-800 shadow-lg'
                  : 'bg-white/20 text-slate-600 hover:bg-white/40'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-dreamy text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Personal Information Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-slate-800 mb-4">Astrological Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Birth Date</label>
                      <input
                        type="date"
                        value={profile.birthDate || ''}
                        onChange={(e) => updateProfile('birthDate', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Birth Time</label>
                      <input
                        type="time"
                        value={profile.birthTime || ''}
                        onChange={(e) => updateProfile('birthTime', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Birth Location</label>
                    <input
                      type="text"
                      placeholder="City, State, Country"
                      value={profile.birthLocation || ''}
                      onChange={(e) => updateProfile('birthLocation', e.target.value)}
                      className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Sun Sign</label>
                      <select
                        value={profile.zodiacSign || ''}
                        onChange={(e) => updateProfile('zodiacSign', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Sign</option>
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Moon Sign</label>
                      <select
                        value={profile.moonSign || ''}
                        onChange={(e) => updateProfile('moonSign', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Sign</option>
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Rising Sign</label>
                      <select
                        value={profile.risingSign || ''}
                        onChange={(e) => updateProfile('risingSign', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Sign</option>
                        {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                          <option key={sign} value={sign}>{sign}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Spiritual Preferences Tab */}
              {activeTab === 'spiritual' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-slate-800 mb-4">Spiritual Journey</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Meditation Experience</label>
                      <select
                        value={profile.meditationExperience || ''}
                        onChange={(e) => updateProfile('meditationExperience', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Preferred Practice Time</label>
                      <select
                        value={profile.preferredPracticeTime || ''}
                        onChange={(e) => updateProfile('preferredPracticeTime', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Time</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Current Intention Focus</label>
                    <input
                      type="text"
                      placeholder="What are you manifesting or healing right now?"
                      value={profile.intentionFocus || ''}
                      onChange={(e) => updateProfile('intentionFocus', e.target.value)}
                      className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-3">Favorite Crystals</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {crystalOptions.map(crystal => (
                        <label key={crystal} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(profile.favoriteCrystals || []).includes(crystal)}
                            onChange={(e) => updateArrayField('favoriteCrystals', crystal, e.target.checked)}
                            className="rounded border-white/60 bg-white/40"
                          />
                          <span className="font-dreamy text-sm text-slate-700">{crystal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-3">Spiritual Goals</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {spiritualGoalsOptions.map(goal => (
                        <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(profile.spiritualGoals || []).includes(goal)}
                            onChange={(e) => updateArrayField('spiritualGoals', goal, e.target.checked)}
                            className="rounded border-white/60 bg-white/40"
                          />
                          <span className="font-dreamy text-sm text-slate-700">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Information Tab */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-slate-800 mb-4">Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profile.shippingFirstName || ''}
                        onChange={(e) => updateProfile('shippingFirstName', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.shippingLastName || ''}
                        onChange={(e) => updateProfile('shippingLastName', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Address Line 1</label>
                    <input
                      type="text"
                      value={profile.shippingAddressLine1 || ''}
                      onChange={(e) => updateProfile('shippingAddressLine1', e.target.value)}
                      className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={profile.shippingAddressLine2 || ''}
                      onChange={(e) => updateProfile('shippingAddressLine2', e.target.value)}
                      className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">City</label>
                      <input
                        type="text"
                        value={profile.shippingCity || ''}
                        onChange={(e) => updateProfile('shippingCity', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">State</label>
                      <input
                        type="text"
                        value={profile.shippingState || ''}
                        onChange={(e) => updateProfile('shippingState', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={profile.shippingPostalCode || ''}
                        onChange={(e) => updateProfile('shippingPostalCode', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Country</label>
                      <select
                        value={profile.shippingCountry || 'US'}
                        onChange={(e) => updateProfile('shippingCountry', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phoneNumber || ''}
                        onChange={(e) => updateProfile('phoneNumber', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={profile.emergencyContactName || ''}
                        onChange={(e) => updateProfile('emergencyContactName', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        value={profile.emergencyContactPhone || ''}
                        onChange={(e) => updateProfile('emergencyContactPhone', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Jewelry Preferences Tab */}
              {activeTab === 'jewelry' && (
                <div className="space-y-6">
                  <h3 className="font-serif text-xl text-slate-800 mb-4">Jewelry Preferences</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-3">Preferred Metals</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {metalOptions.map(metal => (
                        <label key={metal} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(profile.preferredMetals || []).includes(metal)}
                            onChange={(e) => updateArrayField('preferredMetals', metal, e.target.checked)}
                            className="rounded border-white/60 bg-white/40"
                          />
                          <span className="font-dreamy text-sm text-slate-700">{metal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Ring Size</label>
                      <select
                        value={profile.ringSize || ''}
                        onChange={(e) => updateProfile('ringSize', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Size</option>
                        {['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Bracelet Size</label>
                      <select
                        value={profile.braceletSize || ''}
                        onChange={(e) => updateProfile('braceletSize', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Size</option>
                        <option value="XS">XS (6-6.5")</option>
                        <option value="S">S (6.5-7")</option>
                        <option value="M">M (7-7.5")</option>
                        <option value="L">L (7.5-8")</option>
                        <option value="XL">XL (8-8.5")</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Necklace Length</label>
                      <select
                        value={profile.necklaceLengthPreference || ''}
                        onChange={(e) => updateProfile('necklaceLengthPreference', e.target.value)}
                        className="w-full p-3 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">Select Length</option>
                        <option value="choker">Choker (14-16")</option>
                        <option value="princess">Princess (18")</option>
                        <option value="matinee">Matinee (20-24")</option>
                        <option value="opera">Opera (28-36")</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-3">Crystal Allergies or Sensitivities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {crystalOptions.map(crystal => (
                        <label key={crystal} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(profile.crystalAllergies || []).includes(crystal)}
                            onChange={(e) => updateArrayField('crystalAllergies', crystal, e.target.checked)}
                            className="rounded border-white/60 bg-white/40"
                          />
                          <span className="font-dreamy text-sm text-slate-700">{crystal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-6 border-t border-white/30">
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-8 py-3 rounded-full font-serif tracking-wide transition-colors flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Save Sacred Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
