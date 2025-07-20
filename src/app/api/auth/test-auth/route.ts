// FILE: src/app/api/auth/test-auth/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'Authentication system ready',
      providers: ['google', 'github', 'credentials'],
      timestamp: new Date().toISOString(),
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      mongoDbUri: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error },
      { status: 500 }
    );
  }
}
