/**
 * Rhythm Reader - Attuning to Natural Spiritual Cycles
 * Learns and adapts to each soul's unique spiritual rhythms
 */

import { RhythmPattern, SoulProfile, SacredMoment } from '@/types/soul'

export class RhythmReader {
  private soulProfile: SoulProfile
  
  constructor(soulProfile: SoulProfile) {
    this.soulProfile = soulProfile
  }

  /**
   * Analyze and update rhythm patterns based on recent activity
   */
  async updateRhythmPattern(): Promise<RhythmPattern> {
    const currentPattern = this.soulProfile.rhythm_pattern
    const recentMoments = this.getRecentSacredMoments()
    const timeAnalysis = this.analyzeTimePatterns(recentMoments)
    const energyAnalysis = this.analyzeEnergyPatterns()
    
    return {
      soul_id: this.soulProfile.id,
      optimal_practice_time: this.determineOptimalTime(timeAnalysis),
      energy_cycles: {
        daily_peak: this.identifyDailyPeak(timeAnalysis),
        weekly_flow: this.identifyWeeklyFlow(timeAnalysis),
        monthly_themes: this.identifyMonthlyThemes()
      },
      preferred_modalities: this.updatePreferredModalities(recentMoments),
      growth_seasons: {
        current: this.identifyCurrentSeason(energyAnalysis),
        duration_weeks: this.estimateSeasonDuration(energyAnalysis)
      },
      sacred_pauses: {
        frequency: this.recommendPauseFrequency(energyAnalysis),
        duration_minutes: this.recommendPauseDuration(energyAnalysis)
      }
    }
  }

  /**
   * Get sacred moments from the last 90 days for rhythm analysis
   */
  private getRecentSacredMoments(): SacredMoment[] {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    return this.soulProfile.sacred_moments.filter(
      moment => moment.timestamp >= ninetyDaysAgo
    )
  }

  /**
   * Analyze when sacred moments occur to find optimal practice times
   */
  private analyzeTimePatterns(moments: SacredMoment[]) {
    const hourCounts: Record<number, number> = {}
    const dayCounts: Record<number, number> = {} // 0 = Sunday
    const monthCounts: Record<number, number> = {} // 0 = January
    
    moments.forEach(moment => {
      const date = moment.timestamp
      const hour = date.getHours()
      const day = date.getDay()
      const month = date.getMonth()
      
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
      dayCounts[day] = (dayCounts[day] || 0) + 1
      monthCounts[month] = (monthCounts[month] || 0) + 1
    })
    
    return { hourCounts, dayCounts, monthCounts }
  }

  /**
   * Analyze energy patterns from spiritual states
   */
  private analyzeEnergyPatterns() {
    const currentState = this.soulProfile.current_spiritual_state
    const overallEnergy = (
      currentState.clarity + 
      currentState.peace + 
      currentState.vitality + 
      currentState.connection + 
      currentState.purpose
    ) / 5
    
    // Simplified energy analysis - in full implementation would track over time
    return {
      overall: overallEnergy,
      variability: Math.random() * 2 + 1, // Placeholder: 1-3 range
      trend: overallEnergy > 6 ? 'ascending' : overallEnergy < 4 ? 'descending' : 'stable'
    }
  }

  /**
   * Determine optimal practice time based on activity patterns
   */
  private determineOptimalTime(timeAnalysis: any): string {
    const { hourCounts } = timeAnalysis
    
    // Find the hour with most sacred moments
    const optimalHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0]
    
    if (!optimalHour) {
      // Default based on archetype
      const archetypeDefaults = {
        mystic: '06:00',
        healer: '19:00',
        warrior: '05:30',
        sage: '20:00',
        lover: '18:00',
        creator: '10:00',
        sovereign: '07:00'
      }
      return archetypeDefaults[this.soulProfile.primary_archetype]
    }
    
