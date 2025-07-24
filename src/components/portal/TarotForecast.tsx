'use client';

import { useState } from 'react';

interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  meaning: string;
  reversedMeaning?: string;
  image: string;
  position: 'past' | 'present' | 'future';
}

interface TarotReading {
  id: string;
  date: string;
  spread: 'three-card' | 'celtic-cross' | 'single';
  cards: TarotCard[];
  interpretation: string;
  guidanceMessage: string;
  moonPhase: string;
}

const TarotForecast: React.FC = () => {
  const [currentReading, setCurrentReading] = useState<TarotReading>({
    id: '1',
    date: new Date().toISOString(),
    spread: 'three-card',
    moonPhase: 'Waxing Crescent',
    cards: [
      {
        name: 'The High Priestess',
        arcana: 'major',
        meaning: 'Intuition, sacred knowledge, divine feminine',
        image: '🔮',
        position: 'past'
      },
      {
        name: 'Three of Cups',
        arcana: 'minor',
        meaning: 'Celebration, friendship, creative collaborations',
        image: '🍷',
        position: 'present'
      },
      {
        name: 'The Star',
        arcana: 'major',
        meaning: 'Hope, faith, renewal, spiritual guidance',
        image: '⭐',
        position: 'future'
      }
    ],
    interpretation: 'Your intuitive gifts from the past have led you to this moment of celebration and connection. The High Priestess reminds you that your inner knowing has been your greatest teacher. Currently, the Three of Cups suggests you are in a time of joyful connections and creative collaboration. Looking ahead, The Star promises hope, renewal, and divine guidance illuminating your path forward.',
    guidanceMessage: 'Trust the cosmic flow that guides your path. The universe conspires in your favor, weaving together past wisdom, present joy, and future hope into a beautiful tapestry of your soul\'s journey.'
  });

  const [showFullReading, setShowFullReading] = useState(false);
  const [pastReadings] = useState<TarotReading[]>([
    {
      id: '2',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      spread: 'single',
      moonPhase: 'Full Moon',
      cards: [
        {
          name: 'The Empress',
          arcana: 'major',
          meaning: 'Creativity, abundance, nurturing energy',
          image: '👸',
          position: 'present'
        }
      ],
      interpretation: 'The Empress called forth your creative power...',
      guidanceMessage: 'Embrace your creative sovereignty.'
    }
  ]);

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Your Tarot Forecast
          </h2>
          <p className="font-dreamy text-slate-600">
            Divine guidance illuminates your path
          </p>
          <div className="mt-3">
            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 
                           rounded-full text-sm font-medium">
              🌙 {currentReading.moonPhase}
            </span>
          </div>
        </div>

        {/* Three Card Spread */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {currentReading.cards.map((card, index) => (
            <div key={index} className="text-center">
              <p className="font-dreamy text-sm text-slate-600 mb-2 capitalize">
                {card.position}
              </p>
              <div className="bg-gradient-to-br from-purple-200 to-pink-200 
                            rounded-2xl p-6 border border-purple-300 
                            hover:scale-105 transition-transform cursor-pointer"
                   title={`${card.name}: ${card.meaning}`}>
                <div className="text-4xl mb-3">{card.image}</div>
                <h4 className="font-serif text-sm text-slate-800">
                  {card.name}
                </h4>
              </div>
            </div>
          ))}
        </div>

        {/* Reading Interpretation */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <h3 className="font-serif text-xl text-slate-800 mb-4 text-center">
            Your Personal Message
          </h3>
          
          <div className={`space-y-4 ${!showFullReading ? 'max-h-32 overflow-hidden relative' : ''}`}>
            <p className="font-dreamy text-slate-700 leading-relaxed">
              {currentReading.interpretation}
            </p>
            
            {!showFullReading && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/40 to-transparent" />
            )}
            
            {showFullReading && (
              <>
                <div className="border-t border-slate-200 pt-4">
                  <h4 className="font-serif text-lg text-slate-800 mb-2">Card Meanings</h4>
                  {currentReading.cards.map((card, index) => (
                    <div key={index} className="mb-3">
                      <h5 className="font-medium text-slate-700 capitalize">
                        {card.name} ({card.position})
                      </h5>
                      <p className="font-dreamy text-sm text-slate-600">
                        {card.meaning}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="font-dreamy text-amber-800 text-center italic">
                    ✨ {currentReading.guidanceMessage}
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setShowFullReading(!showFullReading)}
            className="w-full mt-4 text-purple-600 hover:text-purple-700 
                     font-medium text-sm transition-colors"
          >
            {showFullReading ? 'Show Less' : 'Read Full Interpretation'}
          </button>
        </div>

        {/* Past Readings */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-slate-800 text-center">
            Recent Readings
          </h3>
          {pastReadings.map((reading) => (
            <div key={reading.id} className="bg-white/40 rounded-2xl p-4 border border-white/30 
                                           hover:bg-white/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-slate-800">
                    {reading.cards[0].name}
                  </h4>
                  <p className="font-dreamy text-sm text-slate-600">
                    {new Date(reading.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-2xl">{reading.cards[0].image}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button className="bg-white/40 hover:bg-white/60 text-slate-700 
                           px-6 py-3 rounded-full font-dreamy transition-all">
            Request Personal Reading 🔮
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarotForecast;
