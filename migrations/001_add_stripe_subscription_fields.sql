-- FILE: migrations/001_add_stripe_subscription_fields.sql
-- Database Migration: Add Stripe subscription tracking fields to Users table
-- This migration adds the necessary columns to link users with their Stripe subscription data

-- Add Stripe Customer ID to link user with Stripe billing information
-- Note: SQLite doesn't support adding UNIQUE constraint to existing table, we'll handle uniqueness in app
ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);

-- Add Stripe Subscription ID to track active subscription
ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255);

-- Add subscription period end timestamp for access control
ALTER TABLE users ADD COLUMN subscription_period_end DATETIME;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
