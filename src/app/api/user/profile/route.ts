// FILE: src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { 
  initEnhancedDatabase, 
  getEnhancedUserByEmail, 
  updateUserProfile,
  generateCrystalRecommendations 
} from '@/lib/database';

// GET - Retrieve user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getEnhancedUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse JSON fields
    const profile = {
      ...user,
      favoriteCrystals: user.favorite_crystals ? JSON.parse(user.favorite_crystals) : [],
      spiritualGoals: user.spiritual_goals ? JSON.parse(user.spiritual_goals) : [],
      preferredMetals: user.preferred_metals ? JSON.parse(user.preferred_metals) : [],
      crystalAllergies: user.crystal_allergies ? JSON.parse(user.crystal_allergies) : [],
      jewelryPreferences: user.jewelry_preferences ? JSON.parse(user.jewelry_preferences) : {}
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Get current user
    const currentUser = await getEnhancedUserByEmail(session.user.email);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data with JSON serialization for arrays
    const updateData: Record<string, any> = {
      birth_date: body.birthDate || null,
      birth_time: body.birthTime || null,
      birth_location: body.birthLocation || null,
      zodiac_sign: body.zodiacSign || null,
      moon_sign: body.moonSign || null,
      rising_sign: body.risingSign || null,
      favorite_crystals: body.favoriteCrystals ? JSON.stringify(body.favoriteCrystals) : null,
      spiritual_goals: body.spiritualGoals ? JSON.stringify(body.spiritualGoals) : null,
      meditation_experience: body.meditationExperience || null,
      preferred_practice_time: body.preferredPracticeTime || null,
      intention_focus: body.intentionFocus || null,
      shipping_first_name: body.shippingFirstName || null,
      shipping_last_name: body.shippingLastName || null,
      shipping_address_line1: body.shippingAddressLine1 || null,
      shipping_address_line2: body.shippingAddressLine2 || null,
      shipping_city: body.shippingCity || null,
      shipping_state: body.shippingState || null,
      shipping_postal_code: body.shippingPostalCode || null,
      shipping_country: body.shippingCountry || 'US',
      phone_number: body.phoneNumber || null,
      emergency_contact_name: body.emergencyContactName || null,
      emergency_contact_phone: body.emergencyContactPhone || null,
      preferred_metals: body.preferredMetals ? JSON.stringify(body.preferredMetals) : null,
      ring_size: body.ringSize || null,
      bracelet_size: body.braceletSize || null,
      necklace_length_preference: body.necklaceLengthPreference || null,
      crystal_allergies: body.crystalAllergies ? JSON.stringify(body.crystalAllergies) : null,
      profile_updated_at: new Date().toISOString()
    };

    // Check profile completion status
    const astrologyCompleted = !!(updateData.birth_date && updateData.zodiac_sign);
    const shippingCompleted = !!(updateData.shipping_first_name && updateData.shipping_last_name && 
                                updateData.shipping_address_line1 && updateData.shipping_city && 
                                updateData.shipping_state && updateData.shipping_postal_code);
    const jewelryCompleted = !!(updateData.preferred_metals && updateData.ring_size);
    const profileCompleted = astrologyCompleted && shippingCompleted && jewelryCompleted;

    updateData.astrology_profile_completed = astrologyCompleted;
    updateData.jewelry_profile_completed = jewelryCompleted;
    updateData.profile_completed = profileCompleted;
    updateData.address_verified = shippingCompleted; // Basic verification

    // Update user profile
    const success = await updateUserProfile(session.user.email, updateData);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Generate crystal recommendations if astrology profile is completed
    if (astrologyCompleted && updateData.zodiac_sign) {
      await generateCrystalRecommendations(currentUser.id, updateData.zodiac_sign);
    }

    // Get updated user profile
    const updatedUser = await getEnhancedUserByEmail(session.user.email);

    if (!updatedUser) {
      return NextResponse.json({ error: 'Error retrieving updated profile' }, { status: 500 });
    }

    // Parse JSON fields for response
    const profile = {
      ...updatedUser,
      favoriteCrystals: updatedUser.favorite_crystals ? JSON.parse(updatedUser.favorite_crystals) : [],
      spiritualGoals: updatedUser.spiritual_goals ? JSON.parse(updatedUser.spiritual_goals) : [],
      preferredMetals: updatedUser.preferred_metals ? JSON.parse(updatedUser.preferred_metals) : [],
      crystalAllergies: updatedUser.crystal_allergies ? JSON.parse(updatedUser.crystal_allergies) : [],
      jewelryPreferences: updatedUser.jewelry_preferences ? JSON.parse(updatedUser.jewelry_preferences) : {}
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
