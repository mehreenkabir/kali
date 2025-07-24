'use client';

import { useState } from 'react';

interface Reading {
  id: string;
  title: string;
  category: 'wisdom' | 'channeled' | 'essay' | 'teaching';
  excerpt: string;
  readTime: string;
  date: string;
  tags: string[];
  isNew: boolean;
}

const AkashicRecords: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Records', icon: '📚' },
    { id: 'wisdom', label: 'Ancient Wisdom', icon: '🏛️' },
    { id: 'channeled', label: 'Channeled Messages', icon: '💫' },
    { id: 'essay', label: 'Sacred Essays', icon: '✍️' },
    { id: 'teaching', label: 'Teachings', icon: '🎓' }
  ];

  // Mock readings data
  const readings: Reading[] = [
    {
      id: '1',
      title: 'The Sacred Feminine Rising',
      category: 'channeled',
      excerpt: 'A powerful message about the return of divine feminine energy in our collective awakening. The goddess consciousness stirs within us all, calling for recognition and reverence...',
      readTime: '7 min',
      date: '2024-01-15',
      tags: ['feminine', 'awakening', 'goddess'],
      isNew: true
    },
    {
      id: '2',
      title: 'Ancient Breath Wisdom',
      category: 'wisdom',
      excerpt: 'The breath is our first teacher and our final guide. In ancient traditions, the breath was understood as the bridge between the physical and spiritual realms...',
      readTime: '12 min',
      date: '2024-01-10',
      tags: ['breathwork', 'ancient', 'practice'],
      isNew: false
    },
    {
      id: '3',
      title: 'Moon Cycles and Soul Rhythms',
      category: 'teaching',
      excerpt: 'Understanding how lunar phases influence our inner tides and emotional landscapes. Each moon cycle offers an opportunity for renewal and deeper alignment...',
      readTime: '9 min',
      date: '2024-01-05',
      tags: ['moon', 'cycles', 'alignment'],
      isNew: false
    }
  ];

  const filteredReadings = readings.filter(reading => {
    const matchesCategory = selectedCategory === 'all' || reading.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      reading.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reading.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Akashic Records Library
          </h2>
          <p className="font-dreamy text-slate-600">
            Timeless wisdom and channeled messages for your soul
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search the records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-white/40 border border-white/60 
                       rounded-2xl placeholder-slate-500 focus:outline-none 
                       focus:ring-2 focus:ring-purple-300"
            />
            <span className="absolute left-3 top-3.5 text-slate-500">🔍</span>
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

        {/* Readings List */}
        <div className="space-y-4">
          {filteredReadings.map((reading) => (
            <article
              key={reading.id}
              className="bg-white/40 rounded-2xl p-6 border border-white/30 
                       hover:bg-white/50 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-xl text-slate-800">
                  {reading.title}
                </h3>
                {reading.isNew && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 
                                 rounded-full text-xs font-medium">
                    New
                  </span>
                )}
              </div>
              
              <p className="font-dreamy text-slate-600 mb-4 line-clamp-2">
                {reading.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>{reading.readTime}</span>
                  <span>{new Date(reading.date).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  {reading.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-purple-100 text-purple-700 
                               px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredReadings.length === 0 && (
          <div className="text-center py-8">
            <p className="font-dreamy text-slate-600">
              No records found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AkashicRecords;
