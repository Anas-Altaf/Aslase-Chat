import { auth } from './firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get the current user's ID token for API authentication
 */
export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

/**
 * API helper functions
 */
export const api = {
  async get(endpoint: string) {
    const response = await authenticatedFetch(endpoint, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await authenticatedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    const response = await authenticatedFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async patch(endpoint: string, data: any) {
    const response = await authenticatedFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await authenticatedFetch(endpoint, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    // Handle empty or non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    // Return text for non-JSON responses
    return response.text();
  },

  async postFormData(endpoint: string, formData: FormData) {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Don't set Content-Type header - browser will set it with boundary
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  },
};
