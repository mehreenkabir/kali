/**
 * Practice Curator - Personalizing the Spiritual Journey
 * Creates adaptive, soul-specific practices and experiences
 */

import { SoulProfile, SoulGuidance, SacredMoment } from '@/types/soul'
import { RhythmReader } from '../rhythm/RhythmReader'

type Practice = {
  id: string
  title: string
  description: string
  duration: number // minutes
  modality: string
  energy_level: 'low' | 'medium' | 'high'
  archetype_affinity: string[]
  season_affinity: string[]
  instructions: string[]
  integration_prompt?: string
}

export class PracticeCurator {
  private soulProfile: SoulProfile
  private rhythmReader: RhythmReader
  
  constructor(soulProfile: SoulProfile) {
    this.soulProfile = soulProfile
    this.rhythmReader = new RhythmReader(soulProfile)
  }

  /**
   * Curate a personalized practice for right now
   */
  async curateCurrentPractice(): Promise<Practice> {
    const currentState = this.soulProfile.current_spiritual_state
    const currentEnergy = this.calculateCurrentEnergy()
    const timeAvailable = this.estimateAvailableTime()
    const preferredModalities = this.soulProfile.rhythm_pattern.preferred_modalities
    const currentSeason = this.soulProfile.rhythm_pattern.growth_seasons.current
    
    const practicePool = this.getPracticePool()
    const suitablePractices = practicePool.filter(practice => 
      this.isPracticeSuitable(practice, currentEnergy, timeAvailable, preferredModalities, currentSeason)
    )
    
    // Select based on soul needs and archetype affinity
    const selectedPractice = this.selectOptimalPractice(suitablePractices, currentState)
    
    return this.personalizePractice(selectedPractice)
  }

  /**
   * Calculate current energy level based on spiritual state
   */
  private calculateCurrentEnergy(): 'low' | 'medium' | 'high' {
    const state = this.soulProfile.current_spiritual_state
    const average = (state.clarity + state.peace + state.vitality + state.connection + state.purpose) / 5
    
    if (average <= 4) return 'low'
    if (average >= 7) return 'high'
    return 'medium'
  }

  /**
   * Estimate available time based on current time and patterns
   */
  private estimateAvailableTime(): number {
    const now = new Date()
    const hour = now.getHours()
    
    // Time-based duration estimates
    if (hour < 7 || hour > 21) return 10 // Early morning or late evening
    if (hour >= 12 && hour <= 13) return 15 // Lunch break
    if (hour >= 18 && hour <= 20) return 30 // Evening practice time
    
    return 20 // Default
  }

