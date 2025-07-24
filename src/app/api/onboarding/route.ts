import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initEnhancedDatabase, updateUserProfile } from '@/lib/database';
import { sendWelcomeEmail } from '@/lib/emailService';

// Complete onboarding process
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const onboardingData = await request.json();
    const {
      // Step 1: Basic Info
      firstName,
      lastName,
      phoneNumber,
      
      // Step 2: Astrology Profile
      birthDate,
      birthTime,
      birthLocation,
      zodiacSign,
      moonSign,
      risingSign,
      
      // Step 3: Spiritual Profile
      meditationExperience,
      spiritualGoals,
      intentionFocus,
      preferredPracticeTime,
      favoriteCrystals,
      
      // Step 4: Jewelry Preferences (for higher tiers)
      ringSize,
      braceletSize,
      necklaceLengthPreference,
      preferredMetals,
      crystalAllergies,
      jewelryStyle,
      
      // Step 5: Shipping (for physical products)
      shippingAddress,
      
      // Step 6: Preferences
      emailNotifications,
      practiceReminders,
      contentPreferences,
      
      // Completion status
      step,
      isComplete
    } = onboardingData;

    const database = await initEnhancedDatabase();
    const userEmail = session.user.email;

    // Get user to check subscription tier
    const user = await database.get('SELECT * FROM users WHERE email = ?', [userEmail]);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare comprehensive update data
    const updateData: Record<string, any> = {
      // Basic info
      first_name: firstName || user.first_name,
      last_name: lastName || user.last_name,
      phone_number: phoneNumber || user.phone_number,
      
      // Astrology
      birth_date: birthDate || user.birth_date,
      birth_time: birthTime || user.birth_time,
      birth_location: birthLocation || user.birth_location,
      zodiac_sign: zodiacSign || user.zodiac_sign,
      moon_sign: moonSign || user.moon_sign,
      rising_sign: risingSign || user.rising_sign,
      
      // Spiritual profile
      meditation_experience: meditationExperience || user.meditation_experience,
      spiritual_goals: spiritualGoals ? JSON.stringify(spiritualGoals) : user.spiritual_goals,
      intention_focus: intentionFocus || user.intention_focus,
      preferred_practice_time: preferredPracticeTime || user.preferred_practice_time,
      favorite_crystals: favoriteCrystals ? JSON.stringify(favoriteCrystals) : user.favorite_crystals,
      
      // Jewelry preferences (for sanctuary/sanctum tiers)
      ring_size: ringSize || user.ring_size,
      bracelet_size: braceletSize || user.bracelet_size,
      necklace_length_preference: necklaceLengthPreference || user.necklace_length_preference,
      preferred_metals: preferredMetals ? JSON.stringify(preferredMetals) : user.preferred_metals,
      crystal_allergies: crystalAllergies ? JSON.stringify(crystalAllergies) : user.crystal_allergies,
      jewelry_style_preferences: jewelryStyle ? JSON.stringify(jewelryStyle) : user.jewelry_style_preferences,
      
      // Shipping
      shipping_address_line1: shippingAddress?.line1 || user.shipping_address_line1,
      shipping_address_line2: shippingAddress?.line2 || user.shipping_address_line2,
      shipping_city: shippingAddress?.city || user.shipping_city,
      shipping_state: shippingAddress?.state || user.shipping_state,
      shipping_postal_code: shippingAddress?.postalCode || user.shipping_postal_code,
      shipping_country: shippingAddress?.country || user.shipping_country || 'US',
      
      // Preferences
      email_notifications: emailNotifications !== undefined ? emailNotifications : user.email_notifications,
      practice_reminders: practiceReminders !== undefined ? practiceReminders : user.practice_reminders,
      content_preferences: contentPreferences ? JSON.stringify(contentPreferences) : user.content_preferences,
      
      // Completion tracking
      onboarding_step: step || user.onboarding_step || 1,
      onboarding_completed: isComplete || false,
      profile_updated_at: new Date().toISOString()
    };

    // Calculate completion percentages
    const basicFields = ['first_name', 'last_name', 'phone_number'];
    const astrologyFields = ['birth_date', 'zodiac_sign', 'moon_sign', 'rising_sign'];
    const spiritualFields = ['meditation_experience', 'spiritual_goals', 'intention_focus', 'preferred_practice_time'];
    const jewelryFields = ['ring_size', 'preferred_metals', 'jewelry_style_preferences'];
    const shippingFields = ['shipping_address_line1', 'shipping_city', 'shipping_state', 'shipping_postal_code'];

    const calculateCompletion = (fields: string[]) => {
      const completed = fields.filter(field => updateData[field] && updateData[field] !== '').length;
      return Math.round((completed / fields.length) * 100);
    };

    updateData.astrology_profile_completed = calculateCompletion(astrologyFields) >= 75;
    updateData.spiritual_profile_completed = calculateCompletion(spiritualFields) >= 75;
    updateData.jewelry_profile_completed = calculateCompletion(jewelryFields) >= 75;
    updateData.shipping_profile_completed = calculateCompletion(shippingFields) >= 100;
    
    const overallCompletion = calculateCompletion([
      ...basicFields,
      ...astrologyFields,
      ...spiritualFields,
      ...(user.subscription_tier !== 'none' ? jewelryFields : []),
      ...(user.subscription_tier !== 'none' ? shippingFields : [])
    ]);
    
    updateData.profile_completion_percentage = overallCompletion;
    updateData.profile_completed = overallCompletion >= 90;

    // Update user profile
    const success = await updateUserProfile(userEmail, updateData);

    if (!success) {
      return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
    }

    // Generate personalized recommendations if astrology is complete
    if (updateData.astrology_profile_completed && zodiacSign) {
      await generateCrystalRecommendations(user.id, zodiacSign, moonSign, risingSign);
      await generateMeditationPath(user.id, zodiacSign, meditationExperience);
    }

    // Track onboarding progress
    await database.run(
      `INSERT INTO user_activity (user_id, login_date, activity_type, activity_data) 
       VALUES (?, CURRENT_TIMESTAMP, 'onboarding_step', ?)`,
      [user.id, JSON.stringify({ step, completion: overallCompletion })]
    );

    // Send personalized welcome email when profile is 100% complete
    if (updateData.profile_completed && !user.welcome_email_sent) {
      try {
        await sendWelcomeEmail(user.email, user.subscription_tier || 'sanctuary');
        await database.run(
          `UPDATE users SET welcome_email_sent = 1 WHERE id = ?`,
          [user.id]
        );
        console.log(`✅ Welcome email sent to ${user.email} after profile completion`);
      } catch (emailError) {
        console.error(`❌ Failed to send welcome email to ${user.email}:`, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      completionPercentage: overallCompletion,
      isProfileComplete: updateData.profile_completed,
      recommendationsGenerated: updateData.astrology_profile_completed,
      welcomeEmailSent: updateData.profile_completed && !user.welcome_email_sent
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get onboarding status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const database = await initEnhancedDatabase();
    const user = await database.get('SELECT * FROM users WHERE email = ?', [session.user.email]);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const onboardingStatus = {
      isComplete: user.onboarding_completed || false,
      currentStep: user.onboarding_step || 1,
      completionPercentage: user.profile_completion_percentage || 0,
      completedSections: {
        basic: !!(user.first_name && user.last_name),
        astrology: user.astrology_profile_completed || false,
        spiritual: user.spiritual_profile_completed || false,
        jewelry: user.jewelry_profile_completed || false,
        shipping: user.shipping_profile_completed || false
      },
      subscriptionTier: user.subscription_tier,
      requiresShipping: user.subscription_tier !== 'none',
      requiresJewelry: ['sanctuary', 'sanctum'].includes(user.subscription_tier)
    };

    return NextResponse.json(onboardingStatus);

  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
async function generateCrystalRecommendations(userId: number, zodiacSign: string, moonSign?: string, risingSign?: string) {
  const database = await initEnhancedDatabase();
  
  const zodiacCrystals: Record<string, string[]> = {
    aries: ['carnelian', 'red jasper', 'hematite', 'clear quartz'],
    taurus: ['rose quartz', 'emerald', 'malachite', 'green aventurine'],
    gemini: ['citrine', 'agate', 'tiger eye', 'clear quartz'],
    cancer: ['moonstone', 'pearl', 'selenite', 'labradorite'],
    leo: ['sunstone', 'amber', 'citrine', 'pyrite'],
    virgo: ['amazonite', 'moss agate', 'peridot', 'sapphire'],
    libra: ['rose quartz', 'lapis lazuli', 'opal', 'lepidolite'],
    scorpio: ['obsidian', 'garnet', 'malachite', 'apache tear'],
    sagittarius: ['turquoise', 'amethyst', 'sodalite', 'lapis lazuli'],
    capricorn: ['garnet', 'black onyx', 'fluorite', 'hematite'],
    aquarius: ['amethyst', 'aquamarine', 'fluorite', 'labradorite'],
    pisces: ['amethyst', 'aquamarine', 'bloodstone', 'fluorite']
  };

  const recommendations = zodiacCrystals[zodiacSign.toLowerCase()] || ['clear quartz', 'amethyst', 'rose quartz'];
  
  for (let i = 0; i < recommendations.length; i++) {
    await database.run(
      `INSERT OR REPLACE INTO crystal_recommendations 
       (user_id, crystal_type, reason, priority_level, created_at) 
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        userId,
        recommendations[i],
        `Recommended for ${zodiacSign} energy alignment`,
        i + 1
      ]
    );
  }
}

async function generateMeditationPath(userId: number, zodiacSign: string, experience: string) {
  const database = await initEnhancedDatabase();
  
  const pathData = {
    zodiac_focus: zodiacSign,
    experience_level: experience,
    recommended_duration: experience === 'beginner' ? 10 : experience === 'intermediate' ? 20 : 30,
    preferred_style: 'guided', // Can be customized based on zodiac
    created_at: new Date().toISOString()
  };

  await database.run(
    `INSERT OR REPLACE INTO user_meditation_paths 
     (user_id, path_data, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`,
    [userId, JSON.stringify(pathData)]
  );
}
