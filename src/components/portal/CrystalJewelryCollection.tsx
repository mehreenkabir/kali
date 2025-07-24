'use client';

import { useState } from 'react';

interface JewelryPiece {
  id: string;
  name: string;
  type: 'necklace' | 'bracelet' | 'ring' | 'earrings';
  crystal: string;
  metal: string;
  intention: string;
  status: 'designing' | 'crafting' | 'shipped' | 'delivered';
  estimatedDate: string;
  image: string;
  year: number;
}

const CrystalJewelryCollection: React.FC = () => {
  const [selectedPiece, setSelectedPiece] = useState<JewelryPiece | null>(null);
  
  // Annual jewelry piece for Inner Sanctum members
  const currentYearPiece: JewelryPiece = {
    id: '2024',
    name: 'Celestial Moon Pendant',
    type: 'necklace',
    crystal: 'Rainbow Moonstone',
    metal: 'Sterling Silver',
    intention: 'Divine feminine awakening and intuitive clarity',
    status: 'crafting',
    estimatedDate: 'March 2024',
    image: '🌙',
    year: 2024
  };

  const jewelryHistory: JewelryPiece[] = [
    {
      id: '2023',
      name: 'Sacred Heart Ring',
      type: 'ring',
      crystal: 'Rose Quartz',
      metal: 'Rose Gold',
      intention: 'Unconditional love and heart healing',
      status: 'delivered',
      estimatedDate: 'Delivered January 2024',
      image: '💍',
      year: 2023
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'designing': return 'bg-blue-100 text-blue-800';
      case 'crafting': return 'bg-amber-100 text-amber-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'designing': return '✏️';
      case 'crafting': return '🔨';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Your Crystal Jewelry Collection
          </h2>
          <p className="font-dreamy text-slate-600">
            Handcrafted heirlooms infused with sacred intentions
          </p>
        </div>

        {/* Current Year's Piece */}
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 
                      border border-purple-200">
          <div className="text-center mb-6">
            <span className="inline-block bg-purple-200 text-purple-800 px-4 py-2 
                           rounded-full text-sm font-medium mb-4">
              ✨ {currentYearPiece.year} Heirloom Piece
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <div className="text-8xl mb-4">{currentYearPiece.image}</div>
              <h3 className="font-serif text-2xl text-slate-800 mb-2">
                {currentYearPiece.name}
              </h3>
              <p className="font-dreamy text-purple-600 italic mb-4">
                "{currentYearPiece.intention}"
              </p>
              <div className="flex justify-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentYearPiece.status)}`}>
                  <span className="mr-2">{getStatusIcon(currentYearPiece.status)}</span>
                  {currentYearPiece.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-serif text-lg text-slate-800 mb-3">Sacred Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-dreamy text-slate-600">Crystal:</span>
                    <span className="font-medium text-slate-800">{currentYearPiece.crystal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-dreamy text-slate-600">Metal:</span>
                    <span className="font-medium text-slate-800">{currentYearPiece.metal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-dreamy text-slate-600">Type:</span>
                    <span className="font-medium text-slate-800 capitalize">
                      {currentYearPiece.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-dreamy text-slate-600">Crafted:</span>
                    <span className="font-medium text-slate-800">{currentYearPiece.year}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-amber-800">Estimated Arrival:</span>
                </div>
                <p className="text-sm text-amber-700">
                  {currentYearPiece.estimatedDate}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-amber-600 mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full transition-all duration-1000" 
                         style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              <div className="bg-white/40 rounded-xl p-4">
                <h5 className="font-medium text-slate-800 mb-2">Energetic Blessing</h5>
                <p className="font-dreamy text-sm text-slate-600">
                  Each piece is blessed under the full moon with sacred intentions for your highest good.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Jewelry Preferences */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <h3 className="font-serif text-lg text-slate-800 mb-4">
            Your Jewelry Profile
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700">Sizing Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Ring Size:</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Necklace Length:</span>
                  <span className="font-medium">18"</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bracelet Size:</span>
                  <span className="font-medium">7.5"</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700">Style Preferences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Metal Preference:</span>
                  <span className="font-medium">Silver & Rose Gold</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Style:</span>
                  <span className="font-medium">Minimalist</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Crystal Focus:</span>
                  <span className="font-medium">Healing & Protection</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-purple-600 text-white py-3 rounded-full 
                           hover:bg-purple-700 transition-colors font-medium">
            Update Jewelry Preferences
          </button>
        </div>

        {/* Collection History */}
        {jewelryHistory.length > 0 && (
          <div>
            <h3 className="font-serif text-xl text-slate-800 mb-4 text-center">
              Your Sacred Collection
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {jewelryHistory.map((piece) => (
                <div
                  key={piece.id}
                  className="bg-white/40 rounded-2xl p-6 border border-white/30 
                           hover:bg-white/50 transition-all cursor-pointer"
                  onClick={() => setSelectedPiece(piece)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{piece.image}</div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-slate-800">
                        {piece.name}
                      </h4>
                      <p className="font-dreamy text-sm text-slate-600">
                        {piece.crystal} • {piece.metal}
                      </p>
                      <span className="text-xs text-slate-500">
                        {piece.year} Collection
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(piece.status)}`}>
                      ✓ {piece.status}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-dreamy text-slate-600 italic mb-2">
                      "{piece.intention}"
                    </p>
                    <p className="text-slate-500">
                      {piece.estimatedDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Care Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-serif text-lg text-slate-800 mb-4 text-center">
            Sacred Care Rituals
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Monthly Cleansing</h4>
              <p className="font-dreamy text-sm text-slate-600">
                Cleanse your jewelry under running water or moonlight to clear accumulated energies.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-2">Intention Setting</h4>
              <p className="font-dreamy text-sm text-slate-600">
                Hold your piece and set a sacred intention before wearing to activate its healing properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrystalJewelryCollection;
