'use client';

import { useState } from 'react';

interface AuraReading {
  id: string;
  date: string;
  type: 'full-spectrum' | 'chakra-focused' | 'life-purpose' | 'energy-cleansing';
  duration: '30 min' | '60 min' | '90 min';
  status: 'scheduled' | 'completed' | 'pending-booking';
  insights?: {
    dominantColors: string[];
    energyLevel: number;
    emotionalState: string;
    spiritualGuidance: string;
    recommendations: string[];
  };
  notes?: string;
}

const AuraReadings: React.FC = () => {
  const [selectedReading, setSelectedReading] = useState<AuraReading | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Sanctum members get 2 readings per year
  const availableReadings = 2;
  const usedReadings = 1;

  const readings: AuraReading[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'full-spectrum',
      duration: '60 min',
      status: 'completed',
      insights: {
        dominantColors: ['Deep Purple', 'Golden Yellow', 'Emerald Green'],
        energyLevel: 8,
        emotionalState: 'Balanced with creative expansion',
        spiritualGuidance: 'You are in a powerful phase of spiritual awakening. Your crown chakra is particularly active, indicating strong connection to higher consciousness.',
        recommendations: [
          'Continue daily meditation practice',
          'Work with amethyst for enhanced intuition',
          'Spend time in nature to ground your energy',
          'Express creativity through artistic pursuits'
        ]
      },
      notes: 'Beautiful session with strong intuitive downloads. Client showing signs of psychic awakening.'
    },
    {
      id: '2',
      date: '2024-07-20',
      type: 'chakra-focused',
      duration: '60 min',
      status: 'scheduled',
      notes: 'Upcoming session focusing on heart chakra healing and balance.'
    }
  ];

  const readingTypes = [
    {
      id: 'full-spectrum',
      name: 'Full Spectrum Aura Reading',
      description: 'Complete energetic analysis including all chakras, aura layers, and spiritual gifts',
      duration: '60 min',
      focus: 'Overall energy assessment'
    },
    {
      id: 'chakra-focused',
      name: 'Chakra-Focused Reading',
      description: 'Deep dive into specific chakra imbalances and healing guidance',
      duration: '60 min',
      focus: 'Chakra healing and alignment'
    },
    {
      id: 'life-purpose',
      name: 'Life Purpose Illumination',
      description: 'Discover your soul mission and spiritual gifts through aura analysis',
      duration: '90 min',
      focus: 'Soul purpose and gifts'
    },
    {
      id: 'energy-cleansing',
      name: 'Energy Cleansing Session',
      description: 'Identify and clear energetic blockages, attachments, and negative patterns',
      duration: '60 min',
      focus: 'Energy clearing and protection'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'pending-booking': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Aura Readings & Energy Analysis
          </h2>
          <p className="font-dreamy text-slate-600">
            Illuminate your energetic signature and spiritual gifts
          </p>
        </div>

        {/* Reading Allowance */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-slate-800">Your Annual Readings</h3>
            <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Inner Sanctum Benefit
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-serif text-slate-800 mb-1">{availableReadings}</div>
              <div className="font-dreamy text-sm text-slate-600">Readings Included</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-serif text-slate-800 mb-1">{usedReadings}</div>
              <div className="font-dreamy text-sm text-slate-600">Completed</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl font-serif text-slate-800 mb-1">{availableReadings - usedReadings}</div>
              <div className="font-dreamy text-sm text-slate-600">Remaining</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-white/50 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full transition-all duration-1000" 
                   style={{ width: `${(usedReadings / availableReadings) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Recent Reading Highlight */}
        {readings.find(r => r.status === 'completed') && (
          <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
            <h3 className="font-serif text-lg text-slate-800 mb-4">
              Your Latest Reading Insights
            </h3>
            {(() => {
              const lastReading = readings.find(r => r.status === 'completed');
              if (!lastReading?.insights) return null;
              
              return (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Dominant Aura Colors</h4>
                      <div className="flex flex-wrap gap-2">
                        {lastReading.insights.dominantColors.map((color) => (
                          <span key={color} className="bg-purple-100 text-purple-700 px-3 py-1 
                                                     rounded-full text-sm font-medium">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-700 mb-2">Energy Level</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-white/50 rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full transition-all" 
                               style={{ width: `${lastReading.insights.energyLevel * 10}%` }} />
                        </div>
                        <span className="font-medium text-slate-800">
                          {lastReading.insights.energyLevel}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Spiritual Guidance</h4>
                    <p className="font-dreamy text-slate-600 italic">
                      "{lastReading.insights.spiritualGuidance}"
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedReading(lastReading)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View Full Reading Details →
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {/* Reading History */}
        <div>
          <h3 className="font-serif text-xl text-slate-800 mb-4 text-center">
            Your Reading Journey
          </h3>
          <div className="space-y-3">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="bg-white/40 rounded-2xl p-4 border border-white/30 
                         hover:bg-white/50 transition-all cursor-pointer"
                onClick={() => setSelectedReading(reading)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-slate-800 capitalize">
                      {reading.type.replace('-', ' ')} Reading
                    </h4>
                    <p className="font-dreamy text-sm text-slate-600">
                      {new Date(reading.date).toLocaleDateString()} • {reading.duration}
                    </p>
                    {reading.notes && (
                      <p className="font-dreamy text-xs text-slate-500 mt-1">
                        {reading.notes}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reading.status)}`}>
                    {reading.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book New Reading */}
        {(availableReadings - usedReadings) > 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-full 
                       hover:bg-purple-700 transition-colors font-medium"
            >
              Book Your Next Reading ✨
            </button>
          </div>
        )}

        {/* Reading Types Info */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <h3 className="font-serif text-lg text-slate-800 mb-4 text-center">
            Available Reading Types
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {readingTypes.map((type) => (
              <div key={type.id} className="bg-white/50 rounded-xl p-4">
                <h4 className="font-medium text-slate-800 mb-2">{type.name}</h4>
                <p className="font-dreamy text-sm text-slate-600 mb-2">
                  {type.description}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Duration: {type.duration}</span>
                  <span>Focus: {type.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for detailed reading */}
        {selectedReading && selectedReading.insights && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setSelectedReading(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-2xl text-slate-800">
                  Full Reading Details
                </h3>
                <button
                  onClick={() => setSelectedReading(null)}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedReading.insights.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="font-dreamy text-sm text-slate-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Reader Notes</h4>
                  <p className="font-dreamy text-sm text-slate-600">
                    {selectedReading.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuraReadings;
