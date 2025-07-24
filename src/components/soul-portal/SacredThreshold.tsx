/**
 * Sacred Threshold Portal - The Gateway to Soul-Centered Experience
 * A revolutionary portal component that attunes to each soul's unique rhythm
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SoulProfile, SpiritualState } from '@/types/soul'

type SacredThresholdProps = {
  soulProfile?: SoulProfile
  onEnterPortal: () => void
  theme?: 'light' | 'dark'
}

export default function SacredThreshold({ soulProfile, onEnterPortal, theme = 'light' }: SacredThresholdProps) {
  const [isAttuning, setIsAttuning] = useState(false)
  const [attunementStage, setAttunementStage] = useState<'greeting' | 'sensing' | 'harmonizing' | 'ready'>('greeting')
  const [spiritualState, setSpiritualState] = useState<SpiritualState | null>(null)

  useEffect(() => {
    if (soulProfile) {
      setSpiritualState(soulProfile.current_spiritual_state)
    }
  }, [soulProfile])

  const beginAttunement = async () => {
    setIsAttuning(true)
    
    // Simulate attunement process
    setTimeout(() => setAttunementStage('sensing'), 1000)
    setTimeout(() => setAttunementStage('harmonizing'), 3000)
    setTimeout(() => setAttunementStage('ready'), 5000)
  }

  const handleEnterPortal = () => {
    setIsAttuning(false)
    setAttunementStage('greeting')
    onEnterPortal()
  }

  const getGreeting = () => {
    if (!soulProfile) return 'Welcome, beautiful soul'
    
    const archetype = soulProfile.primary_archetype
    const greetings = {
      mystic: 'Welcome, seeker of sacred mysteries',
      healer: 'Welcome, keeper of healing light',
      warrior: 'Welcome, brave guardian of truth',
      sage: 'Welcome, bearer of ancient wisdom',
      lover: 'Welcome, heart of infinite compassion',
      creator: 'Welcome, weaver of dreams into reality',
      sovereign: 'Welcome, noble leader of conscious change'
    }
    
    return greetings[archetype] || 'Welcome, radiant soul'
  }

  const getAttunementMessage = () => {
    switch (attunementStage) {
      case 'greeting':
        return getGreeting()
      case 'sensing':
        return 'Sensing your current energy...'
      case 'harmonizing':
        return 'Harmonizing with your soul\'s rhythm...'
      case 'ready':
        return 'Your sacred space awaits'
      default:
        return ''
    }
  }

  const getEnergyVisualization = () => {
    if (!spiritualState) return null

    const { clarity, peace, vitality, connection, purpose } = spiritualState
    const aspects = [
      { name: 'Clarity', value: clarity, color: 'from-blue-400 to-indigo-600' },
      { name: 'Peace', value: peace, color: 'from-green-400 to-emerald-600' },
      { name: 'Vitality', value: vitality, color: 'from-orange-400 to-red-600' },
      { name: 'Connection', value: connection, color: 'from-purple-400 to-violet-600' },
      { name: 'Purpose', value: purpose, color: 'from-yellow-400 to-amber-600' }
    ]

    return (
      <div className="grid grid-cols-5 gap-2 mb-6">
        {aspects.map((aspect, index) => (
          <motion.div
            key={aspect.name}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="relative w-8 h-20 mx-auto mb-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`absolute bottom-0 w-full bg-gradient-to-t ${aspect.color} rounded-full`}
                initial={{ height: 0 }}
                animate={{ height: `${aspect.value * 10}%` }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">{aspect.name}</span>
          </motion.div>
        ))}
      </div>
    )
  }

  const getOptimalPracticeTime = () => {
    if (!soulProfile) return null
    
    const now = new Date()
    const currentHour = now.getHours()
    const optimalHour = parseInt(soulProfile.rhythm_pattern.optimal_practice_time.split(':')[0])
    const isOptimalTime = Math.abs(currentHour - optimalHour) <= 1

    return (
      <div className="mb-4 text-center">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          isOptimalTime 
            ? 'bg-green-100 text-green-800' 
            : 'bg-amber-100 text-amber-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isOptimalTime ? 'bg-green-500' : 'bg-amber-500'
          }`} />
          {isOptimalTime 
            ? 'Optimal practice time ✨' 
            : `Optimal time: ${soulProfile.rhythm_pattern.optimal_practice_time}`
          }
        </div>
      </div>
    )
  }

  const baseTheme = theme === 'dark' 
    ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white'
    : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 text-gray-800'

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${baseTheme}`}>
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {!isAttuning ? (
            <motion.div
              key="portal-entrance"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {/* Sacred Symbol */}
              <motion.div
                className="w-24 h-24 mx-auto mb-8 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20" />
                <div className="absolute inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30" />
                <div className="absolute inset-4 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-40" />
                <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
              </motion.div>

              {/* Greeting */}
              <motion.h1
                className="text-3xl font-dreamy mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {getGreeting()}
              </motion.h1>

              {/* Current Energy State */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {getOptimalPracticeTime()}
                {getEnergyVisualization()}
              </motion.div>

              {/* Soul Archetype Badge */}
              {soulProfile && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-medium capitalize">
                      {soulProfile.primary_archetype} Soul
                    </span>
                    {soulProfile.secondary_archetype && (
                      <span className="text-xs ml-2 opacity-75">
                        · {soulProfile.secondary_archetype}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Enter Portal Button */}
              <motion.button
                onClick={beginAttunement}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter Sacred Portal
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="attunement-process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Attunement Animation */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  className="absolute inset-0 border-4 border-purple-300 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-4 border-4 border-pink-300 rounded-full"
                  animate={{ rotate: -360, scale: [1, 0.9, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-8 border-4 border-blue-300 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="absolute inset-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>

              {/* Attunement Message */}
              <motion.h2
                className="text-2xl font-dreamy mb-4"
                key={attunementStage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {getAttunementMessage()}
              </motion.h2>

              {/* Progress Indicator */}
              <div className="w-full max-w-xs mx-auto mb-8">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: attunementStage === 'greeting' ? '25%' : 
                             attunementStage === 'sensing' ? '50%' : 
                             attunementStage === 'harmonizing' ? '75%' : '100%' 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Ready to Enter */}
              {attunementStage === 'ready' && (
                <motion.button
                  onClick={handleEnterPortal}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enter Your Sacred Space ✨
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
