'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  note: string | null;
  timestamp: string;
}

const MOOD_OPTIONS = [
  { value: 'joyful', label: 'Joyful', emoji: '😊', color: 'from-yellow-400 to-orange-400' },
  { value: 'peaceful', label: 'Peaceful', emoji: '😌', color: 'from-blue-400 to-indigo-400' },
  { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'from-pink-400 to-purple-400' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'from-gray-400 to-slate-400' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'from-indigo-400 to-blue-400' },
  { value: 'energized', label: 'Energized', emoji: '⚡', color: 'from-green-400 to-emerald-400' },
  { value: 'loved', label: 'Loved', emoji: '💖', color: 'from-red-400 to-pink-400' },
  { value: 'inspired', label: 'Inspired', emoji: '✨', color: 'from-purple-400 to-violet-400' }
];

export default function MoodTrackingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(null);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchMoodData();
  }, [session, status, router]);

  const fetchMoodData = async () => {
    try {
      const response = await fetch('/api/user/mood-entries');
      if (response.ok) {
        const data = await response.json();
        setTodayMood(data.today);
        setRecentMoods(data.recent || []);
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          intensity,
          note: note.trim() || null
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setSelectedMood('');
        setIntensity(5);
        setNote('');
        await fetchMoodData();
        
        // Track in portal API
        await fetch('/api/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveMood',
            data: { mood: selectedMood, intensity, note }
          })
        });

        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="font-dreamy text-xl text-white">Loading mood tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 z-0 pastel-dream-gradient"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header theme="light" />

        <main className="flex-grow pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-20">
          <div className="max-w-4xl mx-auto px-4 xs:px-6 sm:px-8">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl text-slate-800 mb-4">
                Daily Mood Tracking
              </h1>
              <p className="font-dreamy text-lg xs:text-xl text-slate-600 mb-6">
                Track your emotional landscape and spiritual weather patterns
              </p>
              
              {/* Navigation */}
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 mb-6">
                <Link href="/portal" className="hover:text-slate-800 transition-colors font-dreamy">
                  Portal
                </Link>
                <span>→</span>
                <span className="font-medium text-slate-800">Mood Tracking</span>
              </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-2xl text-green-800 text-center animate-fadeIn">
                <span className="text-2xl mr-2">✨</span>
                Mood recorded! Your emotional landscape is being mapped.
              </div>
            )}

            {/* Today's Mood Check */}
            {!todayMood ? (
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40 mb-8">
                <h2 className="font-serif text-2xl text-slate-800 mb-6 text-center">
                  How are you feeling today?
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mood Selection */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {MOOD_OPTIONS.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          selectedMood === mood.value
                            ? 'border-purple-400 bg-purple-50 scale-105'
                            : 'border-white/40 bg-white/20 hover:border-white/60'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className="font-dreamy text-sm text-slate-700">{mood.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Intensity Slider */}
                  {selectedMood && (
                    <div className="space-y-2">
                      <label className="font-serif text-slate-700">
                        Intensity: {intensity}/10
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={intensity}
                        onChange={(e) => setIntensity(Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Mild</span>
                        <span>Moderate</span>
                        <span>Intense</span>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {selectedMood && (
                    <div>
                      <label className="font-serif text-slate-700 block mb-2">
                        Add a note (optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-xl 
                                 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 
                                 focus:ring-purple-400 focus:border-transparent"
                        placeholder="What's influencing your mood today?"
                      />
                    </div>
                  )}

                  {/* Submit */}
                  {selectedMood && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-serif 
                               py-3 rounded-full transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Recording...' : 'Record Mood'}
                    </button>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border border-purple-200 mb-8 text-center">
                <h2 className="font-serif text-2xl text-purple-800 mb-4">
                  Today's Mood Recorded
                </h2>
                <div className="text-5xl mb-4">
                  {MOOD_OPTIONS.find(m => m.value === todayMood.mood)?.emoji}
                </div>
                <p className="font-dreamy text-lg text-purple-700 mb-2">
                  Feeling {MOOD_OPTIONS.find(m => m.value === todayMood.mood)?.label}
                </p>
                <p className="text-purple-600">
                  Intensity: {todayMood.intensity}/10
                </p>
                {todayMood.note && (
                  <p className="mt-4 font-dreamy text-purple-700 italic">
                    "{todayMood.note}"
                  </p>
                )}
              </div>
            )}

            {/* Recent Moods */}
            {recentMoods.length > 0 && (
              <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
                <h3 className="font-serif text-xl text-slate-800 mb-6">Recent Emotional Weather</h3>
                <div className="space-y-4">
                  {recentMoods.map((entry) => {
                    const mood = MOOD_OPTIONS.find(m => m.value === entry.mood);
                    return (
                      <div key={entry.id} className="flex items-center space-x-4 p-4 bg-white/40 rounded-2xl">
                        <div className="text-2xl">{mood?.emoji}</div>
                        <div className="flex-grow">
                          <div className="font-dreamy text-slate-700">{mood?.label}</div>
                          <div className="text-sm text-slate-600">
                            {new Date(entry.timestamp).toLocaleDateString()} • Intensity: {entry.intensity}/10
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mood Insights */}
            <div className="mt-8 text-center">
              <Link
                href="/portal"
                className="inline-block bg-white/40 hover:bg-white/60 text-slate-800 px-6 py-3 
                         rounded-xl font-serif tracking-wide transition-colors border border-white/60"
              >
                ← Back to Portal
              </Link>
            </div>
          </div>
        </main>

        <GlobalFooter theme="light" />
      </div>
    </div>
  );
}