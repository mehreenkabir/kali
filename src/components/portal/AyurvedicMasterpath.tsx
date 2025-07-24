'use client';

import { useState } from 'react';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  completed: boolean;
  progress: number;
  category: 'foundation' | 'practice' | 'advanced';
}

interface Recipe {
  id: string;
  name: string;
  dosha: 'vata' | 'pitta' | 'kapha' | 'tridoshic';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prepTime: string;
  ingredients: string[];
  benefits: string[];
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
}

const AyurvedicMasterpath: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('');
  const [currentRecipe] = useState<Recipe>({
    id: 'week-recipe',
    name: 'Golden Turmeric Khichdi',
    dosha: 'tridoshic',
    difficulty: 'beginner',
    prepTime: '30 min',
    ingredients: ['Basmati rice', 'Mung dal', 'Turmeric', 'Ginger', 'Ghee', 'Cumin seeds'],
    benefits: ['Digestive healing', 'Anti-inflammatory', 'Grounding energy'],
    season: 'all'
  });
  
  const modules: Module[] = [
    {
      id: '1',
      title: 'Foundation: Understanding Your Dosha',
      description: 'Discover your unique constitutional type and elemental balance through comprehensive assessment and guidance.',
      duration: '2 weeks',
      lessons: 8,
      completed: false,
      progress: 75,
      category: 'foundation'
    },
    {
      id: '2',
      title: 'Sacred Kitchen Alchemy',
      description: 'Transform your kitchen into a healing sanctuary with sacred tools, spices, and preparation rituals.',
      duration: '3 weeks',
      lessons: 12,
      completed: false,
      progress: 30,
      category: 'practice'
    },
    {
      id: '3',
      title: 'Seasonal Eating Wisdom',
      description: 'Align your diet with nature\'s rhythms and learn to eat for optimal energy throughout the year.',
      duration: '4 weeks',
      lessons: 16,
      completed: false,
      progress: 0,
      category: 'practice'
    },
    {
      id: '4',
      title: 'Advanced Healing Foods',
      description: 'Master the art of food as medicine with therapeutic recipes and healing protocols.',
      duration: '6 weeks',
      lessons: 20,
      completed: false,
      progress: 0,
      category: 'advanced'
    }
  ];

  const totalProgress = Math.round(modules.reduce((acc, module) => acc + module.progress, 0) / modules.length);

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Ayurvedic Culinary Masterpath
          </h2>
          <p className="font-dreamy text-slate-600">
            Ancient wisdom for modern vitality
          </p>
        </div>

        {/* Course Progress Overview */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 
                      border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-slate-800">Your Journey</h3>
            <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {totalProgress}% Complete
            </span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-3 mb-3">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 
                          rounded-full transition-all duration-1000" 
                 style={{ width: `${totalProgress}%` }} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-slate-800">{modules.filter(m => m.completed).length}</div>
              <div className="text-slate-600">Modules Complete</div>
            </div>
            <div>
              <div className="font-medium text-slate-800">{modules.reduce((acc, m) => acc + m.lessons, 0)}</div>
              <div className="text-slate-600">Total Lessons</div>
            </div>
            <div>
              <div className="font-medium text-slate-800">12</div>
              <div className="text-slate-600">Recipes Learned</div>
            </div>
            <div>
              <div className="font-medium text-slate-800">3</div>
              <div className="text-slate-600">Weeks Active</div>
            </div>
          </div>
        </div>

        {/* Current Recipe Feature */}
        <div className="bg-white/40 rounded-2xl p-6 border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-slate-800">
              This Week's Sacred Recipe
            </h3>
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
              {currentRecipe.dosha}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🥘</div>
              <h4 className="font-serif text-xl text-slate-800 mb-2">
                {currentRecipe.name}
              </h4>
              <p className="font-dreamy text-sm text-slate-600 mb-4">
                A healing one-pot meal to balance all doshas and nourish your body temple
              </p>
              <div className="flex justify-center gap-2 mb-4">
                {currentRecipe.benefits.map((benefit) => (
                  <span key={benefit} className="text-xs bg-green-100 text-green-700 
                                               px-2 py-1 rounded-full">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Key Ingredients</h5>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {currentRecipe.ingredients.slice(0, 6).map((ingredient) => (
                    <div key={ingredient} className="flex items-center space-x-2">
                      <span className="text-green-600">•</span>
                      <span className="text-slate-600">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3">
                <button className="w-full bg-green-600 text-white py-3 rounded-full 
                                 hover:bg-green-700 transition-colors font-medium">
                  View Recipe & Video Guide
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-slate-800 text-center mb-4">
            Masterpath Modules
          </h3>
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white/40 rounded-2xl p-6 border border-white/30 
                       hover:bg-white/50 transition-all cursor-pointer"
              onClick={() => setActiveModule(activeModule === module.id ? '' : module.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-serif text-lg text-slate-800">
                      {module.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      module.category === 'foundation' ? 'bg-blue-100 text-blue-700' :
                      module.category === 'practice' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {module.category}
                    </span>
                  </div>
                  <p className="font-dreamy text-sm text-slate-600 mb-3">
                    {module.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-slate-500">🕐 {module.duration}</span>
                    <span className="text-slate-500">📚 {module.lessons} lessons</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-serif text-slate-800 mb-1">
                    {module.progress}%
                  </div>
                  <div className="w-20 bg-white/50 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full transition-all" 
                         style={{ width: `${module.progress}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {Math.round(module.lessons * module.progress / 100)} / {module.lessons}
                  </div>
                </div>
              </div>
              
              {activeModule === module.id && (
                <div className="mt-4 pt-4 border-t border-white/30">
                  <div className="grid md:grid-cols-2 gap-4">
                    <button className="bg-green-600 text-white py-2 px-4 rounded-full 
                                     hover:bg-green-700 transition-colors text-sm">
                      Continue Learning
                    </button>
                    <button className="bg-white/60 text-slate-700 py-2 px-4 rounded-full 
                                     hover:bg-white/80 transition-colors text-sm">
                      View Module Overview
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dosha Assessment */}
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-6 
                      border border-orange-200">
          <h3 className="font-serif text-lg text-slate-800 mb-4 text-center">
            Your Ayurvedic Constitution
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🌪️</div>
              <h4 className="font-medium text-slate-800">Vata</h4>
              <div className="text-sm text-slate-600">35%</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-medium text-slate-800">Pitta</h4>
              <div className="text-sm text-slate-600">45%</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-medium text-slate-800">Kapha</h4>
              <div className="text-sm text-slate-600">20%</div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="font-dreamy text-sm text-slate-600 mb-3">
              You are primarily Pitta-Vata constitution
            </p>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm 
                             hover:bg-orange-700 transition-colors">
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AyurvedicMasterpath;
