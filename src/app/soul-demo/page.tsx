/**
 * Soul Architecture Demo - Showcasing Revolutionary Spiritual Technology
 * This page demonstrates the soul-centered portal in action
 */

'use client'

import { useState, useEffect } from 'react'
import SacredThreshold from '@/components/soul-portal/SacredThreshold'
import { SoulProfile, SoulAge, SoulArchetype } from '@/types/soul'

type SoulCreationStep = 'welcome' | 'archetype' | 'soul-age' | 'creating' | 'portal'

export default function SoulArchitectureDemo() {
  const [step, setStep] = useState<SoulCreationStep>('welcome')
  const [selectedArchetype, setSelectedArchetype] = useState<SoulArchetype | null>(null)
  const [selectedSoulAge, setSelectedSoulAge] = useState<SoulAge | null>(null)
  const [soulProfile, setSoulProfile] = useState<SoulProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo user ID - in real app would come from authentication
  const demoUserId = 'demo-user-123'

  useEffect(() => {
    // Check if demo user already has a soul profile
    checkExistingSoulProfile()
  }, [])

  const checkExistingSoulProfile = async () => {
    try {
      const response = await fetch(`/api/soul-portal?action=profile&userId=${demoUserId}`)
      const data = await response.json()
      
      if (response.ok && data.soulProfile) {
        setSoulProfile(data.soulProfile)
        setStep('portal')
      }
    } catch (error) {
      console.log('No existing soul profile found, starting creation flow')
    }
  }

  const createSoulProfile = async () => {
    if (!selectedArchetype || !selectedSoulAge) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/soul-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-profile',
          userId: demoUserId,
          data: {
            soulAge: selectedSoulAge,
            primaryArchetype: selectedArchetype
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSoulProfile(data.profile)
        setStep('portal')
      } else {
        setError(data.error || 'Failed to create soul profile')
      }
    } catch (error) {
      setError('Failed to connect to soul portal service')
    } finally {
      setIsLoading(false)
    }
  }

  const archetypes = [
    { 
      value: 'mystic' as SoulArchetype, 
      name: 'Mystic', 
      description: 'Seeker of sacred mysteries and divine connection',
      emoji: '🌟'
    },
    { 
      value: 'healer' as SoulArchetype, 
      name: 'Healer', 
      description: 'Channel of restoration and compassionate energy',
      emoji: '💚'
    },
    { 
      value: 'warrior' as SoulArchetype, 
      name: 'Warrior', 
      description: 'Protector of truth and guardian of sacred boundaries',
      emoji: '⚔️'
    },
    { 
      value: 'sage' as SoulArchetype, 
      name: 'Sage', 
      description: 'Keeper of ancient wisdom and guide of others',
      emoji: '📚'
    },
    { 
      value: 'lover' as SoulArchetype, 
      name: 'Lover', 
      description: 'Embodiment of compassion and heart-centered connection',
      emoji: '💕'
    },
    { 
      value: 'creator' as SoulArchetype, 
      name: 'Creator', 
      description: 'Manifestor of beauty and weaver of dreams into reality',
      emoji: '🎨'
    },
    { 
      value: 'sovereign' as SoulArchetype, 
      name: 'Sovereign', 
      description: 'Leader of conscious change and noble guide',
      emoji: '👑'
    }
  ]

  const soulAges = [
    { 
      value: 'infant' as SoulAge, 
      name: 'Infant Soul', 
      description: 'New to spiritual growth, just beginning the journey'
    },
    { 
      value: 'baby' as SoulAge, 
      name: 'Baby Soul', 
      description: 'Starting to explore spiritual concepts and practices'
    },
    { 
      value: 'young' as SoulAge, 
      name: 'Young Soul', 
      description: 'Actively learning and experimenting with spiritual growth'
    },
    { 
      value: 'mature' as SoulAge, 
      name: 'Mature Soul', 
      description: 'Integrating wisdom and deepening spiritual understanding'
    },
    { 
      value: 'old' as SoulAge, 
      name: 'Old Soul', 
      description: 'Teaching others and embodying deep spiritual wisdom'
    }
  ]

  if (step === 'portal' && soulProfile) {
    return (
      <SacredThreshold
        soulProfile={soulProfile}
        onEnterPortal={() => {
          // In real app, would navigate to the actual portal
          alert('Welcome to your Soul-Centered Portal! 🌟\n\nThis is where the revolutionary spiritual transformation experience would begin.')
        }}
        theme="dark"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-dreamy mb-4">Soul Architecture Demo</h1>
          <p className="text-xl opacity-80">
            Experience the revolutionary spiritual transformation technology
          </p>
        </div>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl">
                ✨
              </div>
              <h2 className="text-3xl font-dreamy mb-4">Welcome to the Future of Spiritual Growth</h2>
              <p className="text-lg mb-6 leading-relaxed">
                This soul-centered architecture tracks <em>who you're becoming</em>, not just what you did. 
                It creates a living, breathing spiritual companion that grows with you.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8 text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl mb-2">🧠</div>
                  <h3 className="font-semibold mb-2">Soul Intelligence</h3>
                  <p>AI that understands your spiritual archetype and soul age</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl mb-2">🔄</div>
                  <h3 className="font-semibold mb-2">Rhythm Attunement</h3>
                  <p>Adapts to your natural spiritual rhythms and energy cycles</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl mb-2">🌱</div>
                  <h3 className="font-semibold mb-2">Living Wisdom</h3>
                  <p>Tracks insights that grow and evolve over time</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep('archetype')}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium hover:scale-105 transition-transform"
            >
              Begin Soul Profile Creation
            </button>
          </div>
        )}

        {/* Archetype Selection */}
        {step === 'archetype' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-dreamy mb-4">Choose Your Soul Archetype</h2>
              <p className="text-lg opacity-80">
                Which spiritual archetype resonates most deeply with your essence?
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {archetypes.map((archetype) => (
                <button
                  key={archetype.value}
                  onClick={() => setSelectedArchetype(archetype.value)}
                  className={`p-6 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                    selectedArchetype === archetype.value
                      ? 'border-purple-400 bg-purple-400/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="text-3xl mb-3">{archetype.emoji}</div>
                  <h3 className="text-xl font-semibold mb-2">{archetype.name}</h3>
                  <p className="text-sm opacity-80">{archetype.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('soul-age')}
                disabled={!selectedArchetype}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                Continue to Soul Age
              </button>
            </div>
          </div>
        )}

        {/* Soul Age Selection */}
        {step === 'soul-age' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-dreamy mb-4">What is Your Soul Age?</h2>
              <p className="text-lg opacity-80">
                Where are you in your spiritual development journey?
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {soulAges.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setSelectedSoulAge(age.value)}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                    selectedSoulAge === age.value
                      ? 'border-purple-400 bg-purple-400/20'
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{age.name}</h3>
                  <p className="text-sm opacity-80">{age.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center space-x-4">
              <button
                onClick={() => setStep('archetype')}
                className="px-6 py-3 border border-white/40 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Back
              </button>
              <button
                onClick={createSoulProfile}
                disabled={!selectedSoulAge || isLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                {isLoading ? 'Creating Soul Profile...' : 'Create Soul Profile'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-center">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
