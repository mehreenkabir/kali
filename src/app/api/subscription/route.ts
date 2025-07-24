import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateUserSubscription, getUserByEmail } from '@/lib/database';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tier, status } = await request.json();

    if (!tier || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate tier values
    const validTiers = ['none', 'sanctuary', 'sanctum'];
    const validStatuses = ['active', 'inactive', 'cancelled'];

    if (!validTiers.includes(tier) || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid tier or status value' },
        { status: 400 }
      );
    }

    // Update user subscription
    const success = await updateUserSubscription(session.user.email, tier, status);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      );
    }

    // Get updated user data
    const updatedUser = await getUserByEmail(session.user.email);

    return NextResponse.json({
      message: 'Subscription updated successfully',
      user: {
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        subscriptionTier: updatedUser?.subscription_tier,
        subscriptionStatus: updatedUser?.subscription_status,
      }
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscription_tier,
        subscriptionStatus: user.subscription_status,
        createdAt: user.created_at,
      }
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
