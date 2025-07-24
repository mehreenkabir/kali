-- Portal Personalization Database Schema
-- This extends your existing Soul Architecture with comprehensive user tracking

-- User Activity Tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  login_count INTEGER DEFAULT 1,
  session_duration INTEGER, -- in minutes
  pages_visited TEXT, -- JSON array of pages
  features_used TEXT, -- JSON array of features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

-- User Preferences & Customization
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  portal_theme TEXT DEFAULT 'ethereal', -- ethereal, cosmic, earth, water
  dashboard_layout TEXT DEFAULT 'cards', -- cards, list, minimal
  notification_settings TEXT, -- JSON
  meditation_reminders BOOLEAN DEFAULT true,
  preferred_content_time TEXT DEFAULT 'morning',
  timezone TEXT DEFAULT 'UTC',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Personal Spiritual Profile
CREATE TABLE IF NOT EXISTS spiritual_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  primary_archetype TEXT,
  secondary_archetype TEXT,
  soul_age TEXT,
  life_path_number INTEGER,
  current_focus TEXT, -- JSON array of focus areas
  spiritual_goals TEXT, -- JSON array
  practice_experience TEXT, -- beginner, intermediate, advanced
  preferred_practices TEXT, -- JSON array
  energy_sensitivity TEXT, -- low, medium, high
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Mood & Energy Tracking
CREATE TABLE IF NOT EXISTS mood_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  emotional_state TEXT, -- calm, excited, stressed, peaceful, etc.
  gratitude_note TEXT,
  intention TEXT,
  moon_phase TEXT,
  weather TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sacred Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT, -- JSON array
  is_private BOOLEAN DEFAULT true,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Meditation Sessions & Practice Tracking
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  meditation_id TEXT,
  meditation_type TEXT NOT NULL, -- sleep, focus, manifestation, healing, chakra
  duration INTEGER NOT NULL, -- in minutes
  completion_status TEXT DEFAULT 'completed', -- completed, partial, skipped
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  intention TEXT,
  session_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crystal & Guidance Interactions
CREATE TABLE IF NOT EXISTS crystal_interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  crystal_name TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- received, meditated_with, researched
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tarot & Oracle Readings
CREATE TABLE IF NOT EXISTS tarot_readings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reading_type TEXT NOT NULL, -- three-card, celtic-cross, single
  cards_drawn TEXT NOT NULL, -- JSON array of card objects
  interpretation TEXT,
  guidance_message TEXT,
  moon_phase TEXT,
  question_asked TEXT,
  personal_notes TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ayurvedic Progress & Dosha Assessment
CREATE TABLE IF NOT EXISTS ayurveda_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  dosha_assessment TEXT, -- JSON object with vata, pitta, kapha percentages
  module_progress TEXT, -- JSON object with module completion
  recipes_tried TEXT, -- JSON array of recipe IDs
  favorite_practices TEXT, -- JSON array
  health_goals TEXT, -- JSON array
  dietary_preferences TEXT, -- JSON array
  current_season_focus TEXT,
  assessment_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Youth Elixir Practice Tracking
CREATE TABLE IF NOT EXISTS elixir_practices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  practice_id TEXT NOT NULL,
  practice_type TEXT NOT NULL, -- nutrition, movement, breath, energy, ritual
  completion_status TEXT DEFAULT 'completed',
  duration INTEGER, -- in minutes
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  notes TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Aura Reading Records
CREATE TABLE IF NOT EXISTS aura_readings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  reading_type TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  dominant_colors TEXT, -- JSON array
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  emotional_state TEXT,
  spiritual_guidance TEXT,
  recommendations TEXT, -- JSON array
  reader_notes TEXT,
  scheduled_date DATE,
  completed_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User Subscription Tracking Enhancement
CREATE TABLE IF NOT EXISTS subscription_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription_tier TEXT NOT NULL,
  subscription_start_date DATE NOT NULL,
  days_active INTEGER DEFAULT 0,
  total_logins INTEGER DEFAULT 0,
  last_login_date DATE,
  features_unlocked TEXT, -- JSON array
  engagement_score REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Content Personalization & Recommendations
CREATE TABLE IF NOT EXISTS content_interactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content_type TEXT NOT NULL, -- meditation, article, recipe, practice
  content_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- viewed, completed, liked, saved, shared
  time_spent INTEGER, -- in seconds
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_date ON meditation_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_subscription_activity_user ON subscription_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_user_type ON content_interactions(user_id, content_type);
