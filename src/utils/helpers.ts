// FILE: src/utils/helpers.ts
// Utility functions for common operations

import { ContactInterest, EmailMessage, ContactFormData } from '@/types/common';
import { CONTACT_INTERESTS, APP_METADATA } from './constants';

/**
 * Find a contact interest by its value
 */
export const findInterestByValue = (value: string): ContactInterest | undefined => {
  return CONTACT_INTERESTS.find(interest => interest.value === value);
};

/**
 * Create an email message object from contact form data
 */
export const createEmailMessage = (formData: ContactFormData): EmailMessage => {
  const selectedInterest = findInterestByValue(formData.interest);
  
  return {
    id: Date.now().toString(),
    from: formData.email,
    to: APP_METADATA.ADMIN_EMAIL,
    subject: `New Contact: ${selectedInterest?.label || 'General Inquiry'}`,
    message: formData.message,
    interest: selectedInterest?.label || '',
    timestamp: new Date().toISOString(),
    read: false
  };
};

/**
 * Save email message to localStorage
 */
export const saveEmailToLocalStorage = (emailMessage: EmailMessage): void => {
  try {
    const existingSubmissions = localStorage.getItem('contactSubmissions');
    const submissions: EmailMessage[] = existingSubmissions ? JSON.parse(existingSubmissions) : [];
    submissions.unshift(emailMessage);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Check if a pathname matches the current active page
 */
export const isActivePage = (pathname: string, href: string): boolean => {
  return pathname === href;
};

/**
 * Generate a unique key for React list items
 */
export const generateKey = (prefix: string, index: number): string => {
  return `${prefix}-${index}`;
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
