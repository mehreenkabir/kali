/**
 * Portal Personalization API - Complete Backend Endpoints
 * Provides all API routes for personalized portal experience
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getPortalPersonalizationService } from '@/lib/services/PortalPersonalizationService';

// Initialize the service
let serviceInitialized = false;
async function ensureServiceInitialized() {
  if (!serviceInitialized) {
    const service = getPortalPersonalizationService();
    await service.initialize();
    serviceInitialized = true;
  }
}

// Track user login/visit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureServiceInitialized();
    const service = getPortalPersonalizationService();
    
    const { action, data } = await request.json();

    switch (action) {
      case 'trackLogin':
        await service.trackUserLogin(session.user.id);
        return NextResponse.json({ success: true });

      case 'trackPageVisit':
        if (data?.page) {
          await service.trackPageVisit(session.user.id, data.page);
        }
        return NextResponse.json({ success: true });

      case 'trackFeature':
        if (data?.feature) {
          await service.trackFeatureUsage(session.user.id, data.feature);
        }
        return NextResponse.json({ success: true });

      case 'saveMood':
        if (data) {
          await service.saveMoodEntry(session.user.id, data);
        }
        return NextResponse.json({ success: true });

      case 'saveJournal':
        if (data) {
          await service.saveJournalEntry(session.user.id, data);
        }
        return NextResponse.json({ success: true });

      case 'saveMeditation':
        if (data) {
          await service.saveMeditationSession(session.user.id, data);
        }
        return NextResponse.json({ success: true });

      case 'updatePreferences':
        if (data) {
          await service.updateUserPreferences(session.user.id, data);
        }
        return NextResponse.json({ success: true });

      case 'initializeSubscription':
        if (data?.tier) {
          await service.initializeSubscription(session.user.id, data.tier);
        }
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Portal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get user data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureServiceInitialized();
    const service = getPortalPersonalizationService();
    
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('type');

    switch (dataType) {
      case 'preferences':
        const preferences = await service.getUserPreferences(session.user.id);
        return NextResponse.json({ preferences });

      case 'analytics':
        const analytics = await service.getUserAnalytics(session.user.id);
        return NextResponse.json({ analytics });

      case 'subscription':
        const subscription = await service.getSubscriptionActivity(session.user.id);
        return NextResponse.json({ subscription });

      case 'mood':
        const days = parseInt(searchParams.get('days') || '30');
        const moods = await service.getMoodHistory(session.user.id, days);
        return NextResponse.json({ moods });

      case 'journal':
        const limit = parseInt(searchParams.get('limit') || '20');
        const entries = await service.getJournalEntries(session.user.id, limit);
        return NextResponse.json({ entries });

      case 'meditation':
        const stats = await service.getMeditationStats(session.user.id);
        return NextResponse.json({ stats });

      default:
        // Return all user data
        const [userPrefs, userAnalytics, userSubscription] = await Promise.all([
          service.getUserPreferences(session.user.id),
          service.getUserAnalytics(session.user.id),
          service.getSubscriptionActivity(session.user.id)
        ]);

        return NextResponse.json({
          preferences: userPrefs,
          analytics: userAnalytics,
          subscription: userSubscription
        });
    }
  } catch (error) {
    console.error('Portal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
