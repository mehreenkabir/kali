/**
 * Soul Portal Initialization Service
 * Manages the transition from traditional to soul-centered architecture
 */

import { SoulDatabase } from './core/SoulDatabase'
import { migrateSoulDatabase } from '../database/soul-migrations/001-create-soul-tables'
import { SoulProfile, SoulAge, SoulArchetype } from '@/types/soul'

export class SoulPortalService {
  private soulDb: SoulDatabase
  private isInitialized = false

  constructor(dbPath: string) {
    this.soulDb = new SoulDatabase(dbPath)
  }

  /**
   * Initialize the soul portal system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Run soul database migrations
      await migrateSoulDatabase(this.soulDb['dbPath'])
      
      // Initialize database connection
      await this.soulDb.initialize()
      
      this.isInitialized = true
      console.log('🌟 Soul Portal Service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Soul Portal Service:', error)
      throw error
    }
  }

  /**
   * Create initial soul profile for a user
   */
  async createInitialSoulProfile(
    userId: string, 
    soulAge: SoulAge, 
    primaryArchetype: SoulArchetype,
    secondaryArchetype?: SoulArchetype
  ): Promise<SoulProfile> {
    if (!this.isInitialized) {
      throw new Error('Soul Portal Service not initialized')
    }

    const profile = await this.soulDb.createSoulProfile({
      user_id: userId,
      soul_age: soulAge,
      primary_archetype: primaryArchetype,
      secondary_archetype: secondaryArchetype,
      current_spiritual_state: {
        clarity: 5,
        peace: 5,
        vitality: 5,
        connection: 5,
        purpose: 5,
        timestamp: new Date()
      },
      rhythm_pattern: {
        soul_id: '', // Will be set by the database
        optimal_practice_time: this.getDefaultOptimalTime(primaryArchetype),
        energy_cycles: {
          daily_peak: this.getDefaultDailyPeak(primaryArchetype),
          weekly_flow: this.getDefaultWeeklyFlow(primaryArchetype),
          monthly_themes: ['growth', 'integration', 'reflection']
        },
        preferred_modalities: this.getDefaultModalities(primaryArchetype),
        growth_seasons: {
          current: 'tending',
          duration_weeks: 4
        },
        sacred_pauses: {
          frequency: 'weekly',
          duration_minutes: 15
        }
      },
      sacred_intentions: [],
      growth_edges: [],
      wisdom_threads: [],
      sacred_moments: []
    })

    return profile
  }

  /**
   * Get soul profile by user ID
   */
  async getSoulProfile(userId: string): Promise<SoulProfile | null> {
    if (!this.isInitialized) {
      throw new Error('Soul Portal Service not initialized')
    }

    return await this.soulDb.getSoulProfileByUserId(userId)
  }

  /**
   * Get the soul database instance
   */
  getSoulDatabase(): SoulDatabase {
    if (!this.isInitialized) {
      throw new Error('Soul Portal Service not initialized')
    }
    return this.soulDb
  }

  /**
   * Check if a user has a soul profile
   */
  async hasSoulProfile(userId: string): Promise<boolean> {
    const profile = await this.getSoulProfile(userId)
    return profile !== null
  }

  /**
   * Get default optimal practice time based on archetype
   */
  private getDefaultOptimalTime(archetype: SoulArchetype): string {
    const defaults = {
      mystic: '06:00',      // Dawn contemplation
      healer: '19:00',      // Evening healing energy
      warrior: '05:30',     // Early morning strength
      sage: '20:00',        // Evening wisdom time
      lover: '18:00',       // Heart opening time
      creator: '10:00',     // Creative morning energy
      sovereign: '07:00'    // Leadership morning time
    }
    return defaults[archetype]
  }

  /**
   * Get default daily peak based on archetype
   */
  private getDefaultDailyPeak(archetype: SoulArchetype): string {
    const defaults = {
      mystic: 'early',
      healer: 'evening',
      warrior: 'early',
      sage: 'evening',
      lover: 'afternoon',
      creator: 'morning',
      sovereign: 'morning'
    }
    return defaults[archetype]
  }

  /**
   * Get default weekly flow based on archetype
   */
  private getDefaultWeeklyFlow(archetype: SoulArchetype): string[] {
    const defaults = {
      mystic: ['Sunday', 'Wednesday', 'Saturday'],
      healer: ['Monday', 'Thursday', 'Sunday'],
      warrior: ['Tuesday', 'Friday', 'Sunday'],
      sage: ['Wednesday', 'Saturday', 'Monday'],
      lover: ['Friday', 'Saturday', 'Sunday'],
      creator: ['Monday', 'Wednesday', 'Friday'],
      sovereign: ['Sunday', 'Tuesday', 'Thursday']
    }
    return defaults[archetype]
  }

  /**
   * Get default modalities based on archetype
   */
  private getDefaultModalities(archetype: SoulArchetype): string[] {
    const defaults = {
      mystic: ['meditation', 'contemplation', 'communion'],
      healer: ['breathwork', 'energy work', 'compassion practice'],
      warrior: ['movement', 'courage work', 'boundary setting'],
      sage: ['reflection', 'wisdom study', 'teaching'],
      lover: ['heart opening', 'gratitude', 'connection'],
      creator: ['visioning', 'artistic practice', 'manifestation'],
      sovereign: ['leadership meditation', 'decision making', 'service']
    }
    return defaults[archetype]
  }

  /**
   * Close the service and clean up resources
   */
  async close(): Promise<void> {
    if (this.isInitialized) {
      await this.soulDb.close()
      this.isInitialized = false
    }
  }
}

// Global service instance
let soulPortalService: SoulPortalService | null = null

/**
 * Get or create the global soul portal service instance
 */
export function getSoulPortalService(): SoulPortalService {
  if (!soulPortalService) {
    const dbPath = process.env.NODE_ENV === 'production' 
      ? './soul-database.sqlite'
      : './soul-database-dev.sqlite'
    
    soulPortalService = new SoulPortalService(dbPath)
  }
  
  return soulPortalService
}
