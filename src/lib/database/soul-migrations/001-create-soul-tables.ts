/**
 * Soul Database Migration - Creating the Foundation
 * Revolutionary schema for tracking spiritual transformation
 */

import { Database } from 'sqlite3'
import { open } from 'sqlite'

export const createSoulTables = `
-- Soul Profiles: The heart of each being's journey
CREATE TABLE IF NOT EXISTS soul_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  soul_age TEXT NOT NULL CHECK (soul_age IN ('infant', 'baby', 'young', 'mature', 'old')),
  primary_archetype TEXT NOT NULL CHECK (primary_archetype IN ('mystic', 'healer', 'warrior', 'sage', 'lover', 'creator', 'sovereign')),
  secondary_archetype TEXT CHECK (secondary_archetype IN ('mystic', 'healer', 'warrior', 'sage', 'lover', 'creator', 'sovereign')),
  sacred_intentions TEXT, -- JSON array
  growth_edges TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_attunement DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Sacred Moments: Capturing transformation in real-time
CREATE TABLE IF NOT EXISTS sacred_moments (
  id TEXT PRIMARY KEY,
  soul_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('insight', 'breakthrough', 'challenge', 'blessing', 'connection')),
  essence TEXT NOT NULL,
  context TEXT,
  emotional_landscape TEXT NOT NULL, -- JSON object
  transformation_seeds TEXT, -- JSON array
  moon_phase TEXT,
  energy_signature TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soul_id) REFERENCES soul_profiles (id)
);

-- Wisdom Threads: Living insights that grow over time
CREATE TABLE IF NOT EXISTS wisdom_threads (
  id TEXT PRIMARY KEY,
  soul_id TEXT NOT NULL,
  insight TEXT NOT NULL,
  source_moment_id TEXT,
  related_threads TEXT, -- JSON array of thread IDs
  growth_stage TEXT NOT NULL CHECK (growth_stage IN ('seed', 'sprouting', 'blooming', 'fruiting')),
  integration_level INTEGER CHECK (integration_level BETWEEN 1 AND 10),
  last_contemplated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soul_id) REFERENCES soul_profiles (id),
  FOREIGN KEY (source_moment_id) REFERENCES sacred_moments (id)
);

-- Rhythm Attunement: Personalized spiritual rhythms
CREATE TABLE IF NOT EXISTS rhythm_attunement (
  soul_id TEXT PRIMARY KEY,
  optimal_practice_time TEXT,
  energy_cycles TEXT NOT NULL, -- JSON object
  preferred_modalities TEXT, -- JSON array
  growth_seasons TEXT NOT NULL, -- JSON object
  sacred_pauses TEXT NOT NULL, -- JSON object
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soul_id) REFERENCES soul_profiles (id)
);

-- Spiritual States: Tracking the inner landscape
CREATE TABLE IF NOT EXISTS spiritual_states (
  id TEXT PRIMARY KEY,
  soul_id TEXT NOT NULL,
  clarity INTEGER CHECK (clarity BETWEEN 1 AND 10),
  peace INTEGER CHECK (peace BETWEEN 1 AND 10),
  vitality INTEGER CHECK (vitality BETWEEN 1 AND 10),
  connection INTEGER CHECK (connection BETWEEN 1 AND 10),
  purpose INTEGER CHECK (purpose BETWEEN 1 AND 10),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soul_id) REFERENCES soul_profiles (id)
);

-- Soul Guidance: AI-generated wisdom for each soul
CREATE TABLE IF NOT EXISTS soul_guidance (
  id TEXT PRIMARY KEY,
  soul_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('practice', 'reflection', 'contemplation', 'action')),
  guidance TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('gentle', 'timely', 'vital')),
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (soul_id) REFERENCES soul_profiles (id)
);

-- Indexes for optimal soul-searching performance
CREATE INDEX IF NOT EXISTS idx_soul_profiles_user_id ON soul_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sacred_moments_soul_id ON sacred_moments(soul_id);
CREATE INDEX IF NOT EXISTS idx_sacred_moments_timestamp ON sacred_moments(timestamp);
CREATE INDEX IF NOT EXISTS idx_wisdom_threads_soul_id ON wisdom_threads(soul_id);
CREATE INDEX IF NOT EXISTS idx_wisdom_threads_growth_stage ON wisdom_threads(growth_stage);
CREATE INDEX IF NOT EXISTS idx_spiritual_states_soul_id ON spiritual_states(soul_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_states_timestamp ON spiritual_states(timestamp);
CREATE INDEX IF NOT EXISTS idx_soul_guidance_soul_id ON soul_guidance(soul_id);
CREATE INDEX IF NOT EXISTS idx_soul_guidance_urgency ON soul_guidance(urgency);
`

export async function migrateSoulDatabase(dbPath: string) {
  const db = await open({
    filename: dbPath,
    driver: Database
  })

  try {
    // Execute the soul-centered schema creation
    await db.exec(createSoulTables)
    console.log('🌟 Soul database migration completed successfully')
    return true
  } catch (error) {
    console.error('❌ Soul database migration failed:', error)
    return false
  } finally {
    await db.close()
  }
}
