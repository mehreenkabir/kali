/**
 * Soul-Centered Type Definitions
 * Foundation for spiritual transformation tracking
 */

export type SoulAge = 
  | 'infant'     // New to spiritual growth
  | 'baby'       // Beginning to explore
  | 'young'      // Active learning
  | 'mature'     // Integrating wisdom
  | 'old'        // Teaching others

export type SoulArchetype = 
  | 'mystic'     // Seeks divine connection
  | 'healer'     // Channels restoration
  | 'warrior'    // Protects truth
  | 'sage'       // Shares wisdom
  | 'lover'      // Embodies compassion
  | 'creator'    // Manifests beauty
  | 'sovereign'  // Leads with wisdom

export type SacredMoment = {
  id: string
  soul_id: string
  type: 'insight' | 'breakthrough' | 'challenge' | 'blessing' | 'connection'
  essence: string
  context?: string
  emotional_landscape: {
    primary: string
    secondary?: string
    depth: number // 1-10
  }
  transformation_seeds: string[]
  timestamp: Date
  moon_phase?: string
  energy_signature?: string
}

export type WisdomThread = {
  id: string
  soul_id: string
  insight: string
  source_moment_id?: string
  related_threads: string[]
  growth_stage: 'seed' | 'sprouting' | 'blooming' | 'fruiting'
  integration_level: number // 1-10
  last_contemplated: Date
  created_at: Date
}

export type RhythmPattern = {
  soul_id: string
  optimal_practice_time: string
  energy_cycles: {
    daily_peak: string
    weekly_flow: string[]
    monthly_themes: string[]
  }
  preferred_modalities: string[]
  growth_seasons: {
    current: 'planting' | 'tending' | 'harvesting' | 'resting'
    duration_weeks: number
  }
  sacred_pauses: {
    frequency: 'daily' | 'weekly' | 'monthly'
    duration_minutes: number
  }
}

export type SpiritualState = {
  clarity: number        // 1-10
  peace: number         // 1-10
  vitality: number      // 1-10
  connection: number    // 1-10
  purpose: number       // 1-10
  timestamp: Date
}

export type SoulProfile = {
  id: string
  user_id: string
  soul_age: SoulAge
  primary_archetype: SoulArchetype
  secondary_archetype?: SoulArchetype
  current_spiritual_state: SpiritualState
  rhythm_pattern: RhythmPattern
  sacred_intentions: string[]
  growth_edges: string[]
  wisdom_threads: WisdomThread[]
  sacred_moments: SacredMoment[]
  created_at: Date
  last_attunement: Date
}

export type SoulGuidance = {
  id: string
  soul_id: string
  type: 'practice' | 'reflection' | 'contemplation' | 'action'
  guidance: string
  reasoning: string
  urgency: 'gentle' | 'timely' | 'vital'
  expires_at?: Date
  created_at: Date
}
