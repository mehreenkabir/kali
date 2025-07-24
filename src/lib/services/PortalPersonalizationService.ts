/**
 * Portal Personalization Service - Complete Backend for User Data Management
 * Handles all database operations for personalized portal experience
 */

import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

// Enhanced type definitions for comprehensive personalization
export interface UserActivity {
  id: string;
  user_id: string;
  date: string;
  login_count: number;
  session_duration?: number;
  pages_visited: string[];
  features_used: string[];
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  portal_theme: 'ethereal' | 'cosmic' | 'earth' | 'water';
  dashboard_layout: 'cards' | 'list' | 'minimal';
  notification_settings: {
    newContent: boolean;
    tarotReadings: boolean;
    crystalShipments: boolean;
    auraReminders: boolean;
    emailNotifications: boolean;
  };
  meditation_reminders: boolean;
  preferred_content_time: 'morning' | 'afternoon' | 'evening';
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface SpiritualProfile {
  id: string;
  user_id: string;
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  primary_archetype?: string;
  secondary_archetype?: string;
  soul_age?: string;
  life_path_number?: number;
  current_focus: string[];
  spiritual_goals: string[];
  practice_experience: 'beginner' | 'intermediate' | 'advanced';
  preferred_practices: string[];
  energy_sensitivity: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood_rating: number;
  energy_level: number;
  emotional_state: string;
  gratitude_note?: string;
  intention?: string;
  moon_phase?: string;
  weather?: string;
  notes?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood?: string;
  tags: string[];
  is_private: boolean;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface MeditationSession {
  id: string;
  user_id: string;
  meditation_id?: string;
  meditation_type: 'sleep' | 'focus' | 'manifestation' | 'healing' | 'chakra';
  duration: number;
  completion_status: 'completed' | 'partial' | 'skipped';
  rating?: number;
  notes?: string;
  intention?: string;
  session_date: string;
  created_at: string;
}

export interface SubscriptionActivity {
  id: string;
  user_id: string;
  subscription_tier: 'none' | 'sanctuary' | 'sanctum';
  subscription_start_date: string;
  days_active: number;
  total_logins: number;
  last_login_date?: string;
  features_unlocked: string[];
  engagement_score: number;
  created_at: string;
  updated_at: string;
}

export class PortalPersonalizationService {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  constructor(private dbPath: string) {}

  async initialize(): Promise<void> {
    const { open } = await import('sqlite');
    
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    });

    // Initialize tables from schema
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const schemaPath = path.join(process.cwd(), 'src/lib/database/portal-schema.sql');
      const schema = await fs.readFile(schemaPath, 'utf-8');
      await this.db.exec(schema);
    } catch (error) {
      console.error('Error creating tables:', error);
      // Fallback: create essential tables inline
      await this.createEssentialTables();
    }
  }

  private async createEssentialTables(): Promise<void> {
    if (!this.db) return;

    const tables = [
      `CREATE TABLE IF NOT EXISTS user_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        date DATE NOT NULL,
        login_count INTEGER DEFAULT 1,
        session_duration INTEGER,
        pages_visited TEXT,
        features_used TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, date)
      )`,
      `CREATE TABLE IF NOT EXISTS user_preferences (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        portal_theme TEXT DEFAULT 'ethereal',
        dashboard_layout TEXT DEFAULT 'cards',
        notification_settings TEXT,
        meditation_reminders BOOLEAN DEFAULT true,
        preferred_content_time TEXT DEFAULT 'morning',
        timezone TEXT DEFAULT 'UTC',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS subscription_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        subscription_tier TEXT NOT NULL,
        subscription_start_date DATE NOT NULL,
        days_active INTEGER DEFAULT 0,
        total_logins INTEGER DEFAULT 0,
        last_login_date DATE,
        features_unlocked TEXT,
        engagement_score REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.db.exec(table);
    }
  }

  // User Activity Tracking
  async trackUserLogin(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Check if activity exists for today
      const existing = await this.db.get(
        'SELECT * FROM user_activity WHERE user_id = ? AND date = ?',
        [userId, today]
      );

      if (existing) {
        // Update existing record
        await this.db.run(
          `UPDATE user_activity 
           SET login_count = login_count + 1, updated_at = CURRENT_TIMESTAMP 
           WHERE user_id = ? AND date = ?`,
          [userId, today]
        );
      } else {
        // Create new record
        await this.db.run(
          `INSERT INTO user_activity (id, user_id, date, login_count, pages_visited, features_used)
           VALUES (?, ?, ?, 1, '[]', '[]')`,
          [uuidv4(), userId, today]
        );
      }

      // Update subscription activity
      await this.updateSubscriptionActivity(userId);
    } catch (error) {
      console.error('Error tracking user login:', error);
    }
  }

  async trackPageVisit(userId: string, page: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const activity = await this.db.get(
        'SELECT pages_visited FROM user_activity WHERE user_id = ? AND date = ?',
        [userId, today]
      );

      if (activity) {
        const pages = JSON.parse(activity.pages_visited || '[]');
        if (!pages.includes(page)) {
          pages.push(page);
          await this.db.run(
            'UPDATE user_activity SET pages_visited = ? WHERE user_id = ? AND date = ?',
            [JSON.stringify(pages), userId, today]
          );
        }
      }
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  }

  async trackFeatureUsage(userId: string, feature: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const activity = await this.db.get(
        'SELECT features_used FROM user_activity WHERE user_id = ? AND date = ?',
        [userId, today]
      );

      if (activity) {
        const features = JSON.parse(activity.features_used || '[]');
        features.push({ feature, timestamp: new Date().toISOString() });
        await this.db.run(
          'UPDATE user_activity SET features_used = ? WHERE user_id = ? AND date = ?',
          [JSON.stringify(features), userId, today]
        );
      }
    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  }

  // User Preferences Management
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const prefs = await this.db.get(
        'SELECT * FROM user_preferences WHERE user_id = ?',
        [userId]
      );

      if (prefs) {
        return {
          ...prefs,
          notification_settings: JSON.parse(prefs.notification_settings || '{}')
        };
      }

      // Create default preferences
      const defaultPrefs: Partial<UserPreferences> = {
        id: uuidv4(),
        user_id: userId,
        portal_theme: 'ethereal',
        dashboard_layout: 'cards',
        notification_settings: {
          newContent: true,
          tarotReadings: true,
          crystalShipments: true,
          auraReminders: false,
          emailNotifications: true
        },
        meditation_reminders: true,
        preferred_content_time: 'morning',
        timezone: 'UTC'
      };

      await this.db.run(
        `INSERT INTO user_preferences 
         (id, user_id, portal_theme, dashboard_layout, notification_settings, 
          meditation_reminders, preferred_content_time, timezone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          defaultPrefs.id,
          defaultPrefs.user_id,
          defaultPrefs.portal_theme,
          defaultPrefs.dashboard_layout,
          JSON.stringify(defaultPrefs.notification_settings),
          defaultPrefs.meditation_reminders,
          defaultPrefs.preferred_content_time,
          defaultPrefs.timezone
        ]
      );

      return defaultPrefs as UserPreferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const updates = [];
      const values = [];

      if (preferences.portal_theme) {
        updates.push('portal_theme = ?');
        values.push(preferences.portal_theme);
      }
      if (preferences.dashboard_layout) {
        updates.push('dashboard_layout = ?');
        values.push(preferences.dashboard_layout);
      }
      if (preferences.notification_settings) {
        updates.push('notification_settings = ?');
        values.push(JSON.stringify(preferences.notification_settings));
      }
      if (preferences.meditation_reminders !== undefined) {
        updates.push('meditation_reminders = ?');
        values.push(preferences.meditation_reminders);
      }
      if (preferences.preferred_content_time) {
        updates.push('preferred_content_time = ?');
        values.push(preferences.preferred_content_time);
      }
      if (preferences.timezone) {
        updates.push('timezone = ?');
        values.push(preferences.timezone);
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        values.push(userId);

        await this.db.run(
          `UPDATE user_preferences SET ${updates.join(', ')} WHERE user_id = ?`,
          values
        );
      }
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  }

  // Subscription Activity Management
  async getSubscriptionActivity(userId: string): Promise<SubscriptionActivity | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const activity = await this.db.get(
        'SELECT * FROM subscription_activity WHERE user_id = ?',
        [userId]
      );

      if (activity) {
        return {
          ...activity,
          features_unlocked: JSON.parse(activity.features_unlocked || '[]')
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting subscription activity:', error);
      return null;
    }
  }

  async initializeSubscription(userId: string, tier: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const today = new Date().toISOString().split('T')[0];
      const features = this.getFeaturesByTier(tier);

      await this.db.run(
        `INSERT OR REPLACE INTO subscription_activity 
         (id, user_id, subscription_tier, subscription_start_date, days_active, 
          total_logins, last_login_date, features_unlocked, engagement_score)
         VALUES (?, ?, ?, ?, 1, 1, ?, ?, 0)`,
        [
          uuidv4(),
          userId,
          tier,
          today,
          today,
          JSON.stringify(features)
        ]
      );
    } catch (error) {
      console.error('Error initializing subscription:', error);
    }
  }

  private async updateSubscriptionActivity(userId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const activity = await this.db.get(
        'SELECT * FROM subscription_activity WHERE user_id = ?',
        [userId]
      );

      if (activity) {
        const startDate = new Date(activity.subscription_start_date);
        const todayDate = new Date(today);
        const daysSinceStart = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Get unique login days
        const loginDays = await this.db.all(
          'SELECT DISTINCT date FROM user_activity WHERE user_id = ? AND date >= ?',
          [userId, activity.subscription_start_date]
        );

        await this.db.run(
          `UPDATE subscription_activity 
           SET days_active = ?, total_logins = total_logins + 1, 
               last_login_date = ?, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = ?`,
          [loginDays.length, today, userId]
        );
      }
    } catch (error) {
      console.error('Error updating subscription activity:', error);
    }
  }

  private getFeaturesByTier(tier: string): string[] {
    const features = {
      none: [],
      sanctuary: ['meditations', 'akashic', 'crystals', 'tarot'],
      sanctum: ['meditations', 'akashic', 'crystals', 'tarot', 'ayurveda', 'jewelry', 'elixir', 'aura']
    };
    return features[tier as keyof typeof features] || [];
  }

  // Mood Tracking
  async saveMoodEntry(userId: string, moodData: Partial<MoodEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.run(
        `INSERT OR REPLACE INTO mood_entries 
         (id, user_id, date, mood_rating, energy_level, emotional_state, 
          gratitude_note, intention, moon_phase, weather, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          userId,
          moodData.date || new Date().toISOString().split('T')[0],
          moodData.mood_rating,
          moodData.energy_level,
          moodData.emotional_state,
          moodData.gratitude_note,
          moodData.intention,
          moodData.moon_phase,
          moodData.weather,
          moodData.notes
        ]
      );
    } catch (error) {
      console.error('Error saving mood entry:', error);
    }
  }

  async getMoodHistory(userId: string, days: number = 30): Promise<MoodEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const entries = await this.db.all(
        `SELECT * FROM mood_entries 
         WHERE user_id = ? 
         ORDER BY date DESC 
         LIMIT ?`,
        [userId, days]
      );
      return entries;
    } catch (error) {
      console.error('Error getting mood history:', error);
      return [];
    }
  }

  // Journal Management
  async saveJournalEntry(userId: string, entryData: Partial<JournalEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.run(
        `INSERT INTO journal_entries 
         (id, user_id, title, content, mood, tags, is_private, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          userId,
          entryData.title,
          entryData.content,
          entryData.mood,
          JSON.stringify(entryData.tags || []),
          entryData.is_private !== false,
          entryData.date || new Date().toISOString().split('T')[0]
        ]
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  }

  async getJournalEntries(userId: string, limit: number = 20): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const entries = await this.db.all(
        `SELECT * FROM journal_entries 
         WHERE user_id = ? 
         ORDER BY date DESC, created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );
      
      return entries.map(entry => ({
        ...entry,
        tags: JSON.parse(entry.tags || '[]')
      }));
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  }

  // Meditation Session Tracking
  async saveMeditationSession(userId: string, sessionData: Partial<MeditationSession>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.run(
        `INSERT INTO meditation_sessions 
         (id, user_id, meditation_id, meditation_type, duration, completion_status, 
          rating, notes, intention, session_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          userId,
          sessionData.meditation_id,
          sessionData.meditation_type,
          sessionData.duration,
          sessionData.completion_status || 'completed',
          sessionData.rating,
          sessionData.notes,
          sessionData.intention,
          sessionData.session_date || new Date().toISOString().split('T')[0]
        ]
      );

      // Track feature usage
      await this.trackFeatureUsage(userId, 'meditation');
    } catch (error) {
      console.error('Error saving meditation session:', error);
    }
  }

  async getMeditationStats(userId: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const stats = await this.db.get(
        `SELECT 
           COUNT(*) as total_sessions,
           SUM(duration) as total_minutes,
           AVG(rating) as average_rating,
           COUNT(DISTINCT session_date) as unique_days
         FROM meditation_sessions 
         WHERE user_id = ? AND completion_status = 'completed'`,
        [userId]
      );

      const recentStreak = await this.calculateMeditationStreak(userId);
      
      return {
        ...stats,
        current_streak: recentStreak
      };
    } catch (error) {
      console.error('Error getting meditation stats:', error);
      return null;
    }
  }

  private async calculateMeditationStreak(userId: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const sessions = await this.db.all(
        `SELECT DISTINCT session_date 
         FROM meditation_sessions 
         WHERE user_id = ? AND completion_status = 'completed'
         ORDER BY session_date DESC`,
        [userId]
      );

      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].session_date);
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    } catch (error) {
      console.error('Error calculating meditation streak:', error);
      return 0;
    }
  }

  // Analytics & Insights
  async getUserAnalytics(userId: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const [
        subscriptionActivity,
        preferences,
        moodTrends,
        meditationStats,
        journalCount
      ] = await Promise.all([
        this.getSubscriptionActivity(userId),
        this.getUserPreferences(userId),
        this.getMoodHistory(userId, 7),
        this.getMeditationStats(userId),
        this.db.get('SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ?', [userId])
      ]);

      return {
        subscription: subscriptionActivity,
        preferences,
        mood_trends: moodTrends,
        meditation_stats: meditationStats,
        journal_entries: journalCount?.count || 0,
        engagement_level: this.calculateEngagementLevel(subscriptionActivity, meditationStats, journalCount?.count || 0)
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  private calculateEngagementLevel(subscription: any, meditation: any, journalCount: number): string {
    let score = 0;
    
    if (subscription?.days_active > 7) score += 2;
    if (subscription?.total_logins > 20) score += 2;
    if (meditation?.total_sessions > 10) score += 2;
    if (meditation?.current_streak > 3) score += 2;
    if (journalCount > 5) score += 2;
    
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }
}

// Global service instance
let portalPersonalizationService: PortalPersonalizationService | null = null;

export function getPortalPersonalizationService(): PortalPersonalizationService {
  if (!portalPersonalizationService) {
    const dbPath = process.env.DATABASE_URL || './soul-portal.db';
    portalPersonalizationService = new PortalPersonalizationService(dbPath);
  }
  return portalPersonalizationService;
}
