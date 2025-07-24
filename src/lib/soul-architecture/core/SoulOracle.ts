/**
 * Soul Oracle - The Heart of Spiritual Intelligence
 * Generates personalized guidance based on soul patterns
 */

import { SoulProfile, SacredMoment, WisdomThread, SoulGuidance, SpiritualState } from '@/types/soul'

export class SoulOracle {
  private soulProfile: SoulProfile
  
  constructor(soulProfile: SoulProfile) {
    this.soulProfile = soulProfile
  }

  /**
   * Generate personalized guidance based on current soul state
   */
  async generateGuidance(): Promise<SoulGuidance> {
    const patterns = this.analyzeSoulPatterns()
    const guidance = this.synthesizeWisdom(patterns)
    
    return {
      id: crypto.randomUUID(),
      soul_id: this.soulProfile.id,
      type: this.determineGuidanceType(patterns),
      guidance: guidance.message,
      reasoning: guidance.reasoning,
      urgency: this.assessUrgency(patterns),
      expires_at: this.calculateExpiry(),
      created_at: new Date()
    }
  }

  /**
   * Analyze patterns in sacred moments and wisdom threads
   */
  private analyzeSoulPatterns() {
    const recentMoments = this.getRecentSacredMoments()
    const activeThreads = this.getActiveWisdomThreads()
    const spiritualTrend = this.analyzeSpiritualStateTrend()
    
    return {
      dominantEmotions: this.extractDominantEmotions(recentMoments),
      growthPattern: this.identifyGrowthPattern(activeThreads),
      energyTrend: spiritualTrend,
      archetypeAlignment: this.assessArchetypeAlignment(),
      rhythmAlignment: this.assessRhythmAlignment()
    }
  }

  /**
   * Get recent sacred moments for pattern analysis
   */
  private getRecentSacredMoments(): SacredMoment[] {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return this.soulProfile.sacred_moments.filter(
      moment => moment.timestamp >= thirtyDaysAgo
    )
  }

  /**
   * Get wisdom threads that are actively growing
   */
  private getActiveWisdomThreads(): WisdomThread[] {
    return this.soulProfile.wisdom_threads.filter(
      thread => thread.growth_stage !== 'fruiting' && thread.integration_level < 8
    )
  }

  /**
   * Analyze spiritual state progression over time
   */
  private analyzeSpiritualStateTrend() {
    // This would analyze multiple spiritual state entries over time
    // For now, we'll work with the current state
    const current = this.soulProfile.current_spiritual_state
    
    return {
      clarity: current.clarity,
      peace: current.peace,
      vitality: current.vitality,
      connection: current.connection,
      purpose: current.purpose,
      overall: (current.clarity + current.peace + current.vitality + current.connection + current.purpose) / 5
    }
  }

  /**
   * Extract dominant emotional patterns from recent moments
   */
  private extractDominantEmotions(moments: SacredMoment[]) {
    const emotions = moments.map(m => m.emotional_landscape.primary)
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion] = (acc[emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion)
  }

  /**
   * Identify growth patterns from wisdom threads
   */
  private identifyGrowthPattern(threads: WisdomThread[]) {
    const stages = threads.map(t => t.growth_stage)
    const seedCount = stages.filter(s => s === 'seed').length
    const sproutingCount = stages.filter(s => s === 'sprouting').length
    const bloomingCount = stages.filter(s => s === 'blooming').length
    
    if (seedCount > sproutingCount + bloomingCount) {
      return 'planting' // Lots of new insights, need integration time
    } else if (sproutingCount > bloomingCount) {
      return 'growing' // Active development phase
    } else {
      return 'integrating' // Wisdom coming to fruition
    }
  }

  /**
   * Assess alignment with soul archetype
   */
  private assessArchetypeAlignment(): number {
    // Complex assessment based on recent actions and spiritual state
    // This is a simplified version
    const state = this.soulProfile.current_spiritual_state
    const archetype = this.soulProfile.primary_archetype
    
    // Each archetype has different spiritual state priorities
    const archetypeWeights = {
      mystic: { clarity: 0.3, peace: 0.2, vitality: 0.1, connection: 0.3, purpose: 0.1 },
      healer: { clarity: 0.2, peace: 0.3, vitality: 0.2, connection: 0.2, purpose: 0.1 },
      warrior: { clarity: 0.2, peace: 0.1, vitality: 0.3, connection: 0.1, purpose: 0.3 },
      sage: { clarity: 0.4, peace: 0.2, vitality: 0.1, connection: 0.1, purpose: 0.2 },
      lover: { clarity: 0.1, peace: 0.2, vitality: 0.2, connection: 0.4, purpose: 0.1 },
      creator: { clarity: 0.2, peace: 0.1, vitality: 0.3, connection: 0.1, purpose: 0.3 },
      sovereign: { clarity: 0.2, peace: 0.2, vitality: 0.2, connection: 0.2, purpose: 0.2 }
    }
    
    const weights = archetypeWeights[archetype]
    return Math.round(
      (state.clarity * weights.clarity +
       state.peace * weights.peace +
       state.vitality * weights.vitality +
       state.connection * weights.connection +
       state.purpose * weights.purpose) * 10
    ) / 10
  }

