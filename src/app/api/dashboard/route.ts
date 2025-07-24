/**
 * Personalized Dashboard API
 * Provides dynamic content based on user profiles, mood, and activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { initEnhancedDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const database = await initEnhancedDatabase();
    const user = await database.get('SELECT * FROM users WHERE email = ?', [session.user.email]);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build personalized dashboard content
    const dashboardData = await buildPersonalizedDashboard(user);

    return NextResponse.json({
      user: {
        name: user.name || user.first_name,
        subscriptionTier: user.subscription_tier,
        profileCompletion: user.profile_completion_percentage || 0,
        zodiacSign: user.zodiac_sign,
        moonSign: user.moon_sign
      },
      ...dashboardData
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function buildPersonalizedDashboard(user: any) {
  const database = await initEnhancedDatabase();
  
  // Get recent mood data
  const recentMood = await getRecentMoodData(user.id);
  
  // Get today's recommendations based on profile
  const todaysContent = await generateTodaysContent(user);
  
  // Get progress stats
  const progressStats = await getProgressStats(user.id);
  
  // Get crystal recommendations
  const crystalGuidance = await getCrystalGuidance(user);
  
  // Get upcoming astrological events
  const astroInsights = await getAstrologicalInsights(user);
  
  // Get personalized affirmations
  const affirmations = await getPersonalizedAffirmations(user);

  return {
    recentMood,
    todaysContent,
    progressStats,
    crystalGuidance,
    astroInsights,
    affirmations
  };
}

async function getRecentMoodData(userId: number) {
  try {
    const database = await initEnhancedDatabase();
    
    // Get today's mood entry
    const today = new Date().toISOString().split('T')[0];
    const todayMood = await database.get(
      `SELECT * FROM mood_entries 
       WHERE user_id = ? AND DATE(entry_date) = ?`,
      [userId, today]
    );

    // Get last 7 days for trend
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const moodTrend = await database.all(
      `SELECT mood, energy_level, spiritual_state, DATE(entry_date) as date 
       FROM mood_entries 
       WHERE user_id = ? AND entry_date >= ?
       ORDER BY entry_date DESC`,
      [userId, weekAgo.toISOString()]
    );

    // Calculate mood insights
    let moodDistribution: Record<string, number> = {};
    let avgEnergy = 0;
    let avgSpiritual = 0;

    moodTrend.forEach((entry: any) => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }
      if (entry.energy_level) avgEnergy += entry.energy_level;
      if (entry.spiritual_state) avgSpiritual += entry.spiritual_state;
    });

    if (moodTrend.length > 0) {
      avgEnergy = Math.round(avgEnergy / moodTrend.length);
      avgSpiritual = Math.round(avgSpiritual / moodTrend.length);
    }

    return {
      todayLogged: !!todayMood,
      todayMood: todayMood?.mood || null,
      todayEnergy: todayMood?.energy_level || null,
      weeklyTrend: moodTrend,
      averageEnergy: avgEnergy,
      averageSpiritual: avgSpiritual,
      moodDistribution,
      needsCheck: !todayMood
    };
  } catch (error) {
    console.error('Error getting mood data:', error);
    return {
      todayLogged: false,
      needsCheck: true,
      weeklyTrend: [],
      averageEnergy: 0,
      averageSpiritual: 0,
      moodDistribution: {}
    };
  }
}

async function generateTodaysContent(user: any) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const zodiacSign = user.zodiac_sign?.toLowerCase();
  const subscriptionTier = user.subscription_tier;
  
  // Daily focus based on day of week and zodiac
  const weeklyFocus = {
    0: 'reflection', // Sunday
    1: 'intention', // Monday
    2: 'manifestation', // Tuesday
    3: 'wisdom', // Wednesday
    4: 'gratitude', // Thursday
    5: 'release', // Friday
    6: 'celebration' // Saturday
  };

  const todaysFocus = weeklyFocus[dayOfWeek as keyof typeof weeklyFocus];

  // Generate content based on subscription tier
  const content: any = {
    focus: todaysFocus,
    meditation: generateMeditationRecommendation(zodiacSign, todaysFocus, user.meditation_experience),
    crystalOfDay: getDailyCrystal(zodiacSign, todaysFocus),
    affirmation: getDailyAffirmation(zodiacSign, todaysFocus),
    journalPrompt: getJournalPrompt(todaysFocus),
    availableFeatures: getFeaturesByTier(subscriptionTier)
  };

  // Add tier-specific content
  if (subscriptionTier === 'sanctum') {
    content.ayurvedicGuidance = getAyurvedicDaily(user);
    content.customCrystalInsight = getCustomCrystalInsight(user);
  }

  return content;
}

function generateMeditationRecommendation(zodiacSign: string, focus: string, experience: string) {
  const durations = {
    beginner: 10,
    intermediate: 20,
    advanced: 30
  };

  const focusStyles = {
    reflection: 'guided mindfulness',
    intention: 'visualization',
    manifestation: 'focused intention',
    wisdom: 'contemplative',
    gratitude: 'loving-kindness',
    release: 'cleansing breath work',
    celebration: 'joyful movement'
  };

  return {
    duration: durations[experience as keyof typeof durations] || 15,
    style: focusStyles[focus as keyof typeof focusStyles],
    description: `A ${focusStyles[focus as keyof typeof focusStyles]} meditation perfect for ${focus} energy`
  };
}

function getDailyCrystal(zodiacSign: string, focus: string) {
  const focusCrystals = {
    reflection: ['amethyst', 'labradorite', 'moonstone'],
    intention: ['clear quartz', 'citrine', 'fluorite'],
    manifestation: ['pyrite', 'tiger eye', 'carnelian'],
    wisdom: ['lapis lazuli', 'sodalite', 'sapphire'],
    gratitude: ['rose quartz', 'green aventurine', 'prehnite'],
    release: ['black tourmaline', 'obsidian', 'apache tear'],
    celebration: ['sunstone', 'citrine', 'orange calcite']
  };

  const crystals = focusCrystals[focus as keyof typeof focusCrystals] || ['clear quartz'];
  const randomCrystal = crystals[Math.floor(Math.random() * crystals.length)];
  
  return {
    name: randomCrystal,
    purpose: `Perfect for today's ${focus} energy`,
    usage: `Hold during meditation or carry throughout the day to enhance ${focus}`
  };
}

function getDailyAffirmation(zodiacSign: string, focus: string) {
  const affirmations = {
    reflection: "I honor my inner wisdom and trust my spiritual journey",
    intention: "I set clear intentions that align with my highest good",
    manifestation: "I have the power to create positive change in my life",
    wisdom: "I am open to receiving divine guidance and ancient wisdom",
    gratitude: "I am grateful for all the blessings flowing into my life",
    release: "I release what no longer serves me with love and compassion",
    celebration: "I celebrate my spiritual growth and unique gifts"
  };

  return affirmations[focus as keyof typeof affirmations];
}

function getJournalPrompt(focus: string) {
  const prompts = {
    reflection: "What patterns in my life are ready for transformation?",
    intention: "What do I want to manifest in my life over the next lunar cycle?",
    manifestation: "How can I align my actions with my deepest desires today?",
    wisdom: "What wisdom is my soul trying to share with me right now?",
    gratitude: "What unexpected blessings have appeared in my life recently?",
    release: "What fears or limiting beliefs am I ready to release?",
    celebration: "How have I grown spiritually in the past month?"
  };

  return prompts[focus as keyof typeof prompts];
}

function getFeaturesByTier(tier: string) {
  const features = {
    none: [],
    sanctuary: [
      'Daily Meditation Portal',
      'Akashic Records Access',
      'Crystal Guidance',
      'Tarot Forecasts',
      'Mood Tracking',
      'Sacred Journal'
    ],
    sanctum: [
      'Everything in Sanctuary',
      'Ayurvedic Masterpath',
      'Custom Crystal Jewelry',
      'Youth Elixir Practices',
      'Personal Aura Readings',
      'One-on-One Spiritual Coaching'
    ]
  };

  return features[tier as keyof typeof features] || [];
}

async function getProgressStats(userId: number) {
  try {
    const database = await initEnhancedDatabase();
    
    // Get activity stats
    const stats = await database.get(`
      SELECT 
        COUNT(CASE WHEN activity_type = 'mood_entry' THEN 1 END) as mood_entries,
        COUNT(CASE WHEN activity_type = 'journal_entry' THEN 1 END) as journal_entries,
        COUNT(CASE WHEN activity_type = 'meditation_session' THEN 1 END) as meditation_sessions,
        COUNT(CASE WHEN activity_type = 'portal_access' THEN 1 END) as portal_visits
      FROM user_activity 
      WHERE user_id = ? AND login_date >= date('now', '-30 days')
    `, [userId]);

    return {
      thirtyDayStats: stats || {
        mood_entries: 0,
        journal_entries: 0,
        meditation_sessions: 0,
        portal_visits: 0
      },
      consistency: calculateConsistency(stats),
      achievements: await getUserAchievements(userId)
    };
  } catch (error) {
    console.error('Error getting progress stats:', error);
    return {
      thirtyDayStats: {},
      consistency: 0,
      achievements: []
    };
  }
}

function calculateConsistency(stats: any) {
  if (!stats) return 0;
  
  const totalPossibleDays = 30;
  const activeDays = Math.max(
    stats.mood_entries || 0,
    stats.journal_entries || 0,
    stats.meditation_sessions || 0
  );
  
  return Math.min(Math.round((activeDays / totalPossibleDays) * 100), 100);
}

async function getUserAchievements(userId: number) {
  // This could be expanded to track various achievements
  return [
    { name: 'Spiritual Seeker', description: 'Completed profile setup', earned: true },
    { name: 'Mindful Tracker', description: 'Logged mood for 7 days', earned: false },
    { name: 'Sacred Scribe', description: 'Created 10 journal entries', earned: false }
  ];
}

async function getCrystalGuidance(user: any) {
  try {
    const database = await initEnhancedDatabase();
    
    // Get user's crystal recommendations
    const recommendations = await database.all(
      `SELECT * FROM crystal_recommendations 
       WHERE user_id = ? 
       ORDER BY priority_level ASC LIMIT 3`,
      [user.id]
    );

    return {
      personalCrystals: recommendations || [],
      usage: "Work with these crystals based on your astrological profile and current spiritual needs"
    };
  } catch (error) {
    console.error('Error getting crystal guidance:', error);
    return {
      personalCrystals: [],
      usage: "Complete your astrology profile to receive personalized crystal guidance"
    };
  }
}

async function getAstrologicalInsights(user: any) {
  if (!user.zodiac_sign) {
    return {
      message: "Complete your astrology profile to receive personalized insights",
      insights: []
    };
  }

  // This could be enhanced with real astrological data
  const currentMonth = new Date().getMonth();
  const insights = [
    `${user.zodiac_sign} energy is particularly strong this month`,
    "Mercury is in a favorable position for spiritual communication",
    "The current moon phase supports manifestation work"
  ];

  return {
    zodiacSign: user.zodiac_sign,
    moonSign: user.moon_sign,
    insights,
    recommendation: "Focus on meditation and intention-setting this week"
  };
}

async function getPersonalizedAffirmations(user: any) {
  const zodiacAffirmations = {
    aries: "I channel my fiery energy into spiritual transformation",
    taurus: "I ground myself in Earth's wisdom and abundance",
    gemini: "I communicate with my higher self and spirit guides",
    cancer: "I trust my intuition and emotional guidance",
    leo: "I shine my authentic spiritual light brightly",
    virgo: "I serve my highest purpose with dedication and precision",
    libra: "I find balance and harmony in all aspects of my spiritual journey",
    scorpio: "I transform and regenerate through spiritual practices",
    sagittarius: "I expand my consciousness and seek higher truth",
    capricorn: "I build a strong foundation for my spiritual practice",
    aquarius: "I innovate and progress on my unique spiritual path",
    pisces: "I connect deeply with divine flow and universal love"
  };

  const zodiac = user.zodiac_sign?.toLowerCase();
  const personalAffirmation = zodiacAffirmations[zodiac as keyof typeof zodiacAffirmations] || 
    "I am connected to divine wisdom and universal love";

  return [
    personalAffirmation,
    "I trust my spiritual journey and divine timing",
    "I am worthy of love, abundance, and spiritual growth"
  ];
}

function getAyurvedicDaily(user: any) {
  // This would be enhanced with actual Ayurvedic calculations
  return {
    dosha: "Vata", // This would be calculated based on user data
    recommendation: "Focus on grounding practices and warm, nourishing foods today",
    practice: "Oil pulling and gentle yoga flow"
  };
}

function getCustomCrystalInsight(user: any) {
  return {
    message: "Your custom crystal jewelry is attuned to your current spiritual needs",
    energy: "Protection and amplification of intuitive abilities",
    care: "Cleanse under moonlight and charge with intention weekly"
  };
}
