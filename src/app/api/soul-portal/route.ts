/**
 * Soul Portal API - Revolutionary Spiritual Intelligence Endpoints
 * Provides soul-centered services for the spiritual transformation portal
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSoulPortalService } from '@/lib/soul-architecture/SoulPortalService'
import { SoulOracle } from '@/lib/soul-architecture/core/SoulOracle'
import { PracticeCurator } from '@/lib/soul-architecture/guidance/PracticeCurator'
import { RhythmReader } from '@/lib/soul-architecture/rhythm/RhythmReader'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const soulService = getSoulPortalService()
    await soulService.initialize()

    const soulProfile = await soulService.getSoulProfile(userId)
    
    if (!soulProfile) {
      return NextResponse.json({ 
        error: 'Soul profile not found',
        suggestion: 'Create a soul profile first using POST endpoint'
      }, { status: 404 })
    }

    switch (action) {
      case 'guidance':
        const oracle = new SoulOracle(soulProfile)
        const guidance = await oracle.generateGuidance()
        return NextResponse.json({ guidance })

      case 'practice':
        const curator = new PracticeCurator(soulProfile)
        const practice = await curator.curateCurrentPractice()
        return NextResponse.json({ practice })

      case 'rhythm':
        const rhythmReader = new RhythmReader(soulProfile)
        const isOptimalTime = rhythmReader.isOptimalPracticeTime()
        const dayTheme = rhythmReader.getCurrentDayTheme()
        return NextResponse.json({ 
          isOptimalTime,
          dayTheme,
          optimalTime: rhythmReader.getOptimalPracticeTime()
        })

      case 'profile':
        return NextResponse.json({ soulProfile })

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['guidance', 'practice', 'rhythm', 'profile']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Soul Portal API Error:', error)
    return NextResponse.json({ 
      error: 'Internal soul portal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, data } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const soulService = getSoulPortalService()
    await soulService.initialize()

    switch (action) {
      case 'create-profile':
        const { soulAge, primaryArchetype, secondaryArchetype } = data
        
        if (!soulAge || !primaryArchetype) {
          return NextResponse.json({ 
            error: 'Soul age and primary archetype required'
          }, { status: 400 })
        }

        // Check if profile already exists
        const existingProfile = await soulService.getSoulProfile(userId)
        if (existingProfile) {
          return NextResponse.json({ 
            error: 'Soul profile already exists',
            profile: existingProfile
          }, { status: 409 })
        }

        const newProfile = await soulService.createInitialSoulProfile(
          userId, 
          soulAge, 
          primaryArchetype, 
          secondaryArchetype
        )

        return NextResponse.json({ 
          message: 'Soul profile created successfully',
          profile: newProfile
        })

      case 'record-moment':
        const soulDb = soulService.getSoulDatabase()
        const soulProfile = await soulService.getSoulProfile(userId)
        
        if (!soulProfile) {
          return NextResponse.json({ error: 'Soul profile not found' }, { status: 404 })
        }

        const moment = await soulDb.recordSacredMoment({
          soul_id: soulProfile.id,
          type: data.type,
          essence: data.essence,
          context: data.context,
          emotional_landscape: data.emotional_landscape,
          transformation_seeds: data.transformation_seeds || [],
          moon_phase: data.moon_phase,
          energy_signature: data.energy_signature
        })

        return NextResponse.json({ 
          message: 'Sacred moment recorded',
          moment
        })

      case 'update-spiritual-state':
        const soulDb2 = soulService.getSoulDatabase()
        const soulProfile2 = await soulService.getSoulProfile(userId)
        
        if (!soulProfile2) {
          return NextResponse.json({ error: 'Soul profile not found' }, { status: 404 })
        }

        const newState = await soulDb2.recordSpiritualState(soulProfile2.id, {
          clarity: data.clarity,
          peace: data.peace,
          vitality: data.vitality,
          connection: data.connection,
          purpose: data.purpose
        })

        return NextResponse.json({ 
          message: 'Spiritual state updated',
          state: newState
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['create-profile', 'record-moment', 'update-spiritual-state']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Soul Portal API Error:', error)
    return NextResponse.json({ 
      error: 'Internal soul portal error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
