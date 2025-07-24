/**
 * User Activity Tracking API
 * Tracks login frequency, engagement metrics, and subscription activity
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { initEnhancedDatabase } from '@/lib/database'

// Track user login activity
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get user info
    const user = await database.get('SELECT id, subscription_start_date FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already logged in today
    const today = new Date().toISOString().split('T')[0]
    const existingEntry = await database.get(
      'SELECT id FROM user_activity WHERE user_id = ? AND DATE(login_date) = ?',
      [user.id, today]
    )

    if (!existingEntry) {
      // Record new login for today
      await database.run(
        'INSERT INTO user_activity (user_id, login_date, session_count) VALUES (?, CURRENT_TIMESTAMP, 1)',
        [user.id]
      )
    } else {
      // Increment session count for today
      await database.run(
        'UPDATE user_activity SET session_count = session_count + 1, last_activity = CURRENT_TIMESTAMP WHERE id = ?',
        [existingEntry.id]
      )
    }

    // Calculate days active since subscription
    const subscriptionStart = user.subscription_start_date || new Date().toISOString()
    const daysActive = await database.get(`
      SELECT COUNT(DISTINCT DATE(login_date)) as days_active 
      FROM user_activity 
      WHERE user_id = ? AND login_date >= ?
    `, [user.id, subscriptionStart])

    return NextResponse.json({ 
      success: true, 
      daysActive: daysActive?.days_active || 0,
      message: 'Activity tracked successfully'
    })

  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get user activity statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get user info
    const user = await database.get('SELECT id, subscription_start_date, created_at FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const subscriptionStart = user.subscription_start_date || user.created_at

    // Get activity statistics
    const stats = await database.get(`
      SELECT 
        COUNT(DISTINCT DATE(login_date)) as days_active,
        COUNT(*) as total_sessions,
        MAX(login_date) as last_login,
        MIN(login_date) as first_login
      FROM user_activity 
      WHERE user_id = ? AND login_date >= ?
    `, [user.id, subscriptionStart])

    // Get recent activity (last 30 days)
    const recentActivity = await database.all(`
      SELECT 
        DATE(login_date) as date,
        session_count,
        last_activity
      FROM user_activity 
      WHERE user_id = ? AND login_date >= date('now', '-30 days')
      ORDER BY login_date DESC
    `, [user.id])

    // Calculate streak (consecutive days)
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const hasActivity = recentActivity.some(activity => activity.date === dateStr)
      if (hasActivity) {
        currentStreak++
      } else if (i > 0) { // Don't break streak on first day (today) if no activity yet
        break
      }
    }

    return NextResponse.json({
      daysActive: stats?.days_active || 0,
      totalSessions: stats?.total_sessions || 0,
      currentStreak,
      lastLogin: stats?.last_login,
      recentActivity,
      subscriptionStartDate: subscriptionStart
    })

  } catch (error) {
    console.error('Error getting activity stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
