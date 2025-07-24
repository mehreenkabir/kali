// FILE: src/components/yoga/PersonalizedWelcome.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface PersonalizedWelcomeProps {
  className?: string;
}

const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [personalMessage, setPersonalMessage] = useState<string>('');

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Get time-based greeting
      let timeGreeting = '';
      if (hour < 5) {
        timeGreeting = 'Sacred midnight hours';
      } else if (hour < 12) {
        timeGreeting = 'Beautiful morning';
      } else if (hour < 17) {
        timeGreeting = 'Radiant afternoon';
      } else if (hour < 21) {
        timeGreeting = 'Golden evening';
      } else {
        timeGreeting = 'Peaceful night';
      }
      
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setGreeting(timeGreeting);
    };

    // Get personalized message based on subscription tier
    const getPersonalMessage = () => {
      if (!session) return 'Welcome to your sanctuary';
      
      const tier = session.user?.subscriptionTier;
      const name = session.user?.name?.split(' ')[0] || 'Beautiful soul';
      
      const messages = {
        sanctuary: [
          `${name}, your sanctuary radiates with gentle light today`,
          `The universe whispers your name, ${name}`,
          `${name}, let's dance with the cosmic rhythms`,
          `Your energy illuminates this sacred space, ${name}`,
          `${name}, the ancestors smile upon your journey`
        ],
        sanctum: [
          `${name}, the Inner Sanctum recognizes your luminous presence`,
          `Divine wisdom flows through you today, ${name}`,
          `${name}, you are the embodiment of ethereal grace`,
          `The cosmos aligns in perfect harmony with your essence, ${name}`,
          `${name}, you carry the light of ancient knowing`
        ],
        none: [
          `Beautiful soul, your journey begins here`,
          `The sanctuary door opens for your arrival`,
          `Welcome to a space of infinite possibility`,
          `Your spiritual path illuminates before you`,
          `The universe has been waiting for your presence`
        ]
      };
      
      const tierMessages = messages[tier as keyof typeof messages] || messages.none;
      const randomMessage = tierMessages[Math.floor(Math.random() * tierMessages.length)];
      setPersonalMessage(randomMessage);
    };

    updateTimeAndGreeting();
    getPersonalMessage();
    
    // Update time every minute
    const interval = setInterval(updateTimeAndGreeting, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'sanctuary': return 'text-amber-600';
      case 'sanctum': return 'text-purple-600';
      default: return 'text-slate-600';
    }
  };

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'sanctuary': return 'bg-amber-100/80 text-amber-700 border-amber-200';
      case 'sanctum': return 'bg-purple-100/80 text-purple-700 border-purple-200';
      default: return 'bg-white/50 text-slate-600 border-slate-200';
    }
  };

  const formatTierName = (tier?: string) => {
    switch (tier) {
      case 'sanctuary': return 'The Sanctuary';
      case 'sanctum': return 'The Inner Sanctum';
      default: return 'Sacred Seeker';
    }
  };

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 shadow-xl ${className}`}>
      <div className="text-center space-y-4">
        {/* Time-based greeting */}
        <div className="space-y-2">
          <p className="font-dreamy text-lg xs:text-xl text-slate-600">
            {greeting}
          </p>
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800">
            {personalMessage}
          </h1>
        </div>

        {/* Current time and tier badge */}
        <div className="flex flex-col xs:flex-row items-center justify-center gap-4 xs:gap-6">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="text-sm font-medium">🕐</span>
            <span className="font-dreamy text-sm">{currentTime}</span>
          </div>
          
          {session && (
            <span className={`px-4 py-2 rounded-full text-sm font-serif border backdrop-blur-sm ${getTierBadge(session.user?.subscriptionTier)}`}>
              {formatTierName(session.user?.subscriptionTier)}
            </span>
          )}
        </div>

        {/* Personalized intention */}
        <div className="mt-6 p-4 bg-white/20 rounded-2xl border border-white/30">
          <p className="font-dreamy text-sm xs:text-base text-slate-700 italic">
            "Today, I honor the sacred rhythm within me and allow my soul to guide my practice."
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedWelcome;
