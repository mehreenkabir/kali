// FILE: src/app/api/user/journal-entries/route.ts
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
    
    // Get journal entries for the user
    const entries = await db.all(
      `SELECT * FROM journal_entries 
       WHERE user_email = ? 
       ORDER BY timestamp DESC LIMIT 50`,
      [session.user.email]
    );

    // Parse tags JSON for each entry
    const formattedEntries = entries.map(entry => ({
      ...entry,
      tags: entry.tags ? JSON.parse(entry.tags) : []
    }));

    return NextResponse.json(formattedEntries);

  } catch (error) {
    console.error('Error fetching journal entries:', error);
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
    const { title, content, tags } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const db = await initEnhancedDatabase();
    
    // Create journal entry
    const timestamp = new Date().toISOString();
    const id = `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.run(
      `INSERT INTO journal_entries (id, user_email, title, content, tags, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id, 
        session.user.email, 
        title.trim(), 
        content.trim(), 
        tags && tags.length > 0 ? JSON.stringify(tags) : null,
        timestamp
      ]
    );

    const newEntry = {
      id,
      title: title.trim(),
      content: content.trim(),
      tags: tags || [],
      timestamp
    };

    return NextResponse.json(newEntry, { status: 201 });

  } catch (error) {
    console.error('Error saving journal entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