  /**
   * Get the full practice pool with all available practices
   */
  private getPracticePool(): Practice[] {
    return [
      // Mystic Practices
      {
        id: 'walking-meditation',
        title: 'Sacred Walking Meditation',
        description: 'A mindful walking practice that connects you with the divine in nature',
        duration: 20,
        modality: 'meditation',
        energy_level: 'medium',
        archetype_affinity: ['mystic', 'sage'],
        season_affinity: ['tending', 'harvesting'],
        instructions: [
          'Find a quiet path in nature or create sacred space indoors',
          'Begin walking very slowly, feeling each step',
          'Breathe deeply and feel your connection to the earth',
          'With each step, offer gratitude for this moment',
          'Allow insights to arise naturally without grasping',
          'End by standing still and feeling the aliveness within'
        ],
        integration_prompt: 'What did the earth teach you about your current journey?'
      },
      {
        id: 'divine-communion',
        title: 'Divine Communion Practice',
        description: 'A deep meditation for connecting with your highest self and divine guidance',
        duration: 30,
        modality: 'contemplation',
        energy_level: 'low',
        archetype_affinity: ['mystic', 'sage'],
        season_affinity: ['resting', 'planting'],
        instructions: [
          'Create sacred space with candles or meaningful objects',
          'Sit comfortably and close your eyes',
          'Breathe deeply and feel yourself settling into stillness',
          'Ask: "What does my soul most need to know right now?"',
          'Listen with your whole being, not just your mind',
          'Receive whatever comes with gratitude and trust'
        ],
        integration_prompt: 'What divine message did you receive for your journey?'
      },

      // Healer Practices
      {
        id: 'heart-opening-breathwork',
        title: 'Heart-Opening Breathwork',
        description: 'A healing breath practice that opens your heart to give and receive love',
        duration: 15,
        modality: 'breathwork',
        energy_level: 'medium',
        archetype_affinity: ['healer', 'lover'],
        season_affinity: ['planting', 'tending'],
        instructions: [
          'Place one hand on your heart, one on your belly',
          'Breathe deeply into your heart space',
          'On the inhale, imagine green light filling your heart',
          'On the exhale, send that healing light to someone who needs it',
          'Continue for several rounds, including yourself as recipient',
          'End by placing both hands on your heart in gratitude'
        ],
        integration_prompt: 'How can you share your healing gifts more fully?'
      },
      {
        id: 'self-compassion-practice',
        title: 'Sacred Self-Compassion',
        description: 'A gentle practice for healing your relationship with yourself',
        duration: 10,
        modality: 'reflection',
        energy_level: 'low',
        archetype_affinity: ['healer', 'lover'],
        season_affinity: ['resting', 'planting'],
        instructions: [
          'Sit quietly and bring to mind a current struggle',
          'Place your hands on your heart',
          'Say: "This is a moment of suffering"',
          'Say: "Suffering is part of the human experience"',
          'Say: "May I be kind to myself in this moment"',
          'Breathe love into your heart and feel it expand'
        ],
        integration_prompt: 'How can you treat yourself with more kindness today?'
      },

      // Warrior Practices
      {
        id: 'courage-activation',
        title: 'Courage Activation Ritual',
        description: 'A powerful practice for connecting with your inner warrior and brave heart',
        duration: 15,
        modality: 'movement',
        energy_level: 'high',
        archetype_affinity: ['warrior', 'sovereign'],
        season_affinity: ['tending', 'harvesting'],
        instructions: [
          'Stand tall and feel your feet firmly on the earth',
          'Take three powerful breaths, expanding your chest',
          'Raise your arms to the sky and declare: "I am brave"',
          'Bring to mind something that requires courage',
          'Feel the fire in your belly and the strength in your bones',
          'Make one small brave action commitment for today'
        ],
        integration_prompt: 'What brave action will you take in service of your truth?'
      },
      {
        id: 'boundary-blessing',
        title: 'Sacred Boundary Blessing',
        description: 'A practice for honoring and strengthening your energetic boundaries',
        duration: 12,
        modality: 'practice',
        energy_level: 'medium',
        archetype_affinity: ['warrior', 'sovereign'],
        season_affinity: ['planting', 'tending'],
        instructions: [
          'Stand in the center of your space',
          'Imagine a circle of light around you',
          'Say: "This is my sacred space"',
          'Visualize the boundary growing stronger and more radiant',
          'Thank your boundaries for protecting your energy',
          'Step forward knowing you are protected'
        ],
        integration_prompt: 'What boundaries need your loving attention today?'
      },

      // Sage Practices
      {
        id: 'wisdom-contemplation',
        title: 'Deep Wisdom Contemplation',
        description: 'A reflective practice for accessing your inner knowing and ancient wisdom',
        duration: 25,
        modality: 'contemplation',
        energy_level: 'low',
        archetype_affinity: ['sage', 'mystic'],
        season_affinity: ['resting', 'harvesting'],
        instructions: [
          'Sit in your wisest posture with spine straight',
          'Choose a life question you are currently pondering',
          'Drop the question into the stillness of your being',
          'Notice what arises without judging or analyzing',
          'Allow wisdom to bubble up from deep within',
          'Trust the knowing that emerges from silence'
        ],
        integration_prompt: 'What wisdom wants to guide your next steps?'
      },

      // Lover Practices
      {
        id: 'gratitude-overflow',
        title: 'Gratitude Overflow Practice',
        description: 'A heart-opening practice that connects you with the abundance of love',
        duration: 10,
        modality: 'gratitude',
        energy_level: 'medium',
        archetype_affinity: ['lover', 'healer'],
        season_affinity: ['harvesting', 'tending'],
        instructions: [
          'Place both hands on your heart',
          'Feel the rhythm of your heartbeat',
          'With each heartbeat, name something you are grateful for',
          'Let gratitude fill your entire body',
          'Send gratitude to someone you love',
          'End by appreciating your own beautiful heart'
        ],
        integration_prompt: 'How can you share this gratitude with others today?'
      },

      // Creator Practices
      {
        id: 'creative-visioning',
        title: 'Sacred Creative Visioning',
        description: 'A practice for connecting with your creative essence and receiving inspiration',
        duration: 20,
        modality: 'practice',
        energy_level: 'high',
        archetype_affinity: ['creator', 'mystic'],
        season_affinity: ['planting', 'tending'],
        instructions: [
          'Gather any creative materials that call to you',
          'Close your eyes and connect with your creative essence',
          'Ask: "What wants to be created through me?"',
          'Allow images, colors, or sensations to arise',
          'Begin creating without attachment to outcome',
          'Trust the creative force flowing through you'
        ],
        integration_prompt: 'What creative project is calling for your attention?'
      },

      // Sovereign Practices
      {
        id: 'leadership-alignment',
        title: 'Sacred Leadership Alignment',
        description: 'A practice for connecting with your highest leadership potential',
        duration: 18,
        modality: 'reflection',
        energy_level: 'medium',
        archetype_affinity: ['sovereign', 'warrior'],
        season_affinity: ['tending', 'harvesting'],
        instructions: [
          'Sit tall in your most regal posture',
          'Connect with your inner sovereign',
          'Ask: "How can I best serve the highest good?"',
          'Feel your capacity to positively influence others',
          'Identify one way to lead by example today',
          'Commit to showing up as your most authentic self'
        ],
        integration_prompt: 'How will you lead with both strength and compassion today?'
      },

      // Universal Practices
      {
        id: 'present-moment-return',
        title: 'Sacred Present Moment Return',
        description: 'A simple practice for anchoring into the gift of now',
        duration: 5,
        modality: 'meditation',
        energy_level: 'low',
        archetype_affinity: ['mystic', 'sage', 'healer', 'warrior', 'lover', 'creator', 'sovereign'],
        season_affinity: ['resting', 'planting', 'tending', 'harvesting'],
        instructions: [
          'Take three conscious breaths',
          'Feel your feet on the earth',
          'Notice five things you can see',
          'Notice four things you can hear',
          'Notice three things you can feel',
          'Say: "I am here now, and this is enough"'
        ],
        integration_prompt: 'What gift does this present moment offer you?'
      }
    ]
  }

