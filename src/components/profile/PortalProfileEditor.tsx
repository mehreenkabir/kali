// FILE: src/components/profile/PortalProfileEditor.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

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
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface PortalProfileEditorProps {
  className?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const PortalProfileEditor: React.FC<PortalProfileEditorProps> = ({ 
  className = '', 
  onProfileUpdate 
}) => {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'spiritual' | 'shipping' | 'jewelry'>('spiritual');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const autocompleteRef = useRef<any>(null);
  const birthLocationInputRef = useRef<HTMLInputElement>(null);
  const shippingAddressInputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps script (with fallback for demo)
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'demo_key_for_development') {
        // Demo mode - skip Google Maps loading
        setIsMapLoaded(false);
        return;
      }

      if (window.google) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setIsMapLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize autocomplete when maps are loaded
  useEffect(() => {
    if (isMapLoaded && birthLocationInputRef.current) {
      const birthAutocomplete = new window.google.maps.places.Autocomplete(
        birthLocationInputRef.current,
        { types: ['(cities)'] }
      );
      
      birthAutocomplete.addListener('place_changed', () => {
        const place = birthAutocomplete.getPlace();
        if (place.formatted_address) {
          updateProfile('birthLocation', place.formatted_address);
        }
      });
    }

    if (isMapLoaded && shippingAddressInputRef.current) {
      const shippingAutocomplete = new window.google.maps.places.Autocomplete(
        shippingAddressInputRef.current,
        { types: ['address'] }
      );
      
      shippingAutocomplete.addListener('place_changed', () => {
        const place = shippingAutocomplete.getPlace();
        if (place.address_components) {
          // Auto-fill address components
          let streetNumber = '';
          let route = '';
          let city = '';
          let state = '';
          let postalCode = '';
          let country = '';

          place.address_components.forEach((component: any) => {
            const types = component.types;
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('route')) {
              route = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            } else if (types.includes('country')) {
              country = component.short_name;
            }
          });

          setProfile(prev => ({
            ...prev,
            shippingAddressLine1: `${streetNumber} ${route}`.trim(),
            shippingCity: city,
            shippingState: state,
            shippingPostalCode: postalCode,
            shippingCountry: country
          }));
        }
      });
    }
  }, [isMapLoaded]);

  // Load profile data
  useEffect(() => {
    if (session?.user?.email) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!session?.user?.email) return;

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
    'Selenite', 'Labradorite', 'Moonstone', 'Carnelian', 'Hematite'
  ];

  const spiritualGoalOptions = [
    'Inner Peace', 'Emotional Healing', 'Spiritual Growth', 'Manifestation',
    'Protection', 'Love & Relationships', 'Abundance', 'Clarity', 'Grounding'
  ];

  const metalOptions = ['Gold', 'Silver', 'Rose Gold', 'Copper', 'Platinum'];

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const usCities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl xs:text-2xl text-slate-800">
          Your Sacred Profile
        </h2>
        {saveMessage && (
          <span className={`text-sm px-3 py-1 rounded-full ${
            saveMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {saveMessage}
          </span>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/20 rounded-full p-1">
        {[
          { id: 'spiritual', label: 'Spiritual', icon: '🌙' },
          { id: 'shipping', label: 'Address', icon: '📍' },
          { id: 'jewelry', label: 'Preferences', icon: '💎' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-full font-dreamy text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-md'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Spiritual Tab */}
      {activeTab === 'spiritual' && (
        <div className="space-y-6">
          {/* Birth Information */}
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-4">Birth Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={profile.birthDate || ''}
                  onChange={(e) => updateProfile('birthDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Birth Time</label>
                <input
                  type="time"
                  value={profile.birthTime || ''}
                  onChange={(e) => updateProfile('birthTime', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-600 mb-2">Birth Location</label>
              {isMapLoaded ? (
                <input
                  ref={birthLocationInputRef}
                  type="text"
                  value={profile.birthLocation || ''}
                  onChange={(e) => updateProfile('birthLocation', e.target.value)}
                  placeholder="Start typing your birth city..."
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                />
              ) : (
                <select
                  value={profile.birthLocation || ''}
                  onChange={(e) => updateProfile('birthLocation', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                >
                  <option value="">Select your birth city</option>
                  {usCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Zodiac Signs */}
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-4">Astrological Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Sun Sign</label>
                <select
                  value={profile.zodiacSign || ''}
                  onChange={(e) => updateProfile('zodiacSign', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                >
                  <option value="">Select Sign</option>
                  {zodiacSigns.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Moon Sign</label>
                <select
                  value={profile.moonSign || ''}
                  onChange={(e) => updateProfile('moonSign', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                >
                  <option value="">Select Sign</option>
                  {zodiacSigns.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Rising Sign</label>
                <select
                  value={profile.risingSign || ''}
                  onChange={(e) => updateProfile('risingSign', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                >
                  <option value="">Select Sign</option>
                  {zodiacSigns.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Spiritual Preferences */}
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-4">Spiritual Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Favorite Crystals</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {crystalOptions.map(crystal => (
                    <label key={crystal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(profile.favoriteCrystals || []).includes(crystal)}
                        onChange={(e) => updateArrayField('favoriteCrystals', crystal, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-dreamy text-slate-700">{crystal}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Spiritual Goals</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {spiritualGoalOptions.map(goal => (
                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(profile.spiritualGoals || []).includes(goal)}
                        onChange={(e) => updateArrayField('spiritualGoals', goal, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-dreamy text-slate-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.shippingFirstName || ''}
                    onChange={(e) => updateProfile('shippingFirstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.shippingLastName || ''}
                    onChange={(e) => updateProfile('shippingLastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Address {isMapLoaded ? '(Google Maps Autocomplete)' : ''}
                </label>
                {isMapLoaded ? (
                  <input
                    ref={shippingAddressInputRef}
                    type="text"
                    value={profile.shippingAddressLine1 || ''}
                    onChange={(e) => updateProfile('shippingAddressLine1', e.target.value)}
                    placeholder="Start typing your address..."
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.shippingAddressLine1 || ''}
                    onChange={(e) => updateProfile('shippingAddressLine1', e.target.value)}
                    placeholder="Street address..."
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">City</label>
                  <input
                    type="text"
                    value={profile.shippingCity || ''}
                    onChange={(e) => updateProfile('shippingCity', e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">State</label>
                  <select
                    value={profile.shippingState || ''}
                    onChange={(e) => updateProfile('shippingState', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  >
                    <option value="">Select State</option>
                    {usStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={profile.shippingPostalCode || ''}
                    onChange={(e) => updateProfile('shippingPostalCode', e.target.value)}
                    placeholder="ZIP Code"
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phoneNumber || ''}
                  onChange={(e) => updateProfile('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Jewelry Tab */}
      {activeTab === 'jewelry' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif text-lg text-slate-800 mb-4">Jewelry Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Preferred Metals</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {metalOptions.map(metal => (
                    <label key={metal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(profile.preferredMetals || []).includes(metal)}
                        onChange={(e) => updateArrayField('preferredMetals', metal, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-dreamy text-slate-700">{metal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Ring Size</label>
                  <select
                    value={profile.ringSize || ''}
                    onChange={(e) => updateProfile('ringSize', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  >
                    <option value="">Select Size</option>
                    {Array.from({ length: 13 }, (_, i) => i + 4).map(size => (
                      <option key={size} value={size.toString()}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Bracelet Size</label>
                  <select
                    value={profile.braceletSize || ''}
                    onChange={(e) => updateProfile('braceletSize', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  >
                    <option value="">Select Size</option>
                    <option value="XS">XS (6-7")</option>
                    <option value="S">S (7-8")</option>
                    <option value="M">M (8-9")</option>
                    <option value="L">L (9-10")</option>
                    <option value="XL">XL (10-11")</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Necklace Length</label>
                  <select
                    value={profile.necklaceLengthPreference || ''}
                    onChange={(e) => updateProfile('necklaceLengthPreference', e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 font-dreamy"
                  >
                    <option value="">Select Length</option>
                    <option value="Choker">Choker (14-16")</option>
                    <option value="Princess">Princess (17-19")</option>
                    <option value="Matinee">Matinee (20-24")</option>
                    <option value="Opera">Opera (28-36")</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={saveProfile}
          disabled={isSaving}
          className={`px-8 py-3 rounded-full font-serif text-white transition-all ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Profile ✨'}
        </button>
      </div>
    </div>
  );
};

export default PortalProfileEditor;
