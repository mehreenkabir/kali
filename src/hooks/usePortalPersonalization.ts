/**
 * Portal Personalization Hook - Complete Frontend Integration
 * React hook for seamless portal personalization and data tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Types for the hook
interface PersonalizationData {
  preferences: any;
  analytics: any;
  subscription: any;
  loading: boolean;
  error: string | null;
}

interface PersonalizationActions {
  trackLogin: () => Promise<void>;
  trackPageVisit: (page: string) => Promise<void>;
  trackFeature: (feature: string) => Promise<void>;
  saveMood: (moodData: any) => Promise<void>;
  saveJournal: (entryData: any) => Promise<void>;
  saveMeditation: (sessionData: any) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
  initializeSubscription: (tier: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function usePortalPersonalization(): PersonalizationData & PersonalizationActions {
  const { data: session, status } = useSession();
  const [data, setData] = useState<PersonalizationData>({
    preferences: null,
    analytics: null,
    subscription: null,
    loading: true,
    error: null
  });

  // Generic API call function
  const apiCall = useCallback(async (method: 'GET' | 'POST', endpoint?: string, body?: any) => {
    if (status !== 'authenticated' || !session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const url = endpoint ? `/api/portal?${endpoint}` : '/api/portal';
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }, [session, status]);

  // Load initial data
  const loadUserData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await apiCall('GET');
      
      setData(prev => ({
        ...prev,
        preferences: result.preferences,
        analytics: result.analytics,
        subscription: result.subscription,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading user data:', error);
      setData(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data',
        loading: false
      }));
    }
  }, [apiCall]);

  // Track login
  const trackLogin = useCallback(async () => {
    try {
      await apiCall('POST', '', { action: 'trackLogin' });
      // Optionally refresh analytics after tracking
      await loadUserData();
    } catch (error) {
      console.error('Error tracking login:', error);
    }
  }, [apiCall, loadUserData]);

  // Track page visit
  const trackPageVisit = useCallback(async (page: string) => {
    try {
      await apiCall('POST', '', { action: 'trackPageVisit', data: { page } });
    } catch (error) {
      console.error('Error tracking page visit:', error);
    }
  }, [apiCall]);

  // Track feature usage
  const trackFeature = useCallback(async (feature: string) => {
    try {
      await apiCall('POST', '', { action: 'trackFeature', data: { feature } });
    } catch (error) {
      console.error('Error tracking feature:', error);
    }
  }, [apiCall]);

  // Save mood entry
  const saveMood = useCallback(async (moodData: any) => {
    try {
      await apiCall('POST', '', { action: 'saveMood', data: moodData });
      // Refresh analytics to get updated mood trends
      await loadUserData();
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  }, [apiCall, loadUserData]);

  // Save journal entry
  const saveJournal = useCallback(async (entryData: any) => {
    try {
      await apiCall('POST', '', { action: 'saveJournal', data: entryData });
      // Refresh analytics to update journal count
      await loadUserData();
    } catch (error) {
      console.error('Error saving journal:', error);
      throw error;
    }
  }, [apiCall, loadUserData]);

  // Save meditation session
  const saveMeditation = useCallback(async (sessionData: any) => {
    try {
      await apiCall('POST', '', { action: 'saveMeditation', data: sessionData });
      // Track the feature usage and refresh data
      await trackFeature('meditation');
      await loadUserData();
    } catch (error) {
      console.error('Error saving meditation:', error);
      throw error;
    }
  }, [apiCall, trackFeature, loadUserData]);

  // Update user preferences
  const updatePreferences = useCallback(async (preferences: any) => {
    try {
      await apiCall('POST', '', { action: 'updatePreferences', data: preferences });
      // Update local state immediately for better UX
      setData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...preferences }
      }));
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }, [apiCall]);

  // Initialize subscription
  const initializeSubscription = useCallback(async (tier: string) => {
    try {
      await apiCall('POST', '', { action: 'initializeSubscription', data: { tier } });
      await loadUserData(); // Refresh all data including subscription info
    } catch (error) {
      console.error('Error initializing subscription:', error);
      throw error;
    }
  }, [apiCall, loadUserData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  // Load data when session becomes available
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadUserData();
      trackLogin(); // Track login automatically
    }
  }, [status, session?.user?.id, loadUserData, trackLogin]);

  return {
    ...data,
    trackLogin,
    trackPageVisit,
    trackFeature,
    saveMood,
    saveJournal,
    saveMeditation,
    updatePreferences,
    initializeSubscription,
    refreshData
  };
}

// Additional helper hooks for specific data types
export function useMoodTracking() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const loadMoods = useCallback(async (days: number = 30) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/portal?type=mood&days=${days}`);
      const result = await response.json();
      setMoods(result.moods || []);
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadMoods();
  }, [loadMoods]);

  return { moods, loading, loadMoods };
}

export function useJournalEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const loadEntries = useCallback(async (limit: number = 20) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/portal?type=journal&limit=${limit}`);
      const result = await response.json();
      setEntries(result.entries || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  return { entries, loading, loadEntries };
}

export function useMeditationStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const loadStats = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/api/portal?type=meditation');
      const result = await response.json();
      setStats(result.stats || null);
    } catch (error) {
      console.error('Error loading meditation stats:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, loading, loadStats };
}

// Auto-tracking hook for page visits
export function usePageTracking(pageName: string) {
  const { trackPageVisit } = usePortalPersonalization();

  useEffect(() => {
    trackPageVisit(pageName);
  }, [trackPageVisit, pageName]);
}
