// Dashboard API service for the dashboard frontend

import { DashboardConfig, AccessibilityConfig } from '@/src/types/dashboard';

// Base API URL - can be configured via environment variables
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

/**
 * Fetches the dashboard configuration for the current user
 * @returns Promise resolving to the dashboard configuration
 */
export const fetchDashboardConfig = async (): Promise<DashboardConfig> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard config: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard config:', error);
    throw error;
  }
};

/**
 * Updates the dashboard configuration for the current user
 * @param config - The updated dashboard configuration
 * @returns Promise resolving to the updated dashboard configuration
 */
export const updateDashboardConfig = async (config: Partial<DashboardConfig>): Promise<DashboardConfig> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dashboard config: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating dashboard config:', error);
    throw error;
  }
};

/**
 * Fetches the accessibility settings for the current user
 * @returns Promise resolving to the accessibility configuration
 */
export const fetchAccessibilityConfig = async (): Promise<AccessibilityConfig> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/accessibility`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch accessibility config: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching accessibility config:', error);
    throw error;
  }
};

/**
 * Updates the accessibility settings for the current user
 * @param config - The updated accessibility configuration
 * @returns Promise resolving to the updated accessibility configuration
 */
export const updateAccessibilityConfig = async (config: Partial<AccessibilityConfig>): Promise<AccessibilityConfig> => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/accessibility`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`Failed to update accessibility config: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating accessibility config:', error);
    throw error;
  }
};

/**
 * Fetches dashboard statistics
 * @returns Promise resolving to dashboard statistics
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${authToken}`,
      },
      credentials: 'include', // Include cookies if needed for auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};