  /**
   * Assess alignment with natural rhythms
   */
  private assessRhythmAlignment(): number {
    // Simplified assessment - in full implementation would compare
    // current time/day/season with optimal rhythm patterns
    return Math.random() * 3 + 7 // Placeholder: 7-10 range
  }

  /**
   * Synthesize wisdom based on analyzed patterns
   */
  private synthesizeWisdom(patterns: any) {
    const { dominantEmotions, growthPattern, energyTrend, archetypeAlignment, rhythmAlignment } = patterns
    
    // Archetype-specific wisdom templates
    const archetypeWisdom = {
      mystic: {
        low_energy: "Your spirit calls for deeper communion. Consider a walking meditation in nature.",
        high_energy: "Channel this divine energy into contemplative practice. Journal your visions.",
        growing: "Your insights are sprouting beautifully. Trust the unfolding mystery.",
        planting: "Plant seeds of intention in the fertile silence of your heart.",
        integrating: "Wisdom flows through you now. Share your light with others."
      },
      healer: {
        low_energy: "Your healing heart needs tending. Practice self-compassion today.",
        high_energy: "Your healing gifts are amplified. Consider offering service to others.",
        growing: "Your healing abilities are developing. Trust your intuitive knowing.",
        planting: "Plant seeds of healing intention. Begin with yourself.",
        integrating: "Your healing wisdom is maturing. Teach others through your example."
      },
      warrior: {
        low_energy: "Rest, brave soul. Even warriors need restoration to fight again.",
        high_energy: "Your inner fire burns bright. Channel it toward your highest purpose.",
        growing: "Your courage is expanding. Face your growth edges with warrior spirit.",
        planting: "Plant seeds of righteous action. Begin with small, brave steps.",
        integrating: "Your warrior wisdom guides others. Lead with compassionate strength."
      },
      sage: {
        low_energy: "Wisdom ripens in stillness. Rest in the knowing that you are enough.",
        high_energy: "Your clarity shines bright. Share your insights with those who seek.",
        growing: "Knowledge transforms into wisdom through lived experience.",
        planting: "Plant seeds of understanding. Begin with deeper questions.",
        integrating: "Your sage wisdom illuminates the path for others."
      },
      lover: {
        low_energy: "Open your heart to receive love, dear one. You are cherished.",
        high_energy: "Your heart overflows with love. Let it spill into the world.",
        growing: "Love is teaching you its deeper mysteries. Stay open.",
        planting: "Plant seeds of unconditional love, beginning with yourself.",
        integrating: "Your love wisdom heals all it touches. Trust its power."
      },
      creator: {
        low_energy: "Rest in the fertile void. Creativity is gestating within you.",
        high_energy: "Your creative fire burns bright. Give form to your visions.",
        growing: "Your creative powers are expanding. Experiment with new forms.",
        planting: "Plant seeds of creative intention. What wants to be born?",
        integrating: "Your creative gifts inspire transformation. Share them boldly."
      },
      sovereign: {
        low_energy: "A sovereign knows when to rest. Honor your need for restoration.",
        high_energy: "Your leadership energy is strong. Guide with wisdom and compassion.",
        growing: "Your sovereignty is developing. Lead by example.",
        planting: "Plant seeds of conscious leadership. Begin with self-mastery.",
        integrating: "Your sovereign wisdom serves the highest good of all."
      }
    }
    
    const archetype = this.soulProfile.primary_archetype
    const wisdomSet = archetypeWisdom[archetype]
    
    let guidance: string
    let reasoning: string
    
    // Select guidance based on energy and growth pattern
    if (energyTrend.overall < 5) {
      guidance = wisdomSet.low_energy
      reasoning = "Your spiritual energy is calling for restoration and gentle care."
    } else if (energyTrend.overall > 7) {
      guidance = wisdomSet.high_energy
      reasoning = "Your spiritual energy is vibrant and ready for purposeful action."
    } else {
      guidance = wisdomSet[growthPattern as keyof typeof wisdomSet] || wisdomSet.growing
      reasoning = `Your growth pattern shows you're in a ${growthPattern} phase, perfect for focused development.`
    }
    
    return { message: guidance, reasoning }
  }

  /**
   * Determine the type of guidance needed
   */
  private determineGuidanceType(patterns: any): 'practice' | 'reflection' | 'contemplation' | 'action' {
    const { energyTrend, growthPattern } = patterns
    
    if (energyTrend.overall < 4) return 'practice' // Need restoration
    if (growthPattern === 'planting') return 'contemplation' // Need inner work
    if (growthPattern === 'growing') return 'reflection' // Need integration
    if (energyTrend.overall > 8) return 'action' // Ready for manifestation
    
    return 'practice' // Default to practice
  }

  /**
   * Assess urgency of guidance
   */
  private assessUrgency(patterns: any): 'gentle' | 'timely' | 'vital' {
    const { energyTrend, archetypeAlignment } = patterns
    
    if (energyTrend.overall < 3 || archetypeAlignment < 3) return 'vital'
    if (energyTrend.overall < 5 || archetypeAlignment < 5) return 'timely'
    return 'gentle'
  }

  /**
   * Calculate when guidance expires
   */
  private calculateExpiry(): Date {
    // Guidance expires in 3-7 days depending on urgency
    const daysToExpiry = Math.floor(Math.random() * 4) + 3
    return new Date(Date.now() + daysToExpiry * 24 * 60 * 60 * 1000)
  }
}
