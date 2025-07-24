// FILE: src/lib/database.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcryptjs';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

// Enhanced User interface with customization fields
export interface EnhancedUser {
  id: number;
  email: string;
  password?: string;
  name: string;
  subscription_tier: 'none' | 'sanctuary' | 'sanctum';
  subscription_status: 'active' | 'inactive' | 'pending' | 'canceled' | 'past_due';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_period_end?: string;
  
  // Personal & Astrological Information
  birth_date?: string;
  birth_time?: string;
  birth_location?: string;
  zodiac_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  
  // Spiritual Preferences
  favorite_crystals?: string; // JSON array
  spiritual_goals?: string; // JSON array
  meditation_experience?: 'beginner' | 'intermediate' | 'advanced';
  preferred_practice_time?: 'morning' | 'afternoon' | 'evening' | 'night';
  intention_focus?: string;
  
  // Shipping Information
  shipping_first_name?: string;
  shipping_last_name?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  phone_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  // Jewelry Preferences
  preferred_metals?: string; // JSON array
  ring_size?: string;
  bracelet_size?: string;
  necklace_length_preference?: string;
  crystal_allergies?: string; // JSON array
  jewelry_preferences?: string; // JSON object
  
  // Profile Status
  profile_completed?: boolean;
  address_verified?: boolean;
  astrology_profile_completed?: boolean;
  jewelry_profile_completed?: boolean;
  profile_updated_at?: string;
  
  created_at: string;
  updated_at: string;
}

