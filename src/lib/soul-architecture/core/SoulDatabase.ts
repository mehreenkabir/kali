/**
 * Soul Database Service - Sacred Data Management
 * Handles all soul-centered database operations with reverence
 */

import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'
import { SoulProfile, SacredMoment, WisdomThread, SoulGuidance, SpiritualState, RhythmPattern } from '@/types/soul'

export class SoulDatabase {
  private db: Database | null = null
  private dbPath: string

  constructor(dbPath: string) {
    this.dbPath = dbPath
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    })
  }

  /**
   * Create a new soul profile
   */
  async createSoulProfile(profile: Omit<SoulProfile, 'id' | 'created_at' | 'last_attunement'>): Promise<SoulProfile> {
    if (!this.db) throw new Error('Database not initialized')

    const id = crypto.randomUUID()
    const now = new Date()
    
    await this.db.run(`
      INSERT INTO soul_profiles (
        id, user_id, soul_age, primary_archetype, secondary_archetype,
        sacred_intentions, growth_edges, created_at, last_attunement
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      profile.user_id,
      profile.soul_age,
      profile.primary_archetype,
      profile.secondary_archetype,
      JSON.stringify(profile.sacred_intentions),
      JSON.stringify(profile.growth_edges),
      now.toISOString(),
      now.toISOString()
    ])

    // Initialize rhythm pattern
    await this.updateRhythmPattern(id, profile.rhythm_pattern)

    // Record initial spiritual state
    await this.recordSpiritualState(id, profile.current_spiritual_state)

    return {
      ...profile,
      id,
      created_at: now,
      last_attunement: now,
      wisdom_threads: [],
      sacred_moments: []
    }
  }

  /**
   * Get soul profile by user ID
   */
  async getSoulProfileByUserId(userId: string): Promise<SoulProfile | null> {
    if (!this.db) throw new Error('Database not initialized')

    const profile = await this.db.get(`
      SELECT * FROM soul_profiles WHERE user_id = ?
    `, [userId])

    if (!profile) return null

    // Get related data
    const rhythmPattern = await this.getRhythmPattern(profile.id)
    const currentSpiritualState = await this.getCurrentSpiritualState(profile.id)
    const wisdomThreads = await this.getWisdomThreads(profile.id)
    const sacredMoments = await this.getSacredMoments(profile.id)

    return {
      id: profile.id,
      user_id: profile.user_id,
      soul_age: profile.soul_age,
      primary_archetype: profile.primary_archetype,
      secondary_archetype: profile.secondary_archetype,
      current_spiritual_state: currentSpiritualState,
      rhythm_pattern: rhythmPattern,
      sacred_intentions: JSON.parse(profile.sacred_intentions || '[]'),
      growth_edges: JSON.parse(profile.growth_edges || '[]'),
      wisdom_threads: wisdomThreads,
      sacred_moments: sacredMoments,
      created_at: new Date(profile.created_at),
      last_attunement: new Date(profile.last_attunement)
    }
  }

  /**
   * Record a sacred moment
   */
  async recordSacredMoment(moment: Omit<SacredMoment, 'id' | 'timestamp'>): Promise<SacredMoment> {
    if (!this.db) throw new Error('Database not initialized')

    const id = crypto.randomUUID()
    const timestamp = new Date()

    await this.db.run(`
      INSERT INTO sacred_moments (
        id, soul_id, type, essence, context, emotional_landscape,
        transformation_seeds, moon_phase, energy_signature, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      moment.soul_id,
      moment.type,
      moment.essence,
      moment.context,
      JSON.stringify(moment.emotional_landscape),
      JSON.stringify(moment.transformation_seeds),
      moment.moon_phase,
      moment.energy_signature,
      timestamp.toISOString()
    ])

    return {
      ...moment,
      id,
      timestamp
    }
  }

  /**
   * Get sacred moments for a soul
   */
  async getSacredMoments(soulId: string, limit = 50): Promise<SacredMoment[]> {
    if (!this.db) throw new Error('Database not initialized')

    const moments = await this.db.all(`
      SELECT * FROM sacred_moments 
      WHERE soul_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `, [soulId, limit])

    return moments.map(moment => ({
      id: moment.id,
      soul_id: moment.soul_id,
      type: moment.type,
      essence: moment.essence,
      context: moment.context,
      emotional_landscape: JSON.parse(moment.emotional_landscape),
      transformation_seeds: JSON.parse(moment.transformation_seeds || '[]'),
      moon_phase: moment.moon_phase,
      energy_signature: moment.energy_signature,
      timestamp: new Date(moment.timestamp)
    }))
  }

  /**
   * Create a wisdom thread
   */
  async createWisdomThread(thread: Omit<WisdomThread, 'id' | 'created_at' | 'last_contemplated'>): Promise<WisdomThread> {
    if (!this.db) throw new Error('Database not initialized')

    const id = crypto.randomUUID()
    const now = new Date()

    await this.db.run(`
      INSERT INTO wisdom_threads (
        id, soul_id, insight, source_moment_id, related_threads,
        growth_stage, integration_level, last_contemplated, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      thread.soul_id,
      thread.insight,
      thread.source_moment_id,
      JSON.stringify(thread.related_threads),
      thread.growth_stage,
      thread.integration_level,
      now.toISOString(),
      now.toISOString()
    ])

    return {
      ...thread,
      id,
      created_at: now,
      last_contemplated: now
    }
  }

  /**
   * Get wisdom threads for a soul
   */
  async getWisdomThreads(soulId: string): Promise<WisdomThread[]> {
    if (!this.db) throw new Error('Database not initialized')

    const threads = await this.db.all(`
      SELECT * FROM wisdom_threads 
      WHERE soul_id = ? 
      ORDER BY created_at DESC
    `, [soulId])

    return threads.map(thread => ({
      id: thread.id,
      soul_id: thread.soul_id,
      insight: thread.insight,
      source_moment_id: thread.source_moment_id,
      related_threads: JSON.parse(thread.related_threads || '[]'),
      growth_stage: thread.growth_stage,
      integration_level: thread.integration_level,
      last_contemplated: new Date(thread.last_contemplated),
      created_at: new Date(thread.created_at)
    }))
  }

  /**
   * Update rhythm pattern
   */
  async updateRhythmPattern(soulId: string, pattern: RhythmPattern): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      INSERT OR REPLACE INTO rhythm_attunement (
        soul_id, optimal_practice_time, energy_cycles, preferred_modalities,
        growth_seasons, sacred_pauses, last_updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      soulId,
      pattern.optimal_practice_time,
      JSON.stringify(pattern.energy_cycles),
      JSON.stringify(pattern.preferred_modalities),
      JSON.stringify(pattern.growth_seasons),
      JSON.stringify(pattern.sacred_pauses),
      new Date().toISOString()
    ])
  }

  /**
   * Get rhythm pattern
   */
  async getRhythmPattern(soulId: string): Promise<RhythmPattern> {
    if (!this.db) throw new Error('Database not initialized')

    const pattern = await this.db.get(`
      SELECT * FROM rhythm_attunement WHERE soul_id = ?
    `, [soulId])

    if (!pattern) {
      // Return default pattern
      return {
        soul_id: soulId,
        optimal_practice_time: '07:00',
        energy_cycles: {
          daily_peak: 'morning',
          weekly_flow: ['Sunday', 'Wednesday', 'Saturday'],
          monthly_themes: ['reflection', 'growth', 'integration']
        },
        preferred_modalities: ['meditation', 'reflection'],
        growth_seasons: {
          current: 'tending',
          duration_weeks: 4
        },
        sacred_pauses: {
          frequency: 'weekly',
          duration_minutes: 15
        }
      }
    }

    return {
      soul_id: pattern.soul_id,
      optimal_practice_time: pattern.optimal_practice_time,
      energy_cycles: JSON.parse(pattern.energy_cycles),
      preferred_modalities: JSON.parse(pattern.preferred_modalities),
      growth_seasons: JSON.parse(pattern.growth_seasons),
      sacred_pauses: JSON.parse(pattern.sacred_pauses)
    }
  }

  /**
   * Record spiritual state
   */
  async recordSpiritualState(soulId: string, state: Omit<SpiritualState, 'timestamp'>): Promise<SpiritualState> {
    if (!this.db) throw new Error('Database not initialized')

    const id = crypto.randomUUID()
    const timestamp = new Date()

    await this.db.run(`
      INSERT INTO spiritual_states (
        id, soul_id, clarity, peace, vitality, connection, purpose, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      soulId,
      state.clarity,
      state.peace,
      state.vitality,
      state.connection,
      state.purpose,
      timestamp.toISOString()
    ])

    return {
      ...state,
      timestamp
    }
  }

  /**
   * Get current spiritual state
   */
  async getCurrentSpiritualState(soulId: string): Promise<SpiritualState> {
    if (!this.db) throw new Error('Database not initialized')

    const state = await this.db.get(`
      SELECT * FROM spiritual_states 
      WHERE soul_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `, [soulId])

    if (!state) {
      // Return default state
      return {
        clarity: 5,
        peace: 5,
        vitality: 5,
        connection: 5,
        purpose: 5,
        timestamp: new Date()
      }
    }

    return {
      clarity: state.clarity,
      peace: state.peace,
      vitality: state.vitality,
      connection: state.connection,
      purpose: state.purpose,
      timestamp: new Date(state.timestamp)
    }
  }

  /**
   * Save soul guidance
   */
  async saveSoulGuidance(guidance: SoulGuidance): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      INSERT INTO soul_guidance (
        id, soul_id, type, guidance, reasoning, urgency, expires_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      guidance.id,
      guidance.soul_id,
      guidance.type,
      guidance.guidance,
      guidance.reasoning,
      guidance.urgency,
      guidance.expires_at?.toISOString(),
      guidance.created_at.toISOString()
    ])
  }

  /**
   * Get active guidance for a soul
   */
  async getActiveSoulGuidance(soulId: string): Promise<SoulGuidance[]> {
    if (!this.db) throw new Error('Database not initialized')

    const guidance = await this.db.all(`
      SELECT * FROM soul_guidance 
      WHERE soul_id = ? 
      AND (expires_at IS NULL OR expires_at > datetime('now'))
      ORDER BY urgency DESC, created_at DESC
    `, [soulId])

    return guidance.map(g => ({
      id: g.id,
      soul_id: g.soul_id,
      type: g.type,
      guidance: g.guidance,
      reasoning: g.reasoning,
      urgency: g.urgency,
      expires_at: g.expires_at ? new Date(g.expires_at) : undefined,
      created_at: new Date(g.created_at)
    }))
  }

  /**
   * Update soul attunement timestamp
   */
  async updateLastAttunement(soulId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    await this.db.run(`
      UPDATE soul_profiles 
      SET last_attunement = ? 
      WHERE id = ?
    `, [new Date().toISOString(), soulId])
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close()
      this.db = null
    }
  }
}
