/**
 * Custom hook for managing personalized portal data
 * Replaces mock data with real user data from database
 */

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface PersonalizedData {
  user: any
  profileCompletionPercentage: number
  crystalRecommendations: any[]
  jewelryOrders: any[]
  preferencesHistory: any[]
  personalizedData: {
    hasAstrologicalProfile: boolean
    hasShippingInfo: boolean
    hasSpirtualGoals: boolean
    favoriteColors: string[]
    jewelryStyles: string[]
    crystalTypes: string[]
  }
}

interface ActivityStats {
  daysActive: number
  totalSessions: number
  currentStreak: number
  lastLogin: string
  recentActivity: any[]
  subscriptionStartDate: string
}

export const usePersonalizedPortal = () => {
  const { data: session } = useSession()
  const [personalizedData, setPersonalizedData] = useState<PersonalizedData | null>(null)
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track login activity
  const trackActivity = async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error('Failed to track activity')
      }
      
      const result = await response.json()
      return result.daysActive
    } catch (err) {
      console.error('Error tracking activity:', err)
      return 0
    }
  }

  // Fetch personalized data
  const fetchPersonalizedData = async () => {
    if (!session?.user?.email) return

    try {
      setLoading(true)
      
      // Fetch personalization data
      const personalizationResponse = await fetch('/api/user/personalization')
      if (!personalizationResponse.ok) {
        throw new Error('Failed to fetch personalization data')
      }
      const personalizationData = await personalizationResponse.json()
      setPersonalizedData(personalizationData)

      // Fetch activity stats
      const activityResponse = await fetch('/api/user/activity')
      if (!activityResponse.ok) {
        throw new Error('Failed to fetch activity stats')
      }
      const activityData = await activityResponse.json()
      setActivityStats(activityData)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching personalized data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Save personalization data
  const savePersonalization = async (data: any) => {
    if (!session?.user?.email) return false

    try {
      const response = await fetch('/api/user/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to save personalization data')
      }

      // Refresh data after saving
      await fetchPersonalizedData()
      return true
    } catch (err) {
      console.error('Error saving personalization:', err)
      return false
    }
  }

  // Update specific field
  const updatePersonalizationField = async (field: string, value: any) => {
    if (!session?.user?.email) return false

    try {
      const response = await fetch('/api/user/personalization', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value })
      })

      if (!response.ok) {
        throw new Error('Failed to update field')
      }

      // Refresh data after updating
      await fetchPersonalizedData()
      return true
    } catch (err) {
      console.error('Error updating field:', err)
      return false
    }
  }

  // Get personalized meditation recommendations
  const getMeditationRecommendations = () => {
    if (!personalizedData?.user) return []

    const user = personalizedData.user
    const recommendations = []

    // Based on meditation experience
    if (user.meditation_experience === 'beginner') {
      recommendations.push({
        title: 'Guided Breathing',
        duration: '5-10 minutes',
        description: 'Perfect for building your foundation'
      })
    } else if (user.meditation_experience === 'intermediate') {
      recommendations.push({
        title: 'Mindfulness Practice',
        duration: '15-20 minutes',
        description: 'Deepen your awareness'
      })
    } else if (user.meditation_experience === 'advanced') {
      recommendations.push({
        title: 'Silent Meditation',
        duration: '30+ minutes',
        description: 'Pure consciousness exploration'
      })
    }

    // Based on spiritual goals
    if (user.spiritual_goals?.includes('stress_relief')) {
      recommendations.push({
        title: 'Stress Release Meditation',
        duration: '15 minutes',
        description: 'Melt away tension and anxiety'
      })
    }

    if (user.spiritual_goals?.includes('intuition')) {
      recommendations.push({
        title: 'Third Eye Activation',
        duration: '20 minutes',
        description: 'Open your inner vision'
      })
    }

    return recommendations
  }

  // Get personalized crystal recommendations with real data
  const getCrystalRecommendations = () => {
    return personalizedData?.crystalRecommendations || []
  }

  // Get personalized tarot insights based on astrology
  const getTarotInsights = () => {
    if (!personalizedData?.user) return null

    const user = personalizedData.user
    const insights = {
      zodiacSign: user.zodiac_sign,
      moonSign: user.moon_sign,
      risingSign: user.rising_sign,
      personalizedReading: `As a ${user.zodiac_sign} with ${user.moon_sign} moon, your soul seeks ${user.spiritual_goals || 'spiritual growth'}.`
    }

    return insights
  }

  // Initialize on session change
  useEffect(() => {
    if (session?.user?.email) {
      // Track activity when user loads portal
      trackActivity()
      // Fetch personalized data
      fetchPersonalizedData()
    }
  }, [session?.user?.email])

  return {
    personalizedData,
    activityStats,
    loading,
    error,
    savePersonalization,
    updatePersonalizationField,
    getMeditationRecommendations,
    getCrystalRecommendations,
    getTarotInsights,
    trackActivity,
    refetch: fetchPersonalizedData
  }
}
