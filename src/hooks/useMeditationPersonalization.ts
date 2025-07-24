/**
 * Custom hook for meditation portal personalization
 * Integrates with the main personalized portal data
 */

import { useState, useEffect } from 'react'
import { usePersonalizedPortal } from './usePersonalizedPortal'

interface Meditation {
  id: string
  title: string
  duration: string
  type: 'sleep' | 'focus' | 'manifestation' | 'healing' | 'chakra'
  intention: string
  description: string
  audioUrl?: string
  thumbnail: string
  isPersonalized: boolean
}

export const useMeditationPersonalization = () => {
  const { personalizedData, getMeditationRecommendations } = usePersonalizedPortal()
  const [meditations, setMeditations] = useState<Meditation[]>([])

  useEffect(() => {
    if (personalizedData?.user) {
      generatePersonalizedMeditations()
    }
  }, [personalizedData])

  const generatePersonalizedMeditations = () => {
    if (!personalizedData?.user) return

    const user = personalizedData.user
    const recommendations = getMeditationRecommendations()
    const personalized: Meditation[] = []

    // Based on zodiac sign
    if (user.zodiac_sign) {
      const zodiacMeditations = getZodiacMeditations(user.zodiac_sign)
      personalized.push(...zodiacMeditations)
    }

    // Based on spiritual goals
    if (user.spiritual_goals) {
      const goalMeditations = getGoalBasedMeditations(user.spiritual_goals)
      personalized.push(...goalMeditations)
    }

    // Based on meditation experience
    if (user.meditation_experience) {
      const experienceMeditations = getExperienceBasedMeditations(user.meditation_experience)
      personalized.push(...experienceMeditations)
    }

    // Add standard meditations
    const standardMeditations = getStandardMeditations()
    
    setMeditations([...personalized, ...standardMeditations])
  }

  const getZodiacMeditations = (zodiacSign: string): Meditation[] => {
    const zodiacMap: Record<string, Meditation> = {
      'Aries': {
        id: 'aries-power',
        title: 'Warrior\'s Fire Meditation',
        duration: '10 min',
        type: 'manifestation',
        intention: 'Channel your Aries fire into focused intention',
        description: 'Perfect for your bold, pioneering spirit',
        thumbnail: '🔥',
        isPersonalized: true
      },
      'Taurus': {
        id: 'taurus-earth',
        title: 'Grounding Earth Connection',
        duration: '20 min',
        type: 'healing',
        intention: 'Connect with Mother Earth\'s stability',
        description: 'Designed for your earthy, sensual nature',
        thumbnail: '🌱',
        isPersonalized: true
      },
      'Gemini': {
        id: 'gemini-mind',
        title: 'Twin Flame Balance',
        duration: '15 min',
        type: 'focus',
        intention: 'Balance your dual nature with clarity',
        description: 'Harmonize your quick-thinking mind',
        thumbnail: '👯‍♀️',
        isPersonalized: true
      },
      'Cancer': {
        id: 'cancer-moon',
        title: 'Lunar Healing Waters',
        duration: '25 min',
        type: 'healing',
        intention: 'Flow with the moon\'s healing energy',
        description: 'Nurture your emotional depths',
        thumbnail: '🌙',
        isPersonalized: true
      },
      'Leo': {
        id: 'leo-sun',
        title: 'Solar Heart Activation',
        duration: '18 min',
        type: 'manifestation',
        intention: 'Shine your inner light brightly',
        description: 'Embrace your regal, generous heart',
        thumbnail: '☀️',
        isPersonalized: true
      },
      'Virgo': {
        id: 'virgo-purify',
        title: 'Sacred Purification Ritual',
        duration: '22 min',
        type: 'healing',
        intention: 'Purify body, mind, and spirit',
        description: 'Perfect for your detail-oriented soul',
        thumbnail: '🌿',
        isPersonalized: true
      },
      'Libra': {
        id: 'libra-balance',
        title: 'Divine Harmony Balance',
        duration: '20 min',
        type: 'chakra',
        intention: 'Find perfect balance in all things',
        description: 'Harmonize your natural peacemaking energy',
        thumbnail: '⚖️',
        isPersonalized: true
      },
      'Scorpio': {
        id: 'scorpio-transform',
        title: 'Phoenix Transformation',
        duration: '30 min',
        type: 'healing',
        intention: 'Transform through deep inner alchemy',
        description: 'Embrace your powerful transformative nature',
        thumbnail: '🦂',
        isPersonalized: true
      },
      'Sagittarius': {
        id: 'sagittarius-adventure',
        title: 'Cosmic Adventure Journey',
        duration: '16 min',
        type: 'manifestation',
        intention: 'Expand your horizons infinitely',
        description: 'Perfect for your adventurous spirit',
        thumbnail: '🏹',
        isPersonalized: true
      },
      'Capricorn': {
        id: 'capricorn-mountain',
        title: 'Mountain Peak Wisdom',
        duration: '25 min',
        type: 'focus',
        intention: 'Achieve your highest goals with patience',
        description: 'Build your empire from within',
        thumbnail: '🏔️',
        isPersonalized: true
      },
      'Aquarius': {
        id: 'aquarius-vision',
        title: 'Visionary Future Activation',
        duration: '20 min',
        type: 'manifestation',
        intention: 'Channel revolutionary cosmic energy',
        description: 'Perfect for your innovative mind',
        thumbnail: '🌊',
        isPersonalized: true
      },
      'Pisces': {
        id: 'pisces-ocean',
        title: 'Oceanic Dreams Meditation',
        duration: '28 min',
        type: 'healing',
        intention: 'Flow with intuitive wisdom',
        description: 'Connect with your psychic depths',
        thumbnail: '🐠',
        isPersonalized: true
      }
    }

    return zodiacMap[zodiacSign] ? [zodiacMap[zodiacSign]] : []
  }

  const getGoalBasedMeditations = (goals: string): Meditation[] => {
    const goalsMeditations: Meditation[] = []

    if (goals.includes('stress_relief')) {
      goalsMeditations.push({
        id: 'stress-relief',
        title: 'Stress Melting Sanctuary',
        duration: '15 min',
        type: 'healing',
        intention: 'Release all tension and worry',
        description: 'Based on your stress relief goals',
        thumbnail: '🕯️',
        isPersonalized: true
      })
    }

    if (goals.includes('intuition')) {
      goalsMeditations.push({
        id: 'intuition-boost',
        title: 'Third Eye Awakening',
        duration: '20 min',
        type: 'chakra',
        intention: 'Open your psychic channels',
        description: 'Strengthen your inner knowing',
        thumbnail: '👁️',
        isPersonalized: true
      })
    }

    if (goals.includes('manifestation')) {
      goalsMeditations.push({
        id: 'manifestation-power',
        title: 'Co-Creation with Universe',
        duration: '25 min',
        type: 'manifestation',
        intention: 'Align with your highest desires',
        description: 'Manifest your dreams into reality',
        thumbnail: '✨',
        isPersonalized: true
      })
    }

    return goalsMeditations
  }

  const getExperienceBasedMeditations = (experience: string): Meditation[] => {
    const experienceMeditations: Meditation[] = []

    if (experience === 'beginner') {
      experienceMeditations.push({
        id: 'beginner-breath',
        title: 'Gentle Breath Awareness',
        duration: '5 min',
        type: 'focus',
        intention: 'Build your meditation foundation',
        description: 'Perfect for beginners',
        thumbnail: '🌱',
        isPersonalized: true
      })
    } else if (experience === 'intermediate') {
      experienceMeditations.push({
        id: 'intermediate-mindfulness',
        title: 'Mindful Presence Practice',
        duration: '15 min',
        type: 'focus',
        intention: 'Deepen your awareness',
        description: 'Expand your practice',
        thumbnail: '🧘‍♀️',
        isPersonalized: true
      })
    } else if (experience === 'advanced') {
      experienceMeditations.push({
        id: 'advanced-silence',
        title: 'Pure Consciousness',
        duration: '45 min',
        type: 'focus',
        intention: 'Merge with infinite awareness',
        description: 'For advanced practitioners',
        thumbnail: '🔮',
        isPersonalized: true
      })
    }

    return experienceMeditations
  }

  const getStandardMeditations = (): Meditation[] => {
    return [
      {
        id: 'morning-energy',
        title: 'Morning Energy Boost',
        duration: '12 min',
        type: 'manifestation',
        intention: 'Start your day with vitality',
        description: 'Energizing morning practice',
        thumbnail: '🌅',
        isPersonalized: false
      },
      {
        id: 'evening-rest',
        title: 'Evening Rest & Release',
        duration: '20 min',
        type: 'sleep',
        intention: 'Release the day and prepare for rest',
        description: 'Perfect for winding down',
        thumbnail: '🌙',
        isPersonalized: false
      },
      {
        id: 'heart-opening',
        title: 'Heart Chakra Opening',
        duration: '18 min',
        type: 'chakra',
        intention: 'Open to love and compassion',
        description: 'Universal heart healing',
        thumbnail: '💚',
        isPersonalized: false
      }
    ]
  }

  return {
    meditations,
    personalizedData,
    generatePersonalizedMeditations
  }
}
