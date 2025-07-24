/**
 * Sacred Journal API
 * Handles spiritual journal entries, reflections, and insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { initEnhancedDatabase } from '@/lib/database'

interface JournalEntry {
  user_id: number;
  title: string;
  content: string;
  tags?: string[];
  mood?: string;
  spiritual_insights?: string;
  gratitude_notes?: string;
  intentions?: string;
  is_private: boolean;
}

// Save journal entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email
    const entryData = await request.json()

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create new journal entry
    const result = await database.run(`
      INSERT INTO journal_entries (
        user_id, title, content, tags, mood, spiritual_insights,
        gratitude_notes, intentions, is_private, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      user.id,
      entryData.title || 'Untitled Entry',
      entryData.content || '',
      entryData.tags ? JSON.stringify(entryData.tags) : null,
      entryData.mood || null,
      entryData.spiritual_insights || null,
      entryData.gratitude_notes || null,
      entryData.intentions || null,
      entryData.is_private || true
    ])

    // Track activity
    await database.run(`
      INSERT OR REPLACE INTO user_activity (user_id, login_date, session_count, last_activity, journal_entries)
      VALUES (
        ?,
        DATE('now'),
        COALESCE((SELECT session_count FROM user_activity WHERE user_id = ? AND DATE(login_date) = DATE('now')), 0),
        CURRENT_TIMESTAMP,
        COALESCE((SELECT journal_entries FROM user_activity WHERE user_id = ? AND DATE(login_date) = DATE('now')), 0) + 1
      )
    `, [user.id, user.id, user.id])

    return NextResponse.json({ 
      success: true, 
      entryId: result.lastID,
      message: 'Journal entry saved successfully' 
    })

  } catch (error) {
    console.error('Error saving journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to save journal entry' },
      { status: 500 }
    )
  }
}

// Get journal entries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get journal entries
    const entries = await database.all(`
      SELECT 
        id,
        title,
        content,
        tags,
        mood,
        spiritual_insights,
        gratitude_notes,
        intentions,
        is_private,
        created_at,
        updated_at
      FROM journal_entries 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [user.id, limit, offset])

    // Parse JSON fields
    const parsedEntries = entries.map((entry: any) => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : []
    }))

    // Get total count for pagination
    const totalCount = await database.get(`
      SELECT COUNT(*) as count FROM journal_entries WHERE user_id = ?
    `, [user.id])

    // Calculate insights
    const insights = await calculateJournalInsights(database, user.id)

    return NextResponse.json({
      entries: parsedEntries || [],
      totalCount: totalCount?.count || 0,
      insights
    })

  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

// Update journal entry
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email
    const { entryId, ...updateData } = await request.json()

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify entry ownership
    const entry = await database.get(
      'SELECT id FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, user.id]
    )

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found or access denied' }, { status: 404 })
    }

    // Update entry
    await database.run(`
      UPDATE journal_entries SET 
        title = COALESCE(?, title),
        content = COALESCE(?, content),
        tags = COALESCE(?, tags),
        mood = COALESCE(?, mood),
        spiritual_insights = COALESCE(?, spiritual_insights),
        gratitude_notes = COALESCE(?, gratitude_notes),
        intentions = COALESCE(?, intentions),
        is_private = COALESCE(?, is_private),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      updateData.title,
      updateData.content,
      updateData.tags ? JSON.stringify(updateData.tags) : null,
      updateData.mood,
      updateData.spiritual_insights,
      updateData.gratitude_notes,
      updateData.intentions,
      updateData.is_private,
      entryId
    ])

    return NextResponse.json({ 
      success: true, 
      message: 'Journal entry updated successfully' 
    })

  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    )
  }
}

// Delete journal entry
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('entryId')

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get user info
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify entry ownership and delete
    const result = await database.run(
      'DELETE FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, user.id]
    )

    if ((result.changes ?? 0) === 0) {
      return NextResponse.json({ error: 'Entry not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Journal entry deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    )
  }
}

// Calculate journal insights
async function calculateJournalInsights(database: any, userId: number) {
  try {
    // Get recent entries (last 30 days)
    const recentEntries = await database.all(`
      SELECT content, mood, tags, created_at
      FROM journal_entries 
      WHERE user_id = ? AND created_at >= DATE('now', '-30 days')
      ORDER BY created_at DESC
    `, [userId])

    if (recentEntries.length === 0) {
      return {
        totalEntries: 0,
        recentEntries: 0,
        averageWordsPerEntry: 0,
        commonMoods: [],
        popularTags: [],
        writingFrequency: 0
      }
    }

    // Calculate word counts
    const wordCounts = recentEntries.map((entry: any) => 
      entry.content ? entry.content.split(' ').length : 0
    )
    const averageWords = wordCounts.reduce((sum: number, count: number) => sum + count, 0) / wordCounts.length

    // Analyze moods
    const moodCounts = recentEntries.reduce((acc: Record<string, number>, entry: any) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
      }
      return acc
    }, {})

    const commonMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([mood]) => mood)

    // Analyze tags
    const allTags = recentEntries.flatMap((entry: any) => 
      entry.tags ? JSON.parse(entry.tags) : []
    )
    
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})

    const popularTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))

    // Calculate writing frequency (entries per week)
    const writingFrequency = (recentEntries.length / 4) // last 30 days / ~4 weeks

    return {
      totalEntries: recentEntries.length,
      recentEntries: recentEntries.length,
      averageWordsPerEntry: Math.round(averageWords),
      commonMoods,
      popularTags,
      writingFrequency: Math.round(writingFrequency * 10) / 10
    }

  } catch (error) {
    console.error('Error calculating journal insights:', error)
    return {
      totalEntries: 0,
      recentEntries: 0,
      averageWordsPerEntry: 0,
      commonMoods: [],
      popularTags: [],
      writingFrequency: 0
    }
  }
}
