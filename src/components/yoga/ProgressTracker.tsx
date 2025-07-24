// FILE: src/components/yoga/ProgressTracker.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProgressStats {
  totalSessions: number;
  weeklyGoal: number;
  currentStreak: number;
  longestStreak: number;
  favoriteTime: string;
  totalMinutes: number;
  weeklyProgress: number[];
}

interface ProgressTrackerProps {
  className?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ className = '' }) => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<ProgressStats>({
    totalSessions: 23,
    weeklyGoal: 5,
    currentStreak: 4,
    longestStreak: 12,
    favoriteTime: 'Morning',
    totalMinutes: 420,
    weeklyProgress: [1, 2, 0, 1, 1, 0, 2] // Last 7 days
  });

  const [showInsight, setShowInsight] = useState(false);

  // Get personalized insights
  const getPersonalizedInsight = () => {
    const { currentStreak, weeklyGoal, weeklyProgress, favoriteTime } = stats;
    const weekTotal = weeklyProgress.reduce((sum, day) => sum + day, 0);
    
    if (currentStreak >= 7) {
      return {
        type: 'celebration',
        icon: '🌟',
        title: 'Radiant Consistency!',
        message: `Your ${currentStreak}-day streak is creating beautiful momentum in your spiritual practice.`
      };
    }
    
    if (weekTotal >= weeklyGoal) {
      return {
        type: 'achievement',
        icon: '🎉',
        title: 'Weekly Goal Achieved!',
        message: 'You\'ve honored your commitment to yourself this week. Your soul is dancing!'
      };
    }
    
    if (weekTotal < weeklyGoal / 2) {
      return {
        type: 'gentle-encouragement',
        icon: '🌱',
        title: 'Gentle Reminder',
        message: `Your practice is waiting for you. Even 5 minutes can shift your entire day.`
      };
    }
    
    return {
      type: 'motivation',
      icon: '💫',
      title: 'Beautiful Progress',
      message: `${favoriteTime} sessions seem to be your sweet spot. Trust your natural rhythm.`
    };
  };

  const insight = getPersonalizedInsight();
  const weeklyPercentage = Math.min((stats.weeklyProgress.reduce((sum, day) => sum + day, 0) / stats.weeklyGoal) * 100, 100);

  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-2xl xs:text-3xl text-slate-800 mb-2">
            Your Sacred Journey
          </h2>
          <p className="font-dreamy text-slate-600">
            Every practice is a step closer to your true self
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/40 rounded-2xl p-4 text-center border border-white/30">
            <div className="text-2xl xs:text-3xl font-serif text-slate-800">
              {stats.totalSessions}
            </div>
            <div className="font-dreamy text-sm text-slate-600">
              Total Sessions
            </div>
          </div>
          
          <div className="bg-white/40 rounded-2xl p-4 text-center border border-white/30">
            <div className="text-2xl xs:text-3xl font-serif text-slate-800">
              {stats.currentStreak}
            </div>
            <div className="font-dreamy text-sm text-slate-600">
              Day Streak
            </div>
          </div>
          
          <div className="bg-white/40 rounded-2xl p-4 text-center border border-white/30">
            <div className="text-2xl xs:text-3xl font-serif text-slate-800">
              {Math.floor(stats.totalMinutes / 60)}h
            </div>
            <div className="font-dreamy text-sm text-slate-600">
              Practice Time
            </div>
          </div>
          
          <div className="bg-white/40 rounded-2xl p-4 text-center border border-white/30">
            <div className="text-2xl xs:text-3xl font-serif text-slate-800">
              {stats.favoriteTime}
            </div>
            <div className="font-dreamy text-sm text-slate-600">
              Favorite Time
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-slate-800">This Week</h3>
            <span className="font-dreamy text-sm text-slate-600">
              {stats.weeklyProgress.reduce((sum, day) => sum + day, 0)} / {stats.weeklyGoal} sessions
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-white/40 rounded-full h-3 border border-white/30 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000"
              style={{ width: `${weeklyPercentage}%` }}
            />
          </div>
          
          {/* Daily Progress Dots */}
          <div className="flex justify-between items-end">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="flex flex-col items-center space-y-2">
                <div className="text-xs font-dreamy text-slate-600">{day}</div>
                <div className="flex flex-col space-y-1">
                  {[...Array(Math.max(1, Math.max(...stats.weeklyProgress)))].map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        dotIndex < stats.weeklyProgress[index]
                          ? 'bg-emerald-500 shadow-md'
                          : 'bg-white/30 border border-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Insight */}
        <div 
          className="bg-white/40 rounded-2xl p-4 xs:p-6 border border-white/30 cursor-pointer transition-all duration-300 hover:bg-white/50"
          onClick={() => setShowInsight(!showInsight)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{insight.icon}</span>
              <div>
                <h4 className="font-serif text-lg text-slate-800">{insight.title}</h4>
                {showInsight && (
                  <p className="font-dreamy text-sm text-slate-600 mt-2 animation-fade-in">
                    {insight.message}
                  </p>
                )}
              </div>
            </div>
            <span className="text-slate-400 text-sm font-dreamy">
              {showInsight ? '−' : '+'}
            </span>
          </div>
        </div>

        {/* Goal Setting */}
        <div className="bg-white/40 rounded-2xl p-4 xs:p-6 border border-white/30">
          <h4 className="font-serif text-lg text-slate-800 mb-4">Weekly Intention</h4>
          <div className="flex items-center justify-between">
            <span className="font-dreamy text-slate-600">Practice Sessions</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setStats(prev => ({ ...prev, weeklyGoal: Math.max(1, prev.weeklyGoal - 1) }))}
                className="w-8 h-8 rounded-full bg-white/50 border border-white/30 flex items-center justify-center text-slate-600 hover:bg-white/70 transition-colors"
              >
                −
              </button>
              <span className="font-serif text-xl text-slate-800 w-8 text-center">
                {stats.weeklyGoal}
              </span>
              <button 
                onClick={() => setStats(prev => ({ ...prev, weeklyGoal: Math.min(14, prev.weeklyGoal + 1) }))}
                className="w-8 h-8 rounded-full bg-white/50 border border-white/30 flex items-center justify-center text-slate-600 hover:bg-white/70 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Milestone Recognition */}
        {stats.currentStreak > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-200 to-yellow-300 px-6 py-3 rounded-full">
              <span className="text-lg">🔥</span>
              <span className="font-serif text-slate-800">
                {stats.currentStreak} day{stats.currentStreak > 1 ? 's' : ''} of consistent practice
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
