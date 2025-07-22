// FILE: src/app/api/mail/route.ts
import { NextResponse } from 'next/server';

// Simple in-memory storage for demo (in production, use a database)
let emailStorage: any[] = [];

export async function GET() {
  try {
    // Return all emails
    return NextResponse.json({
      success: true,
      emails: emailStorage.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const emailData = await request.json();
    
    // Add email to storage
    const newEmail = {
      id: Date.now().toString(),
      ...emailData,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    emailStorage.unshift(newEmail);
    
    console.log('📧 New email saved:', newEmail.subject);
    
    return NextResponse.json({
      success: true,
      message: 'Email saved successfully',
      email: newEmail
    });
  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Failed to save email' },
      { status: 500 }
    );
  }
}