  /**
   * Check if a practice is suitable for current conditions
   */
  private isPracticeSuitable(
    practice: Practice, 
    currentEnergy: 'low' | 'medium' | 'high',
    timeAvailable: number,
    preferredModalities: string[],
    currentSeason: string
  ): boolean {
    // Check energy level compatibility
    if (currentEnergy === 'low' && practice.energy_level === 'high') return false
    if (currentEnergy === 'high' && practice.energy_level === 'low') return false
    
    // Check time availability
    if (practice.duration > timeAvailable + 5) return false // Allow 5 minute buffer
    
    // Check modality preference
    if (preferredModalities.length > 0 && !preferredModalities.includes(practice.modality)) {
      return false
    }
    
    // Check season affinity
    if (!practice.season_affinity.includes(currentSeason)) return false
    
    return true
  }

  /**
   * Select optimal practice based on soul needs and archetype
   */
  private selectOptimalPractice(practices: Practice[], currentState: any): Practice {
    if (practices.length === 0) {
      // Return a universal practice if no suitable ones found
      return this.getPracticePool().find(p => p.id === 'present-moment-return')!
    }
    
    // Score practices based on archetype affinity and current needs
    const scoredPractices = practices.map(practice => {
      let score = 0
      
      // Archetype match
      if (practice.archetype_affinity.includes(this.soulProfile.primary_archetype)) {
        score += 10
      }
      if (this.soulProfile.secondary_archetype && 
          practice.archetype_affinity.includes(this.soulProfile.secondary_archetype)) {
        score += 5
      }
      
      // Address current spiritual state needs
      if (currentState.clarity < 5 && practice.modality === 'contemplation') score += 3
      if (currentState.peace < 5 && practice.modality === 'meditation') score += 3
      if (currentState.vitality < 5 && practice.modality === 'movement') score += 3
      if (currentState.connection < 5 && practice.modality === 'gratitude') score += 3
      if (currentState.purpose < 5 && practice.modality === 'reflection') score += 3
      
      return { practice, score }
    })
    
    // Return highest scoring practice
    const topPractice = scoredPractices.sort((a, b) => b.score - a.score)[0]
    return topPractice.practice
  }

