// FILE: src/utils/constants.ts
// Application-wide constants and configuration

// Navigation links used across the application
export const NAVIGATION_LINKS = [
  { name: 'ART', href: '/art' },
  { name: 'MATH', href: '/math' },
  { name: 'YOGA', href: '/yoga' },
  { name: 'PORTAL', href: '/portal' },
] as const;

// Portal worlds configuration for the homepage
export const PORTAL_WORLDS = [
  {
    href: '/art',
    title: 'ART',
    subtitle: 'The Architecture of Experience',
    imageUrl: '/images/portal-art.jpg'
  },
  {
    href: '/math',
    title: 'MATH',
    subtitle: 'The Language of the Cosmos',
    imageUrl: '/images/portal-math.jpg'
  },
  {
    href: '/yoga',
    title: 'YOGA',
    subtitle: 'The Practice of Presence',
    imageUrl: '/images/portal-yoga.jpg'
  }
] as const;

// Art world portfolio images
export const PORTFOLIO_IMAGES = [
  "/images/art-portfolio-ethereal.jpg",
  "/images/art-portfolio-dynamic.jpg",
  "/images/art-portfolio-sovereign.jpg",
  "/images/art-portfolio-sonic.jpg",
] as const;

// Contact form interest options
export const CONTACT_INTERESTS = [
  { 
    value: 'yoga-sanctuary', 
    label: 'The Sanctuary', 
    description: 'Personalized meditation, crystal collection, and spiritual guidance' 
  },
  { 
    value: 'yoga-inner-sanctum', 
    label: 'The Inner Sanctum', 
    description: 'Ayurvedic mastery, crystal jewelry, and aura readings' 
  },
  { 
    value: 'art-collaboration', 
    label: 'Art Collaboration', 
    description: 'Creative projects and artistic partnerships' 
  },
  { 
    value: 'math-basic', 
    label: 'Basic Math Pack', 
    description: 'Foundational mathematical concepts and tools' 
  },
  { 
    value: 'math-premium', 
    label: 'Premium Math Pack', 
    description: 'Advanced mathematical exploration and problem-solving' 
  },
  { 
    value: 'other', 
    label: 'Other Inquiry', 
    description: 'General questions or custom requests' 
  }
] as const;

// App metadata
export const APP_METADATA = {
  TITLE: 'Kalianïa - Digital Sanctuary',
  DESCRIPTION: 'A multi-world digital portfolio experience',
  COPYRIGHT_YEAR: 'MMXXIV', // 2024 in Roman numerals
  ADMIN_EMAIL: 'admin@kaliania.com',
  BRAND_NAME: 'Kalianïa'
} as const;
