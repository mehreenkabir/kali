/**
 * User Mood Tracking API
 * Tracks daily mood entries, patterns, and insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { initEnhancedDatabase } from '@/lib/database'

interface MoodEntry {
  user_id: number;
  date: string;
  mood: string;
  energy_level: number;
  spiritual_state: number;
  notes?: string;
  gratitude?: string;
  intention?: string;
  moon_phase?: string;
  weather?: string;
}

// Save mood entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email
    const moodData = await request.json()

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if mood entry already exists for today
    const today = new Date().toISOString().split('T')[0]
    const existingEntry = await database.get(
      'SELECT id FROM mood_entries WHERE user_id = ? AND DATE(entry_date) = ?',
      [user.id, today]
    )

    if (existingEntry) {
      // Update existing entry
      await database.run(`
        UPDATE mood_entries SET 
          mood = ?, 
          energy_level = ?, 
          spiritual_state = ?,
          notes = ?,
          gratitude = ?,
          intention = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        moodData.mood,
        moodData.energy_level || 5,
        moodData.spiritual_state || 5,
        moodData.notes || null,
        moodData.gratitude || null,
        moodData.intention || null,
        existingEntry.id
      ])
    } else {
      // Create new entry
      await database.run(`
        INSERT INTO mood_entries (
          user_id, entry_date, mood, energy_level, spiritual_state,
          notes, gratitude, intention, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [
        user.id,
        today,
        moodData.mood,
        moodData.energy_level || 5,
        moodData.spiritual_state || 5,
        moodData.notes || null,
        moodData.gratitude || null,
        moodData.intention || null
      ])
    }

    // Track activity
    await database.run(`
      INSERT OR REPLACE INTO user_activity (user_id, login_date, session_count, last_activity, mood_entries)
      VALUES (
        ?,
        DATE('now'),
        COALESCE((SELECT session_count FROM user_activity WHERE user_id = ? AND DATE(login_date) = DATE('now')), 0),
        CURRENT_TIMESTAMP,
        COALESCE((SELECT mood_entries FROM user_activity WHERE user_id = ? AND DATE(login_date) = DATE('now')), 0) + 1
      )
    `, [user.id, user.id, user.id])

    return NextResponse.json({ 
      success: true, 
      message: 'Mood entry saved successfully' 
    })

  } catch (error) {
    console.error('Error saving mood entry:', error)
    return NextResponse.json(
      { error: 'Failed to save mood entry' },
      { status: 500 }
    )
  }
}

// Get mood history and insights
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get mood entries
    const entries = await database.all(`
      SELECT 
        entry_date as date,
        mood,
        energy_level,
        spiritual_state,
        notes,
        gratitude,
        intention,
        created_at,
        updated_at
      FROM mood_entries 
      WHERE user_id = ? 
      ORDER BY entry_date DESC 
      LIMIT 30
    `, [user.id])

    // Calculate insights
    const insights = await calculateMoodInsights(database, user.id)

    return NextResponse.json({
      entries: entries || [],
      insights
    })

  } catch (error) {
    console.error('Error fetching mood data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mood data' },
      { status: 500 }
    )
  }
}

// Calculate mood insights and patterns
async function calculateMoodInsights(database: any, userId: number) {
  try {
    // Get recent entries (last 30 days)
    const recentEntries = await database.all(`
      SELECT mood, energy_level, spiritual_state, entry_date
      FROM mood_entries 
      WHERE user_id = ? AND entry_date >= DATE('now', '-30 days')
      ORDER BY entry_date DESC
    `, [userId])

    if (recentEntries.length === 0) {
      return {
        totalEntries: 0,
        avgEnergy: 0,
        avgSpiritual: 0,
        mostCommonMood: null,
        currentStreak: 0,
        moodTrends: []
      }
    }

    // Calculate averages
    const avgEnergy = recentEntries.reduce((sum: number, entry: any) => sum + entry.energy_level, 0) / recentEntries.length
    const avgSpiritual = recentEntries.reduce((sum: number, entry: any) => sum + entry.spiritual_state, 0) / recentEntries.length

    // Find most common mood
    const moodCounts = recentEntries.reduce((acc: Record<string, number>, entry: any) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || null

    // Calculate current streak (consecutive days with entries)
    let currentStreak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const hasEntry = recentEntries.some((entry: any) => entry.entry_date === dateStr)
      if (hasEntry) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate weekly trends
    const weeklyTrends = []
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date()
      weekStart.setDate(today.getDate() - (week * 7) - 6)
      const weekEnd = new Date()
      weekEnd.setDate(today.getDate() - (week * 7))

      const weekEntries = recentEntries.filter((entry: any) => {
        const entryDate = new Date(entry.entry_date)
        return entryDate >= weekStart && entryDate <= weekEnd
      })

      if (weekEntries.length > 0) {
        weeklyTrends.push({
          week: week + 1,
          avgEnergy: weekEntries.reduce((sum: number, entry: any) => sum + entry.energy_level, 0) / weekEntries.length,
          avgSpiritual: weekEntries.reduce((sum: number, entry: any) => sum + entry.spiritual_state, 0) / weekEntries.length,
          entryCount: weekEntries.length
        })
      }
    }

    return {
      totalEntries: recentEntries.length,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgSpiritual: Math.round(avgSpiritual * 10) / 10,
      mostCommonMood,
      currentStreak,
      moodTrends: weeklyTrends.reverse() // Show oldest to newest
    }

  } catch (error) {
    console.error('Error calculating mood insights:', error)
    return {
      totalEntries: 0,
      avgEnergy: 0,
      avgSpiritual: 0,
      mostCommonMood: null,
      currentStreak: 0,
      moodTrends: []
    }
  }
}
