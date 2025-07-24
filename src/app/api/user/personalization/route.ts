/**
 * Enhanced User Personalization API
 * Handles complete soul portal customization and preferences
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { initEnhancedDatabase, updateUserProfile, generateCrystalRecommendations } from '@/lib/database'

// Save complete user personalization data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const personalizationData = await request.json()
    const userEmail = session.user.email

    const database = await initEnhancedDatabase()
    
    // Get user ID for related operations
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user profile with personalization data
    const success = await updateUserProfile(userEmail, personalizationData)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Generate crystal recommendations if zodiac sign is provided
    if (personalizationData.zodiac_sign) {
      await generateCrystalRecommendations(user.id, personalizationData.zodiac_sign)
    }

    // Save to preferences history for tracking changes
    for (const [field, value] of Object.entries(personalizationData)) {
      if (value !== undefined && value !== null) {
        await database.run(`
          INSERT INTO user_preferences_history (user_id, field_name, new_value)
          VALUES (?, ?, ?)
        `, [user.id, field, typeof value === 'object' ? JSON.stringify(value) : String(value)])
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Personalization saved successfully',
      crystallRecommendationsGenerated: !!personalizationData.zodiac_sign
    })

  } catch (error) {
    console.error('Error saving personalization:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get complete user personalization data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = await initEnhancedDatabase()
    const userEmail = session.user.email

    // Get complete user profile
    const user = await database.get('SELECT * FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get crystal recommendations
    const crystalRecommendations = await database.all(`
      SELECT cr.*, cd.description, cd.healing_properties, cd.metaphysical_properties
      FROM crystal_recommendations cr
      LEFT JOIN crystals_database cd ON cr.crystal_type = cd.name
      WHERE cr.user_id = ?
      ORDER BY cr.priority_level ASC, cr.created_at DESC
    `, [user.id])

    // Get jewelry orders
    const jewelryOrders = await database.all(`
      SELECT * FROM jewelry_orders WHERE user_id = ? ORDER BY order_date DESC LIMIT 10
    `, [user.id])

    // Get preferences history
    const preferencesHistory = await database.all(`
      SELECT field_name, new_value, changed_at FROM user_preferences_history 
      WHERE user_id = ? ORDER BY changed_at DESC LIMIT 50
    `, [user.id])

    // Calculate profile completion percentage
    const profileFields = [
      'birth_date', 'birth_time', 'birth_location', 'zodiac_sign', 'moon_sign', 'rising_sign',
      'favorite_crystals', 'spiritual_goals', 'meditation_experience', 'shipping_address',
      'shipping_city', 'shipping_state', 'shipping_zip', 'phone_number'
    ]
    
    const completedFields = profileFields.filter(field => user[field] && user[field] !== '').length
    const profileCompletionPercentage = Math.round((completedFields / profileFields.length) * 100)

    // Remove sensitive data
    const { password, stripe_customer_id, stripe_subscription_id, ...safeUserData } = user

    return NextResponse.json({
      user: safeUserData,
      profileCompletionPercentage,
      crystalRecommendations,
      jewelryOrders,
      preferencesHistory: preferencesHistory.slice(0, 10), // Latest 10 changes
      personalizedData: {
        hasAstrologicalProfile: !!(user.zodiac_sign && user.moon_sign && user.rising_sign),
        hasShippingInfo: !!(user.shipping_address && user.shipping_city && user.shipping_state),
        hasSpirtualGoals: !!user.spiritual_goals,
        favoriteColors: user.favorite_colors ? JSON.parse(user.favorite_colors) : [],
        jewelryStyles: user.jewelry_style_preferences ? JSON.parse(user.jewelry_style_preferences) : [],
        crystalTypes: user.favorite_crystals ? JSON.parse(user.favorite_crystals) : []
      }
    })

  } catch (error) {
    console.error('Error getting personalization data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update specific personalization fields
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { field, value } = await request.json()
    const userEmail = session.user.email

    if (!field) {
      return NextResponse.json({ error: 'Field name required' }, { status: 400 })
    }

    const database = await initEnhancedDatabase()
    
    // Get user for history tracking
    const user = await database.get('SELECT id FROM users WHERE email = ?', [userEmail])
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update specific field
    const success = await updateUserProfile(userEmail, { [field]: value })
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update field' }, { status: 500 })
    }

    // Track change in preferences history
    await database.run(`
      INSERT INTO user_preferences_history (user_id, field_name, new_value)
      VALUES (?, ?, ?)
    `, [user.id, field, typeof value === 'object' ? JSON.stringify(value) : String(value)])

    return NextResponse.json({ 
      success: true, 
      message: `${field} updated successfully`
    })

  } catch (error) {
    console.error('Error updating personalization field:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
