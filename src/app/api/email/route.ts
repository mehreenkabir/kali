/**
 * Email API Route
 * Handles sending various types of emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import {
  sendWelcomeEmail,
  sendMoodReminderEmail,
  sendWeeklyInsightsEmail,
  sendShippingNotificationEmail,
  sendPaymentFailureEmail
} from '@/lib/emailService';

// Import authOptions from the NextAuth route
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow system emails or authenticated user emails
    const body = await request.json();
    const { type, recipientEmail, data } = body;

    // System emails don't require authentication
    const isSystemEmail = ['welcome', 'payment_failure', 'shipping'].includes(type);
    
    if (!isSystemEmail && !session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userEmail = recipientEmail || session?.user?.email;
    const userName = data?.userName || session?.user?.name || 'Spiritual Seeker';

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Recipient email required' },
        { status: 400 }
      );
    }

    let success = false;

    switch (type) {
      case 'welcome':
        success = await sendWelcomeEmail(userEmail, data.subscriptionTier);
        break;

      case 'mood_reminder':
        success = await sendMoodReminderEmail(userEmail, userName);
        break;

      case 'weekly_insights':
        success = await sendWeeklyInsightsEmail(userEmail, userName, data.insights);
        break;

      case 'shipping_notification':
        success = await sendShippingNotificationEmail(userEmail, userName, data.orderDetails);
        break;

      case 'payment_failure':
        success = await sendPaymentFailureEmail(userEmail, userName);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (success) {
      return NextResponse.json({
        message: 'Email sent successfully',
        type: type
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check email status or get templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Return available email types and their descriptions
    const emailTypes = {
      welcome: 'Welcome email after subscription',
      mood_reminder: 'Daily mood check-in reminder',
      weekly_insights: 'Weekly spiritual insights summary',
      shipping_notification: 'Crystal jewelry shipping notification',
      payment_failure: 'Payment failure notification'
    };

    return NextResponse.json({
      available_types: emailTypes,
      user_email: session.user.email
    });

  } catch (error) {
    console.error('Email API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