  /**
   * Personalize practice with soul-specific elements
   */
  private personalizePractice(practice: Practice): Practice {
    const personalizedInstructions = practice.instructions.map(instruction => {
      // Add archetype-specific language
      return this.addArchetypeLanguage(instruction)
    })
    
    const personalizedPrompt = practice.integration_prompt ? 
      this.personalizeIntegrationPrompt(practice.integration_prompt) : 
      undefined
    
    return {
      ...practice,
      instructions: personalizedInstructions,
      integration_prompt: personalizedPrompt
    }
  }

  /**
   * Add archetype-specific language to instructions
   */
  private addArchetypeLanguage(instruction: string): string {
    const archetype = this.soulProfile.primary_archetype
    
    const archetypeLanguage = {
      mystic: instruction.replace('divine', 'the sacred mystery'),
      healer: instruction.replace('you', 'your healing heart'),
      warrior: instruction.replace('strength', 'warrior strength'),
      sage: instruction.replace('wisdom', 'ancient wisdom'),
      lover: instruction.replace('heart', 'loving heart'),
      creator: instruction.replace('create', 'co-create'),
      sovereign: instruction.replace('you', 'your sovereign self')
    }
    
    return archetypeLanguage[archetype] || instruction
  }

  /**
   * Personalize integration prompt with soul context
   */
  private personalizeIntegrationPrompt(prompt: string): string {
    const intentions = this.soulProfile.sacred_intentions
    const edges = this.soulProfile.growth_edges
    
    if (intentions.length > 0) {
      prompt += ` Consider this in light of your intention: "${intentions[0]}"`
    }
    
    if (edges.length > 0 && Math.random() > 0.5) {
      prompt += ` How might this support your growth edge around ${edges[0]}?`
    }
    
    return prompt
  }

  /**
   * Get practice recommendations for the week
   */
  async getWeeklyPracticeFlow(): Promise<Practice[]> {
    const weeklyFlow = this.soulProfile.rhythm_pattern.energy_cycles.weekly_flow
    const practicePool = this.getPracticePool()
    
    const weeklyPractices: Practice[] = []
    
    // Select practices for high-energy days
    weeklyFlow.forEach(day => {
      const energyLevel = this.rhythmReader.getCurrentDayTheme() === 'high-energy' ? 'high' : 'medium'
      const suitablePractices = practicePool.filter(p => 
        p.energy_level === energyLevel && 
        p.archetype_affinity.includes(this.soulProfile.primary_archetype)
      )
      
      if (suitablePractices.length > 0) {
        const randomPractice = suitablePractices[Math.floor(Math.random() * suitablePractices.length)]
        weeklyPractices.push(randomPractice)
      }
    })
    
    return weeklyPractices
  }
}
