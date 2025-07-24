/**
 * Scheduled Email Tasks API
 * Handles automated email reminders and insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllActiveUsers, getUserMoodInsights, getUserJournalInsights } from '@/lib/database';
import { sendMoodReminderEmail, sendWeeklyInsightsEmail } from '@/lib/emailService';

// This endpoint should be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from an authorized source (cron job)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'your-secret-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { task } = body;

    let results = {};

    switch (task) {
      case 'daily_mood_reminders':
        results = await sendDailyMoodReminders();
        break;

      case 'weekly_insights':
        results = await sendWeeklyInsights();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid task type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${task} completed successfully`,
      results
    });

  } catch (error) {
    console.error('Scheduled email task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendDailyMoodReminders() {
  const users = await getAllActiveUsers();
  const results = {
    total_users: users.length,
    emails_sent: 0,
    errors: 0
  };

  for (const user of users) {
    try {
      // Only send to users who haven't logged mood today
      const today = new Date().toISOString().split('T')[0];
      const recentMoodEntry = await checkRecentMoodEntry(user.id, today);
      
      if (!recentMoodEntry) {
        const success = await sendMoodReminderEmail(user.email, user.name || 'Spiritual Seeker');
        if (success) {
          results.emails_sent++;
        } else {
          results.errors++;
        }
      }
    } catch (error) {
      console.error(`Error sending mood reminder to ${user.email}:`, error);
      results.errors++;
    }
  }

  return results;
}

async function sendWeeklyInsights() {
  const users = await getAllActiveUsers();
  const results = {
    total_users: users.length,
    emails_sent: 0,
    errors: 0
  };

  // Only run on Sundays (or whatever day you prefer for weekly insights)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  
  if (dayOfWeek !== 0) {
    return {
      message: 'Weekly insights only sent on Sundays',
      ...results
    };
  }

  for (const user of users) {
    try {
      // Get user's insights for the past week
      const insights = await generateWeeklyInsights(user.id);
      
      if (insights.moodEntries > 0 || insights.journalEntries > 0) {
        const success = await sendWeeklyInsightsEmail(
          user.email, 
          user.name || 'Spiritual Seeker', 
          insights
        );
        
        if (success) {
          results.emails_sent++;
        } else {
          results.errors++;
        }
      }
    } catch (error) {
      console.error(`Error sending weekly insights to ${user.email}:`, error);
      results.errors++;
    }
  }

  return results;
}

async function checkRecentMoodEntry(userId: number, date: string): Promise<boolean> {
  try {
    // This would check if user has already logged mood today
    // Implementation depends on your database structure
    const moodInsights = await getUserMoodInsights(userId);
    return moodInsights.todayEntry !== null;
  } catch {
    return false;
  }
}

async function generateWeeklyInsights(userId: number) {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const moodInsights = await getUserMoodInsights(userId);
    const journalInsights = await getUserJournalInsights(userId);

    return {
      moodEntries: moodInsights.weeklyEntries || 0,
      journalEntries: journalInsights.weeklyEntries || 0,
      dominantMood: moodInsights.dominantMood || null,
      averageEnergy: moodInsights.averageEnergy || 0,
      totalGratitudes: journalInsights.totalGratitudes || 0,
      topTags: journalInsights.topTags || []
    };
  } catch (error) {
    console.error('Error generating weekly insights:', error);
    return {
      moodEntries: 0,
      journalEntries: 0,
      dominantMood: null,
      averageEnergy: 0,
      totalGratitudes: 0,
      topTags: []
    };
  }
}

// GET endpoint to check scheduled task status
export async function GET() {
  return NextResponse.json({
    available_tasks: [
      'daily_mood_reminders',
      'weekly_insights'
    ],
    description: 'Use POST with task parameter to execute scheduled email tasks',
    auth_required: 'Bearer token in Authorization header'
  });
}