// Initialize enhanced database with all customization tables
export async function initEnhancedDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (db) return db;

  db = await open({
    filename: './data/portfolio.db',
    driver: sqlite3.Database
  });

  // Create enhanced users table with all customization fields
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      subscription_tier TEXT DEFAULT 'none',
      subscription_status TEXT DEFAULT 'inactive',
      stripe_customer_id TEXT UNIQUE,
      stripe_subscription_id TEXT,
      subscription_period_end DATETIME,
      
      birth_date TEXT,
      birth_time TEXT,
      birth_location TEXT,
      zodiac_sign TEXT,
      moon_sign TEXT,
      rising_sign TEXT,
      
      favorite_crystals TEXT,
      spiritual_goals TEXT,
      meditation_experience TEXT,
      preferred_practice_time TEXT,
      intention_focus TEXT,
      
      shipping_first_name TEXT,
      shipping_last_name TEXT,
      shipping_address_line1 TEXT,
      shipping_address_line2 TEXT,
      shipping_city TEXT,
      shipping_state TEXT,
      shipping_postal_code TEXT,
      shipping_country TEXT DEFAULT 'US',
      phone_number TEXT,
      emergency_contact_name TEXT,
      emergency_contact_phone TEXT,
      
      preferred_metals TEXT,
      ring_size TEXT,
      bracelet_size TEXT,
      necklace_length_preference TEXT,
      crystal_allergies TEXT,
      jewelry_preferences TEXT,
      
      profile_completed BOOLEAN DEFAULT FALSE,
      address_verified BOOLEAN DEFAULT FALSE,
      astrology_profile_completed BOOLEAN DEFAULT FALSE,
      jewelry_profile_completed BOOLEAN DEFAULT FALSE,
      profile_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create jewelry orders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS jewelry_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      order_external_id TEXT,
      crystal_type TEXT NOT NULL,
      jewelry_type TEXT NOT NULL,
      metal_type TEXT NOT NULL,
      size_info TEXT,
      order_status TEXT DEFAULT 'pending',
      wholesale_cost DECIMAL(10,2),
      retail_price DECIMAL(10,2),
      moon_phase TEXT,
      intention_theme TEXT,
      personalization_note TEXT,
      tracking_number TEXT,
      estimated_delivery_date DATETIME,
      actual_delivery_date DATETIME,
      customer_satisfaction_rating INTEGER,
      customer_feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create crystal recommendations table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS crystal_recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      crystal_type TEXT NOT NULL,
      recommendation_reason TEXT,
      recommended_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_ordered BOOLEAN DEFAULT FALSE,
      order_id INTEGER,
      priority_level INTEGER DEFAULT 1,
      seasonal_relevance TEXT,
      astrological_relevance TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (order_id) REFERENCES jewelry_orders (id) ON DELETE SET NULL
    )
  `);

  // Create crystals database
  await db.exec(`
    CREATE TABLE IF NOT EXISTS crystals_database (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      metaphysical_properties TEXT,
      zodiac_associations TEXT,
      chakra_associations TEXT,
      healing_properties TEXT,
      color TEXT,
      hardness_scale DECIMAL(2,1),
      element TEXT,
      planet_association TEXT,
      best_for TEXT,
      care_instructions TEXT,
      wholesale_availability BOOLEAN DEFAULT TRUE,
      average_wholesale_cost DECIMAL(10,2),
      description TEXT
    )
  `);

  // Create user preferences history
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      field_name TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Insert sample crystals if table is empty
  const crystalCount = await db.get('SELECT COUNT(*) as count FROM crystals_database');
  if (crystalCount && crystalCount.count === 0) {
    await db.run(`
      INSERT INTO crystals_database (name, metaphysical_properties, zodiac_associations, chakra_associations, healing_properties, color, hardness_scale, element, planet_association, best_for, care_instructions, average_wholesale_cost, description) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Amethyst',
      '["spiritual protection", "clarity", "intuition"]',
      '["Pisces", "Virgo", "Aquarius", "Capricorn"]',
      '["Crown", "Third Eye"]',
      '["stress relief", "insomnia", "addiction recovery"]',
      'Purple',
      7.0,
      'Air',
      'Jupiter',
      '["meditation", "spiritual growth", "protection"]',
      'Cleanse with moonlight, avoid direct sunlight',
      15.00,
      'A powerful protective stone that enhances spiritual awareness and psychic abilities.'
    ]);

    await db.run(`
      INSERT INTO crystals_database (name, metaphysical_properties, zodiac_associations, chakra_associations, healing_properties, color, hardness_scale, element, planet_association, best_for, care_instructions, average_wholesale_cost, description) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Rose Quartz',
      '["unconditional love", "emotional healing", "self-compassion"]',
      '["Taurus", "Libra"]',
      '["Heart"]',
      '["emotional trauma", "relationship healing", "self-love"]',
      'Pink',
      7.0,
      'Water',
      'Venus',
      '["love", "relationships", "emotional healing"]',
      'Cleanse with running water, charge with rose petals',
      12.00,
      'The stone of unconditional love, promoting deep emotional healing and self-acceptance.'
    ]);

    await db.run(`
      INSERT INTO crystals_database (name, metaphysical_properties, zodiac_associations, chakra_associations, healing_properties, color, hardness_scale, element, planet_association, best_for, care_instructions, average_wholesale_cost, description) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Clear Quartz',
      '["amplification", "clarity", "purification"]',
      '["All signs"]',
      '["All chakras"]',
      '["energy amplification", "mental clarity", "spiritual growth"]',
      'Clear',
      7.0,
      'All elements',
      'Sun',
      '["meditation", "manifestation", "healing"]',
      'Cleanse with any method, very durable',
      8.00,
      'The master healer that amplifies energy and intention, perfect for any spiritual practice.'
    ]);

    await db.run(`
      INSERT INTO crystals_database (name, metaphysical_properties, zodiac_associations, chakra_associations, healing_properties, color, hardness_scale, element, planet_association, best_for, care_instructions, average_wholesale_cost, description) VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Black Tourmaline',
      '["protection", "grounding", "electromagnetic field protection"]',
      '["Scorpio", "Capricorn"]',
      '["Root"]',
      '["anxiety relief", "grounding", "protection from negativity"]',
      'Black',
      7.5,
      'Earth',
      'Saturn',
      '["protection", "grounding", "energy clearing"]',
      'Cleanse with sage or palo santo',
      18.00,
      'A powerful protective stone that shields against negative energy and electromagnetic radiation.'
    ]);
  }

  // Create mood entries table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      mood TEXT NOT NULL,
      intensity INTEGER NOT NULL CHECK(intensity >= 1 AND intensity <= 10),
      note TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE CASCADE
    )
  `);

  // Create journal entries table  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT, -- JSON array of tags
      timestamp TEXT NOT NULL,
      FOREIGN KEY (user_email) REFERENCES users (email) ON DELETE CASCADE
    )
  `);

  // Create user activity tracking table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      login_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      session_count INTEGER DEFAULT 1,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_email, date(timestamp));
    CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_email, timestamp);
    CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, date(login_date));
    CREATE INDEX IF NOT EXISTS idx_crystal_recommendations_user ON crystal_recommendations(user_id);
    CREATE INDEX IF NOT EXISTS idx_jewelry_orders_user ON jewelry_orders(user_id);
  `);

  return db;
}

