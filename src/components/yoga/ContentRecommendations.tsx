// FILE: src/components/yoga/ContentRecommendations.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Content {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'meditation' | 'practice' | 'reading' | 'ritual';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: string;
  recommended: boolean;
}

interface ContentRecommendationsProps {
  className?: string;
}

const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [selectedFilter, setSelectedFilter] = useState<string>('recommended');
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    // Simulate personalized content based on subscription tier and user behavior
    const generatePersonalizedContent = () => {
      const tier = session?.user?.subscriptionTier || 'none';
      
      const allContent: Content[] = [
        {
          id: '1',
          title: 'Morning Light Activation',
          description: 'Awaken your inner radiance with this gentle sunrise meditation',
          duration: '12 min',
          type: 'meditation',
          difficulty: 'beginner',
          tags: ['morning', 'energy', 'activation'],
          thumbnail: '🌅',
          recommended: true
        },
        {
          id: '2',
          title: 'Chakra Alignment Flow',
          description: 'Balance your seven energy centers through mindful movement',
          duration: '25 min',
          type: 'practice',
          difficulty: 'intermediate',
          tags: ['chakras', 'flow', 'alignment'],
          thumbnail: '🌈',
          recommended: true
        },
        {
          id: '3',
          title: 'Sacred Feminine Wisdom',
          description: 'Ancient teachings on honoring your divine feminine essence',
          duration: '8 min read',
          type: 'reading',
          difficulty: 'beginner',
          tags: ['wisdom', 'feminine', 'sacred'],
          thumbnail: '🌸',
          recommended: tier === 'sanctuary' || tier === 'sanctum'
        },
        {
          id: '4',
          title: 'Moon Water Ritual',
          description: 'Create blessed water under the full moon for healing',
          duration: '15 min',
          type: 'ritual',
          difficulty: 'beginner',
          tags: ['moon', 'ritual', 'healing'],
          thumbnail: '🌙',
          recommended: tier === 'sanctuary' || tier === 'sanctum'
        },
        {
          id: '5',
          title: 'Breathwork for Anxiety',
          description: 'Calm your nervous system with sacred breathing techniques',
          duration: '10 min',
          type: 'meditation',
          difficulty: 'beginner',
          tags: ['breathwork', 'calm', 'nervous-system'],
          thumbnail: '🫁',
          recommended: true
        },
        {
          id: '6',
          title: 'Crystal Grid Manifestation',
          description: 'Amplify your intentions with sacred geometry and crystals',
          duration: '20 min',
          type: 'ritual',
          difficulty: 'intermediate',
          tags: ['crystals', 'manifestation', 'grid'],
          thumbnail: '💎',
          recommended: tier === 'sanctum'
        },
        {
          id: '7',
          title: 'Yin Yoga for Release',
          description: 'Deep surrender and emotional release through passive poses',
          duration: '35 min',
          type: 'practice',
          difficulty: 'beginner',
          tags: ['yin', 'release', 'surrender'],
          thumbnail: '🍃',
          recommended: true
        },
        {
          id: '8',
          title: 'Ayurvedic Evening Routine',
          description: 'Sacred practices for peaceful sleep and restoration',
          duration: '18 min',
          type: 'reading',
          difficulty: 'intermediate',
          tags: ['ayurveda', 'evening', 'sleep'],
          thumbnail: '🌿',
          recommended: tier === 'sanctum'
        }
      ];

      return allContent;
    };

    setContents(generatePersonalizedContent());
  }, [session]);

  const filterContent = (filter: string) => {
    switch (filter) {
      case 'recommended':
        return contents.filter(content => content.recommended);
      case 'meditation':
        return contents.filter(content => content.type === 'meditation');
      case 'practice':
        return contents.filter(content => content.type === 'practice');
      case 'reading':
        return contents.filter(content => content.type === 'reading');
      case 'ritual':
        return contents.filter(content => content.type === 'ritual');
      default:
        return contents;
    }
  };

  const filteredContent = filterContent(selectedFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'bg-blue-100 text-blue-700';
      case 'practice': return 'bg-emerald-100 text-emerald-700';
      case 'reading': return 'bg-purple-100 text-purple-700';
      case 'ritual': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '🌱';
    }
  };

  const filters = [
    { key: 'recommended', label: 'For You', icon: '✨' },
    { key: 'meditation', label: 'Meditation', icon: '🧘‍♀️' },
    { key: 'practice', label: 'Practice', icon: '🤸‍♀️' },
    { key: 'reading', label: 'Wisdom', icon: '📜' },
    { key: 'ritual', label: 'Rituals', icon: '🕯️' }
  ];

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Sacred Content for You
          </h2>
          <p className="font-dreamy text-slate-600">
            Curated experiences aligned with your journey
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 xs:gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                selectedFilter === filter.key
                  ? 'bg-white/60 text-slate-800 shadow-lg'
                  : 'bg-white/20 text-slate-600 hover:bg-white/40'
              }`}
            >
              <span>{filter.icon}</span>
              <span className="font-dreamy text-sm">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
          {filteredContent.map((content) => (
            <div
              key={content.id}
              className="bg-white/40 rounded-2xl p-4 xs:p-6 border border-white/30 transition-all duration-300 hover:bg-white/50 hover:scale-105 cursor-pointer group"
            >
              <div className="space-y-4">
                {/* Thumbnail & Type */}
                <div className="flex items-center justify-between">
                  <div className="text-3xl xs:text-4xl">{content.thumbnail}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(content.type)}`}>
                      {content.type}
                    </span>
                    <span className="text-lg" title={content.difficulty}>
                      {getDifficultyIcon(content.difficulty)}
                    </span>
                  </div>
                </div>

                {/* Content Info */}
                <div>
                  <h3 className="font-serif text-lg xs:text-xl text-slate-800 mb-2 group-hover:text-slate-900">
                    {content.title}
                  </h3>
                  <p className="font-dreamy text-sm xs:text-base text-slate-600 mb-3 line-clamp-2">
                    {content.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 text-sm">
                      {content.duration}
                    </span>
                    {content.recommended && (
                      <span className="flex items-center space-x-1 text-amber-600 text-sm">
                        <span>⭐</span>
                        <span className="font-dreamy">Recommended</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {content.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/30 rounded-full text-xs text-slate-600 font-dreamy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full bg-slate-800 text-white py-3 rounded-full font-medium transition-all duration-300 hover:bg-slate-900 group-hover:scale-105">
                  {content.type === 'reading' ? 'Read Now' : 
                   content.type === 'ritual' ? 'Begin Ritual' :
                   content.type === 'practice' ? 'Start Practice' : 'Begin Session'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌸</div>
            <h3 className="font-serif text-xl text-slate-800 mb-2">
              No content found
            </h3>
            <p className="font-dreamy text-slate-600">
              Try selecting a different filter or upgrade your subscription for more content.
            </p>
          </div>
        )}

        {/* Upgrade Prompt for Limited Access */}
        {(!session || session.user?.subscriptionTier === 'none') && (
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl p-6 xs:p-8 text-center border border-purple-300">
            <div className="text-3xl mb-4">🔮</div>
            <h3 className="font-serif text-xl xs:text-2xl text-slate-800 mb-4">
              Unlock Your Full Library
            </h3>
            <p className="font-dreamy text-slate-600 mb-6">
              Access hundreds of meditations, practices, and sacred wisdom with a sanctuary subscription.
            </p>
            <button className="bg-slate-800 text-white px-8 py-3 rounded-full font-serif tracking-wide hover:bg-slate-900 transition-colors">
              Explore Subscriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentRecommendations;
