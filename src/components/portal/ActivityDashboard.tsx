/**
 * Activity Dashboard Component
 * Shows comprehensive user activity stats and engagement tracking
 */

'use client';

import { useState, useEffect } from 'react';
import { usePersonalizedPortal } from '@/hooks/usePersonalizedPortal';

interface ActivityDashboardProps {
  onClose: () => void;
}

const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ onClose }) => {
  const { 
    personalizedData, 
    activityStats, 
    updatePersonalizationField,
    loading 
  } = usePersonalizedPortal();

  const [selectedTab, setSelectedTab] = useState<'overview' | 'profile' | 'goals'>('overview');

  const getEngagementLevel = () => {
    if (!activityStats) return 'Getting Started';
    
    const { currentStreak, daysActive, totalSessions } = activityStats;
    
    if (currentStreak >= 30 || daysActive >= 50) return 'Soul Master';
    if (currentStreak >= 14 || daysActive >= 25) return 'Dedicated Seeker';
    if (currentStreak >= 7 || daysActive >= 10) return 'Growing Spirit';
    if (totalSessions >= 5) return 'Awakening Soul';
    return 'New Journey';
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'Soul Master': return 'text-purple-600';
      case 'Dedicated Seeker': return 'text-blue-600';
      case 'Growing Spirit': return 'text-green-600';
      case 'Awakening Soul': return 'text-yellow-600';
      default: return 'text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 border border-white/40">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/40 rounded-xl"></div>
          <div className="h-32 bg-white/40 rounded-xl"></div>
          <div className="h-32 bg-white/40 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-6 xs:p-8 border border-white/40">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl xs:text-3xl text-slate-800">
          Your Soul Journey
        </h2>
        <button
          onClick={onClose}
          className="text-slate-600 hover:text-slate-800 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white/20 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'profile', label: 'Profile', icon: '👤' },
          { id: 'goals', label: 'Goals', icon: '🎯' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-serif text-sm transition-all ${
              selectedTab === tab.id 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Engagement Level */}
          <div className="text-center bg-white/20 rounded-2xl p-6">
            <div className="text-4xl mb-2">✨</div>
            <h3 className={`font-serif text-xl mb-2 ${getEngagementColor(getEngagementLevel())}`}>
              {getEngagementLevel()}
            </h3>
            <p className="text-slate-600 font-dreamy">
              Your current spiritual engagement level
            </p>
          </div>

          {/* Activity Stats Grid */}
          {activityStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.daysActive}</div>
                <div className="text-sm text-slate-600">Days Active</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.currentStreak}</div>
                <div className="text-sm text-slate-600">Current Streak</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="font-serif text-2xl text-slate-800">{activityStats.totalSessions}</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <div className="font-serif text-2xl text-slate-800">
                  {personalizedData?.profileCompletionPercentage || 0}%
                </div>
                <div className="text-sm text-slate-600">Profile Complete</div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {activityStats?.recentActivity && activityStats.recentActivity.length > 0 && (
            <div className="bg-white/20 rounded-2xl p-6">
              <h4 className="font-serif text-lg text-slate-800 mb-4">Recent Activity</h4>
              <div className="space-y-2">
                {activityStats.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                    <span className="text-slate-800 font-serif">
                      {activity.session_count} session{activity.session_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {selectedTab === 'profile' && personalizedData && (
        <div className="space-y-6">
          <div className="bg-white/20 rounded-2xl p-6">
            <h4 className="font-serif text-lg text-slate-800 mb-4">Profile Completion</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Overall Progress</span>
                <span className="font-serif text-slate-800">
                  {personalizedData.profileCompletionPercentage}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${personalizedData.profileCompletionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Personalized Features Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🌟</span>
                <span className="text-slate-700">Astrological Profile</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-lg ${
                personalizedData.personalizedData.hasAstrologicalProfile 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {personalizedData.personalizedData.hasAstrologicalProfile ? 'Complete' : 'Incomplete'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-lg">📦</span>
                <span className="text-slate-700">Shipping Information</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-lg ${
                personalizedData.personalizedData.hasShippingInfo 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {personalizedData.personalizedData.hasShippingInfo ? 'Complete' : 'Incomplete'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <span className="text-lg">🎯</span>
                <span className="text-slate-700">Spiritual Goals</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-lg ${
                personalizedData.personalizedData.hasSpirtualGoals 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {personalizedData.personalizedData.hasSpirtualGoals ? 'Set' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {selectedTab === 'goals' && personalizedData && (
        <div className="space-y-6">
          <div className="bg-white/20 rounded-2xl p-6">
            <h4 className="font-serif text-lg text-slate-800 mb-4">Spiritual Goals</h4>
            {personalizedData.user.spiritual_goals ? (
              <p className="text-slate-600">{personalizedData.user.spiritual_goals}</p>
            ) : (
              <p className="text-slate-500 italic">No spiritual goals set yet</p>
            )}
          </div>

          {/* Crystal Recommendations */}
          {personalizedData.crystalRecommendations.length > 0 && (
            <div className="bg-white/20 rounded-2xl p-6">
              <h4 className="font-serif text-lg text-slate-800 mb-4">Your Crystal Recommendations</h4>
              <div className="space-y-3">
                {personalizedData.crystalRecommendations.slice(0, 3).map((crystal: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/30 rounded-xl">
                    <span className="text-lg">💎</span>
                    <div>
                      <div className="font-serif text-slate-800">{crystal.crystal_type}</div>
                      <div className="text-sm text-slate-600">{crystal.recommendation_reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meditation Experience */}
          <div className="bg-white/20 rounded-2xl p-6">
            <h4 className="font-serif text-lg text-slate-800 mb-4">Meditation Experience</h4>
            <p className="text-slate-600 capitalize">
              {personalizedData.user.meditation_experience || 'Not specified'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDashboard;
