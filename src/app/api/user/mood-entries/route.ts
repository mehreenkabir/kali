// FILE: src/app/api/user/mood-entries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { initEnhancedDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await initEnhancedDatabase();
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's mood entry
    const todayMood = await db.get(
      `SELECT * FROM mood_entries 
       WHERE user_email = ? AND DATE(timestamp) = ? 
       ORDER BY timestamp DESC LIMIT 1`,
      [session.user.email, today]
    );

    // Get recent mood entries (last 7 days)
    const recentMoods = await db.all(
      `SELECT * FROM mood_entries 
       WHERE user_email = ? AND timestamp >= datetime('now', '-7 days')
       ORDER BY timestamp DESC LIMIT 10`,
      [session.user.email]
    );

    return NextResponse.json({
      today: todayMood || null,
      recent: recentMoods || []
    });

  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mood, intensity, note } = body;

    if (!mood || typeof intensity !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await initEnhancedDatabase();
    
    // Create mood entry
    const timestamp = new Date().toISOString();
    const id = `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.run(
      `INSERT INTO mood_entries (id, user_email, mood, intensity, note, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, session.user.email, mood, intensity, note || null, timestamp]
    );

    const newEntry = {
      id,
      mood,
      intensity,
      note: note || null,
      timestamp
    };

    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error('Error saving mood entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
