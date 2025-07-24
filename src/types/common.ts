// FILE: src/types/common.ts
// Shared type definitions for the KALÏANÏA application

// Common theme type used across components
export type Theme = 'light' | 'dark';

// Navigation link structure
export interface NavigationLink {
  name: string;
  href: string;
}

// Portal panel configuration for homepage
export interface PortalPanelProps {
  href: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

// Portfolio card configuration
export interface PortfolioCardData {
  title: string;
  category: string;
  imageUrl: string;
  href: string;
  processNote: string;
}

// Contact form data structure
export interface ContactFormData {
  name: string;
  email: string;
  interest: string;
  message: string;
}

// Contact interest option
export interface ContactInterest {
  value: string;
  label: string;
  description: string;
}

// Subscription tier features
export interface SubscriptionFeature {
  title: string;
  content: string;
}

// Email message structure for local storage
export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  interest: string;
  timestamp: string;
  read: boolean;
}

// Mouse event coordinates for interactive effects
export interface MouseCoordinates {
  x: number;
  y: number;
}

// Generic component props that accept children
export interface WithChildren {
  children: React.ReactNode;
}

// Props for components that accept an optional className
export interface WithClassName {
  className?: string;
}

// Props for components that support theme switching
export interface WithTheme {
  theme?: Theme;
}
