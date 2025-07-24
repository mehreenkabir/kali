'use client';

import { useState } from 'react';

interface ElixirPractice {
  id: string;
  title: string;
  category: 'nutrition' | 'movement' | 'breath' | 'energy' | 'ritual';
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  instructions: string[];
}

const YouthElixir: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePractice, setActivePractice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Practices', icon: '✨' },
    { id: 'nutrition', label: 'Sacred Nutrition', icon: '🥗' },
    { id: 'movement', label: 'Vitality Movement', icon: '🌊' },
    { id: 'breath', label: 'Breath Alchemy', icon: '🌬️' },
    { id: 'energy', label: 'Energy Work', icon: '⚡' },
    { id: 'ritual', label: 'Beauty Rituals', icon: '🌸' }
  ];

  const practices: ElixirPractice[] = [
    {
      id: '1',
      title: 'Golden Morning Elixir',
      category: 'nutrition',
      description: 'A potent blend of adaptogenic herbs and superfoods to activate cellular renewal',
      duration: '5 min prep',
      difficulty: 'beginner',
      benefits: ['Cellular regeneration', 'Radiant skin', 'Mental clarity', 'Energy boost'],
      instructions: [
        'Warm 1 cup of pure water to just below boiling',
        'Add 1 tsp turmeric, 1/2 tsp ginger powder',
        'Stir in 1 tbsp coconut oil and raw honey',
        'Add a pinch of black pepper for absorption',
        'Drink mindfully while setting intentions'
      ]
    },
    {
      id: '2',
      title: 'Fountain of Youth Breathwork',
      category: 'breath',
      description: 'Ancient pranayama technique to oxygenate cells and activate longevity genes',
      duration: '15 min',
      difficulty: 'intermediate',
      benefits: ['Increased oxygenation', 'Stress reduction', 'Hormonal balance', 'Mental clarity'],
      instructions: [
        'Sit comfortably with spine straight',
        'Inhale for 4 counts through the nose',
        'Hold breath for 7 counts',
        'Exhale for 8 counts through pursed lips',
        'Repeat cycle 4-8 times'
      ]
    },
    {
      id: '3',
      title: 'Cellular Renewal Visualization',
      category: 'energy',
      description: 'Guided meditation to activate your body\'s natural healing and renewal processes',
      duration: '20 min',
      difficulty: 'beginner',
      benefits: ['Stress relief', 'Cellular healing', 'Emotional balance', 'Inner peace'],
      instructions: [
        'Find a quiet, comfortable space',
        'Close eyes and focus on breath',
        'Visualize golden light entering each cell',
        'See old, tired cells being renewed',
        'Feel vitality flowing through your body'
      ]
    },
    {
      id: '4',
      title: 'Sacred Face Gua Sha Ritual',
      category: 'ritual',
      description: 'Traditional Chinese practice to promote lymphatic drainage and facial vitality',
      duration: '10 min',
      difficulty: 'beginner',
      benefits: ['Improved circulation', 'Reduced puffiness', 'Glowing skin', 'Tension release'],
      instructions: [
        'Apply facial oil to clean skin',
        'Start from center of face, work outward',
        'Use gentle upward strokes',
        'Focus on lymphatic drainage points',
        'End with gratitude for your body'
      ]
    }
  ];

  const filteredPractices = practices.filter(practice => 
    selectedCategory === 'all' || practice.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Youth Elixir Secrets
          </h2>
          <p className="font-dreamy text-slate-600">
            Sacred practices for ageless vitality and luminous inner glow
          </p>
        </div>

        {/* Daily Practice Summary */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6 border border-pink-200">
          <h3 className="font-serif text-lg text-slate-800 mb-4 text-center">
            Today's Vitality Protocol
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🌅</div>
              <h4 className="font-medium text-slate-800">Morning</h4>
              <p className="font-dreamy text-sm text-slate-600">Golden Elixir + Breathwork</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">☀️</div>
              <h4 className="font-medium text-slate-800">Midday</h4>
              <p className="font-dreamy text-sm text-slate-600">Movement + Hydration</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌙</div>
              <h4 className="font-medium text-slate-800">Evening</h4>
              <p className="font-dreamy text-sm text-slate-600">Face Ritual + Meditation</p>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full 
                       text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white/60 text-slate-800 shadow-md'
                  : 'bg-white/20 text-slate-600 hover:bg-white/40'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-dreamy">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Practices Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPractices.map((practice) => (
            <div
              key={practice.id}
              className="bg-white/40 rounded-2xl p-6 border border-white/30 
                       hover:bg-white/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-serif text-lg text-slate-800">
                  {practice.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(practice.difficulty)}`}>
                  {practice.difficulty}
                </span>
              </div>
              
              <p className="font-dreamy text-sm text-slate-600 mb-4">
                {practice.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">⏱️ {practice.duration}</span>
                <div className="flex gap-1">
                  {practice.benefits.slice(0, 2).map((benefit) => (
                    <span key={benefit} className="text-xs bg-purple-100 text-purple-700 
                                                 px-2 py-1 rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActivePractice(activePractice === practice.id ? null : practice.id)}
                className="w-full bg-pink-600 text-white py-2 rounded-full 
                         hover:bg-pink-700 transition-colors text-sm font-medium"
              >
                {activePractice === practice.id ? 'Hide Instructions' : 'View Practice'}
              </button>

              {activePractice === practice.id && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl border border-white/60">
                  <h4 className="font-medium text-slate-800 mb-3">Practice Instructions</h4>
                  <ol className="space-y-2">
                    {practice.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-pink-200 text-pink-800 w-5 h-5 rounded-full 
                                       flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="font-dreamy text-sm text-slate-600">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                  
                  <div className="mt-4 pt-3 border-t border-white/40">
                    <h5 className="font-medium text-slate-800 mb-2">Benefits</h5>
                    <div className="flex flex-wrap gap-2">
                      {practice.benefits.map((benefit) => (
                        <span key={benefit} className="text-xs bg-green-100 text-green-700 
                                                     px-2 py-1 rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Tracking */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <h3 className="font-serif text-lg text-slate-800 mb-4 text-center">
            Your Vitality Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-serif text-slate-800">7</div>
              <div className="font-dreamy text-sm text-slate-600">Days Active</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-slate-800">12</div>
              <div className="font-dreamy text-sm text-slate-600">Practices Completed</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-slate-800">85%</div>
              <div className="font-dreamy text-sm text-slate-600">Consistency Rate</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-slate-800">⚡</div>
              <div className="font-dreamy text-sm text-slate-600">Energy Level</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouthElixir;