// Basic authentication functions for NextAuth
export async function getUserByEmailWithPassword(email: string): Promise<EnhancedUser | null> {
  const database = await initEnhancedDatabase();
  const user = await database.get<EnhancedUser>(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return user || null;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function getUserByEmail(email: string): Promise<EnhancedUser | null> {
  const database = await initEnhancedDatabase();
  const user = await database.get<EnhancedUser>(
    `SELECT id, email, name, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, subscription_period_end, created_at, updated_at FROM users WHERE email = ?`,
    [email]
  );
  return user || null;
}

export async function createUser(email: string, password: string, name: string): Promise<EnhancedUser | null> {
  const database = await initEnhancedDatabase();
  
  // Check if user already exists
  const existingUser = await database.get(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  );
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Insert new user
  const result = await database.run(
    `INSERT INTO users (email, password, name, subscription_tier, subscription_status) 
     VALUES (?, ?, ?, 'none', 'inactive')`,
    [email, hashedPassword, name]
  );
  
  if (result.lastID) {
    return await getUserByEmail(email);
  }
  
  return null;
}

// Get enhanced user profile by email
export async function getEnhancedUserByEmail(email: string): Promise<EnhancedUser | null> {
  const database = await initEnhancedDatabase();
  const user = await database.get<EnhancedUser>(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return user || null;
}

// Update user profile with customization data
export async function updateUserProfile(email: string, profileData: any): Promise<boolean> {
  try {
    const database = await initEnhancedDatabase();
    
    // Build dynamic update query
    const fields = Object.keys(profileData).filter(key => profileData[key] !== undefined);
    if (fields.length === 0) return false;
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => profileData[field]);
    
    const result = await database.run(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE email = ?`,
      [...values, email]
    );
    
    return (result.changes ?? 0) > 0;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Generate crystal recommendations based on astrology
export async function generateCrystalRecommendations(userId: number, zodiacSign: string): Promise<void> {
  try {
    const database = await initEnhancedDatabase();
    
    // Get crystals associated with the zodiac sign
    const crystals = await database.all(
      'SELECT * FROM crystals_database WHERE zodiac_associations LIKE ?',
      [`%"${zodiacSign}"%`]
    );

    // Clear existing recommendations
    await database.run('DELETE FROM crystal_recommendations WHERE user_id = ?', [userId]);

    // Add new recommendations
    for (const crystal of crystals) {
      await database.run(`
        INSERT INTO crystal_recommendations 
        (user_id, crystal_type, recommendation_reason, priority_level, astrological_relevance)
        VALUES (?, ?, ?, ?, ?)
      `, [
        userId,
        crystal.name,
        `Recommended for ${zodiacSign} sun sign`,
        Math.floor(Math.random() * 3) + 1,
        zodiacSign
      ]);
    }
  } catch (error) {
    console.error('Error generating crystal recommendations:', error);
  }
}

// Update user subscription data
export async function updateUserSubscription(email: string, subscriptionData: any): Promise<boolean> {
  try {
    const database = await initEnhancedDatabase();
    
    const result = await database.run(
      `UPDATE users SET 
         subscription_tier = ?, 
         subscription_status = ?, 
         stripe_customer_id = ?, 
         stripe_subscription_id = ?, 
         subscription_period_end = ?,
         subscription_start_date = COALESCE(subscription_start_date, CURRENT_TIMESTAMP),
         updated_at = CURRENT_TIMESTAMP 
       WHERE email = ?`,
      [
        subscriptionData.subscription_tier,
        subscriptionData.subscription_status,
        subscriptionData.stripe_customer_id,
        subscriptionData.stripe_subscription_id,
        subscriptionData.subscription_period_end,
        email
      ]
    );
    
    return (result.changes ?? 0) > 0;
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return false;
  }
}

// Update user Stripe data
export async function updateUserStripeData(email: string, stripeData: any): Promise<boolean> {
  try {
    const database = await initEnhancedDatabase();
    
    const result = await database.run(
      `UPDATE users SET 
         stripe_customer_id = ?, 
         stripe_subscription_id = ?, 
         updated_at = CURRENT_TIMESTAMP 
       WHERE email = ?`,
      [stripeData.stripe_customer_id, stripeData.stripe_subscription_id, email]
    );
    
    return (result.changes ?? 0) > 0;
  } catch (error) {
    console.error('Error updating user Stripe data:', error);
    return false;
  }
}

// Get user by Stripe subscription ID
export async function getUserByStripeSubscriptionId(subscriptionId: string): Promise<EnhancedUser | null> {
  try {
    const database = await initEnhancedDatabase();
    const user = await database.get<EnhancedUser>(
      `SELECT * FROM users WHERE stripe_subscription_id = ?`,
      [subscriptionId]
    );
    return user || null;
  } catch (error) {
    console.error('Error getting user by Stripe subscription ID:', error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<EnhancedUser | null> {
  try {
    const database = await initEnhancedDatabase();
    const user = await database.get<EnhancedUser>(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    return user || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Close database connection
export async function closeDatabaseConnection(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