    return `${optimalHour.padStart(2, '0')}:00`
  }

  /**
   * Identify daily energy peak
   */
  private identifyDailyPeak(timeAnalysis: any): string {
    const { hourCounts } = timeAnalysis
    
    const peakHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '10'
    
    const periods = {
      early: [5, 6, 7, 8],
      morning: [9, 10, 11],
      midday: [12, 13, 14],
      afternoon: [15, 16, 17],
      evening: [18, 19, 20],
      night: [21, 22, 23, 0, 1, 2, 3, 4]
    }
    
    const hour = parseInt(peakHour)
    
    for (const [period, hours] of Object.entries(periods)) {
      if (hours.includes(hour)) {
        return period
      }
    }
    
    return 'morning'
  }

  /**
   * Identify weekly energy flow
   */
  private identifyWeeklyFlow(timeAnalysis: any): string[] {
    const { dayCounts } = timeAnalysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    // Sort days by activity level
    const sortedDays = Object.entries(dayCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([day]) => dayNames[parseInt(day)])
    
    if (sortedDays.length === 0) {
      // Default based on archetype
      const archetypeDefaults = {
        mystic: ['Sunday', 'Wednesday', 'Saturday'],
        healer: ['Monday', 'Thursday', 'Sunday'],
        warrior: ['Tuesday', 'Friday', 'Sunday'],
        sage: ['Wednesday', 'Saturday', 'Monday'],
        lover: ['Friday', 'Saturday', 'Sunday'],
        creator: ['Monday', 'Wednesday', 'Friday'],
        sovereign: ['Sunday', 'Tuesday', 'Thursday']
      }
      return archetypeDefaults[this.soulProfile.primary_archetype]
    }
    
    return sortedDays.slice(0, 3) // Top 3 days
  }

  /**
   * Identify monthly themes based on archetype and season
   */
  private identifyMonthlyThemes(): string[] {
    const month = new Date().getMonth()
    const season = Math.floor(month / 3) // 0=winter, 1=spring, 2=summer, 3=fall
    
    const seasonalThemes = [
      ['reflection', 'purification', 'inner-work'], // Winter
      ['growth', 'renewal', 'manifestation'], // Spring
      ['action', 'abundance', 'celebration'], // Summer
      ['harvest', 'gratitude', 'preparation'] // Fall
    ]
    
    return seasonalThemes[season]
  }

  /**
   * Update preferred modalities based on recent moment types
   */
  private updatePreferredModalities(moments: SacredMoment[]): string[] {
    const modalityMap = {
      insight: ['meditation', 'journaling', 'contemplation'],
      breakthrough: ['breathwork', 'movement', 'ceremony'],
      challenge: ['reflection', 'support', 'practice'],
      blessing: ['gratitude', 'sharing', 'celebration'],
      connection: ['community', 'service', 'communion']
    }
    
    const modalityCounts: Record<string, number> = {}
    
    moments.forEach(moment => {
      const modalities = modalityMap[moment.type] || []
      modalities.forEach(modality => {
        modalityCounts[modality] = (modalityCounts[modality] || 0) + 1
      })
    })
    
    const preferred = Object.entries(modalityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([modality]) => modality)
    
    // Ensure we have at least some modalities
    if (preferred.length === 0) {
      return ['meditation', 'reflection', 'practice']
    }
    
    return preferred
  }

  /**
   * Identify current growth season
   */
  private identifyCurrentSeason(energyAnalysis: any): 'planting' | 'tending' | 'harvesting' | 'resting' {
    const { overall, trend } = energyAnalysis
    
    if (overall < 4) return 'resting'
    if (trend === 'ascending' && overall < 6) return 'planting'
    if (trend === 'ascending' || (trend === 'stable' && overall > 6)) return 'tending'
    if (overall > 7) return 'harvesting'
    
    return 'tending' // Default
  }

  /**
   * Estimate how long current season will last
   */
  private estimateSeasonDuration(energyAnalysis: any): number {
    const { overall, variability } = energyAnalysis
    
    // More stable energy = longer seasons
    // More variable energy = shorter seasons
    const baseWeeks = 4
    const stabilityFactor = 1 / variability
    const energyFactor = overall > 5 ? 1.2 : 0.8
    
    return Math.round(baseWeeks * stabilityFactor * energyFactor)
  }

  /**
   * Recommend frequency of sacred pauses
   */
  private recommendPauseFrequency(energyAnalysis: any): 'daily' | 'weekly' | 'monthly' {
    const { overall } = energyAnalysis
    
    if (overall < 4) return 'daily' // Need frequent restoration
    if (overall < 6) return 'weekly' // Need regular check-ins
    return 'monthly' // Stable enough for less frequent pauses
  }

  /**
   * Recommend duration of sacred pauses
   */
  private recommendPauseDuration(energyAnalysis: any): number {
    const { overall, variability } = energyAnalysis
    
    // Lower energy = longer pauses
    // Higher variability = longer pauses for stabilization
    const baseDuration = 15 // minutes
    const energyFactor = overall < 5 ? 1.5 : 1.0
    const variabilityFactor = variability > 2 ? 1.3 : 1.0
    
    return Math.round(baseDuration * energyFactor * variabilityFactor)
  }

  /**
   * Get optimal practice time for today
   */
  getOptimalPracticeTime(): string {
    return this.soulProfile.rhythm_pattern.optimal_practice_time
  }

  /**
   * Check if now is a good time for practice
   */
  isOptimalPracticeTime(): boolean {
    const now = new Date()
    const currentHour = now.getHours()
    const optimalHour = parseInt(this.soulProfile.rhythm_pattern.optimal_practice_time.split(':')[0])
    
    // Within 1 hour of optimal time
    return Math.abs(currentHour - optimalHour) <= 1
  }

  /**
   * Get current day's energy theme
   */
  getCurrentDayTheme(): string {
    const today = new Date().getDay()
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const todayName = dayNames[today]
    const weeklyFlow = this.soulProfile.rhythm_pattern.energy_cycles.weekly_flow
    
    if (weeklyFlow.includes(todayName)) {
      return 'high-energy'
    } else {
      return 'integration'
    }
  }
}
