// FILE: src/components/diary/MoodTracker.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: string;
  note?: string;
}

const MOODS = [
  { name: 'peaceful', emoji: '🕊️', color: 'bg-blue-100 text-blue-800' },
  { name: 'grateful', emoji: '🙏', color: 'bg-green-100 text-green-800' },
  { name: 'joyful', emoji: '✨', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'contemplative', emoji: '🌙', color: 'bg-purple-100 text-purple-800' },
  { name: 'energized', emoji: '⚡', color: 'bg-orange-100 text-orange-800' },
  { name: 'centered', emoji: '🎯', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'loving', emoji: '💖', color: 'bg-pink-100 text-pink-800' },
  { name: 'overwhelmed', emoji: '🌊', color: 'bg-gray-100 text-gray-800' },
];

interface MoodTrackerProps {
  className?: string;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);

  // Load today's mood and recent entries
  useEffect(() => {
    if (session?.user?.email) {
      loadMoodEntries();
    }
  }, [session]);

  const loadMoodEntries = async () => {
    try {
      const response = await fetch('/api/user/mood-entries');
      if (response.ok) {
        const data = await response.json();
        setRecentMoods(data.recent || []);
        setTodaysMood(data.today || null);
      }
    } catch (error) {
      console.error('Failed to load mood entries:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (!selectedMood || !session?.user?.email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          note: note.trim() || undefined,
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setTodaysMood(newEntry);
        setRecentMoods(prev => [newEntry, ...prev.slice(0, 6)]);
        
        // Reset form
        setSelectedMood('');
        setIntensity(5);
        setNote('');
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (moodName: string) => {
    return MOODS.find(m => m.name === moodName)?.emoji || '💫';
  };

  const getMoodColor = (moodName: string) => {
    return MOODS.find(m => m.name === moodName)?.color || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/40 ${className}`}>
      <div className="mb-6">
        <h3 className="font-serif text-xl text-slate-800 mb-2">Daily Mood Check-in</h3>
        <p className="font-dreamy text-sm text-slate-600">{today}</p>
      </div>

      {/* Today's Mood Display */}
      {todaysMood ? (
        <div className="mb-6 p-4 bg-white/40 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-serif text-slate-800">Today's Mood</span>
            <span className="text-sm text-slate-600">{formatTime(todaysMood.timestamp)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMoodEmoji(todaysMood.mood)}</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(todaysMood.mood)}`}>
                {todaysMood.mood}
              </span>
              <div className="flex items-center space-x-1 mt-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < todaysMood.intensity ? 'bg-slate-400' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {todaysMood.note && (
            <p className="mt-3 text-sm text-slate-600 italic">"{todaysMood.note}"</p>
          )}
        </div>
      ) : (
        /* Mood Selection Form */
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-3">How are you feeling?</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`p-3 rounded-xl transition-all duration-200 text-center ${
                    selectedMood === mood.name
                      ? mood.color + ' ring-2 ring-offset-2 ring-slate-400'
                      : 'bg-white/40 hover:bg-white/60 text-slate-700'
                  }`}
                >
                  <div className="text-lg mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium capitalize">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedMood && (
            <>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Intensity (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Mild</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/40 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">Intense</span>
                  <span className="text-sm font-medium text-slate-800 w-6">{intensity}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Optional note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's contributing to this feeling?"
                  className="w-full px-3 py-2 bg-white/40 border border-white/60 rounded-lg text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                  rows={2}
                  maxLength={200}
                />
                <div className="text-xs text-slate-500 mt-1">{note.length}/200</div>
              </div>

              <button
                onClick={saveMoodEntry}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-serif tracking-wide transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Mood'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/30">
          <h4 className="font-serif text-slate-800 mb-3">Recent Moods</h4>
          <div className="space-y-2">
            {recentMoods.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span>{getMoodEmoji(entry.mood)}</span>
                  <span className="text-slate-700 capitalize">{entry.mood}</span>
                </div>
                <span className="text-slate-500">
                  {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
