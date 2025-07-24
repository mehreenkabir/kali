/**
 * Soul Architecture Initialization Script
 * Sets up the revolutionary soul-centered database and services
 */

import { getSoulPortalService } from '@/lib/soul-architecture/SoulPortalService'
import { migrateSoulDatabase } from '@/lib/database/soul-migrations/001-create-soul-tables'

export async function initializeSoulArchitecture() {
  try {
    console.log('🌟 Initializing Soul Architecture...')
    
    // Get the database path
    const dbPath = process.env.NODE_ENV === 'production' 
      ? './soul-database.sqlite'
      : './soul-database-dev.sqlite'
    
    // Run database migrations
    console.log('📊 Running soul database migrations...')
    await migrateSoulDatabase(dbPath)
    
    // Initialize the soul portal service
    console.log('🚪 Initializing Soul Portal Service...')
    const soulService = getSoulPortalService()
    await soulService.initialize()
    
    console.log('✨ Soul Architecture initialized successfully!')
    console.log('🎯 Ready to track spiritual transformation at the soul level')
    
    return true
  } catch (error) {
    console.error('❌ Failed to initialize Soul Architecture:', error)
    return false
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeSoulArchitecture()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
