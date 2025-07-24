-- Migration: Add user customization and shipping fields
-- File: migrations/002_add_user_customization_fields.sql

-- Add user preferences and customization fields
ALTER TABLE users ADD COLUMN birth_date TEXT;
ALTER TABLE users ADD COLUMN birth_time TEXT;
ALTER TABLE users ADD COLUMN birth_location TEXT;
ALTER TABLE users ADD COLUMN favorite_crystals TEXT; -- JSON array of crystals
ALTER TABLE users ADD COLUMN spiritual_goals TEXT; -- JSON array of goals
ALTER TABLE users ADD COLUMN meditation_experience TEXT; -- beginner, intermediate, advanced
ALTER TABLE users ADD COLUMN preferred_practice_time TEXT; -- morning, afternoon, evening
ALTER TABLE users ADD COLUMN intention_focus TEXT; -- healing, manifestation, protection, etc.
ALTER TABLE users ADD COLUMN moon_sign TEXT;
ALTER TABLE users ADD COLUMN rising_sign TEXT;
ALTER TABLE users ADD COLUMN zodiac_sign TEXT;

-- Add shipping and contact information
ALTER TABLE users ADD COLUMN shipping_first_name TEXT;
ALTER TABLE users ADD COLUMN shipping_last_name TEXT;
ALTER TABLE users ADD COLUMN shipping_address_line1 TEXT;
ALTER TABLE users ADD COLUMN shipping_address_line2 TEXT;
ALTER TABLE users ADD COLUMN shipping_city TEXT;
ALTER TABLE users ADD COLUMN shipping_state TEXT;
ALTER TABLE users ADD COLUMN shipping_postal_code TEXT;
ALTER TABLE users ADD COLUMN shipping_country TEXT DEFAULT 'US';
ALTER TABLE users ADD COLUMN phone_number TEXT;
ALTER TABLE users ADD COLUMN emergency_contact_name TEXT;
ALTER TABLE users ADD COLUMN emergency_contact_phone TEXT;

-- Add jewelry and customization preferences
ALTER TABLE users ADD COLUMN jewelry_preferences TEXT; -- JSON: sizes, metals, styles
ALTER TABLE users ADD COLUMN crystal_allergies TEXT; -- JSON array of crystals to avoid
ALTER TABLE users ADD COLUMN preferred_metals TEXT; -- JSON: gold, silver, copper, etc.
ALTER TABLE users ADD COLUMN ring_size TEXT;
ALTER TABLE users ADD COLUMN bracelet_size TEXT;
ALTER TABLE users ADD COLUMN necklace_length_preference TEXT;

-- Add profile completion and verification
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN address_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN astrology_profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN jewelry_profile_completed BOOLEAN DEFAULT FALSE;

-- Add timestamps for tracking
ALTER TABLE users ADD COLUMN profile_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN last_jewelry_order_date DATETIME;
ALTER TABLE users ADD COLUMN next_recommended_order_date DATETIME;

-- Create indexes for better performance
CREATE INDEX idx_users_profile_completed ON users(profile_completed);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_next_order_date ON users(next_recommended_order_date);

-- Create jewelry orders table for tracking automated fulfillment
CREATE TABLE jewelry_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_external_id TEXT, -- ID from wholesale retailer
    crystal_type TEXT NOT NULL,
    jewelry_type TEXT NOT NULL, -- ring, bracelet, necklace, earrings
    metal_type TEXT NOT NULL,
    size_info TEXT, -- ring size, bracelet size, etc.
    order_status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    wholesale_cost DECIMAL(10,2),
    retail_price DECIMAL(10,2),
    moon_phase TEXT, -- new, waxing, full, waning
    intention_theme TEXT, -- healing, manifestation, protection
    personalization_note TEXT,
    tracking_number TEXT,
    estimated_delivery_date DATETIME,
    actual_delivery_date DATETIME,
    customer_satisfaction_rating INTEGER, -- 1-5 stars
    customer_feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for jewelry orders
CREATE INDEX idx_jewelry_orders_user_id ON jewelry_orders(user_id);
CREATE INDEX idx_jewelry_orders_status ON jewelry_orders(order_status);
CREATE INDEX idx_jewelry_orders_created_at ON jewelry_orders(created_at);

-- Create crystal recommendations table
CREATE TABLE crystal_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    crystal_type TEXT NOT NULL,
    recommendation_reason TEXT, -- based on astrology, mood, goals
    recommended_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_ordered BOOLEAN DEFAULT FALSE,
    order_id INTEGER,
    priority_level INTEGER DEFAULT 1, -- 1-5, higher is more important
    seasonal_relevance TEXT, -- spring, summer, autumn, winter
    astrological_relevance TEXT, -- mercury retrograde, full moon, etc.
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES jewelry_orders (id) ON DELETE SET NULL
);

-- Create user preferences history for tracking changes
CREATE TABLE user_preferences_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Add some sample crystal data for recommendations
CREATE TABLE crystals_database (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    metaphysical_properties TEXT, -- JSON array
    zodiac_associations TEXT, -- JSON array
    chakra_associations TEXT, -- JSON array
    healing_properties TEXT, -- JSON array
    color TEXT,
    hardness_scale DECIMAL(2,1), -- Mohs scale
    element TEXT, -- earth, air, fire, water
    planet_association TEXT,
    best_for TEXT, -- JSON array: meditation, protection, love, etc.
    care_instructions TEXT,
    wholesale_availability BOOLEAN DEFAULT TRUE,
    average_wholesale_cost DECIMAL(10,2),
    description TEXT
);

-- Insert some sample crystals
INSERT INTO crystals_database (name, metaphysical_properties, zodiac_associations, chakra_associations, healing_properties, color, hardness_scale, element, planet_association, best_for, care_instructions, average_wholesale_cost, description) VALUES
('Amethyst', '["spiritual protection", "clarity", "intuition"]', '["Pisces", "Virgo", "Aquarius", "Capricorn"]', '["Crown", "Third Eye"]', '["stress relief", "insomnia", "addiction recovery"]', 'Purple', 7.0, 'Air', 'Jupiter', '["meditation", "spiritual growth", "protection"]', 'Cleanse with moonlight, avoid direct sunlight', 15.00, 'A powerful protective stone that enhances spiritual awareness and psychic abilities.'),
('Rose Quartz', '["unconditional love", "emotional healing", "self-compassion"]', '["Taurus", "Libra"]', '["Heart"]', '["emotional trauma", "relationship healing", "self-love"]', 'Pink', 7.0, 'Water', 'Venus', '["love", "relationships", "emotional healing"]', 'Cleanse with running water, charge with rose petals', 12.00, 'The stone of unconditional love, promoting deep emotional healing and self-acceptance.'),
('Clear Quartz', '["amplification", "clarity", "purification"]', '["All signs"]', '["All chakras"]', '["energy amplification", "mental clarity", "spiritual growth"]', 'Clear', 7.0, 'All elements', 'Sun', '["meditation", "manifestation", "healing"]', 'Cleanse with any method, very durable', 8.00, 'The master healer that amplifies energy and intention, perfect for any spiritual practice.'),
('Black Tourmaline', '["protection", "grounding", "electromagnetic field protection"]', '["Scorpio", "Capricorn"]', '["Root"]', '["anxiety relief", "grounding", "protection from negativity"]', 'Black', 7.5, 'Earth', 'Saturn', '["protection", "grounding", "energy clearing"]', 'Cleanse with sage or palo santo', 18.00, 'A powerful protective stone that shields against negative energy and electromagnetic radiation.');
