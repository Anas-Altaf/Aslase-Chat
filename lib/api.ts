import { auth } from './firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAuthToken();
  if (!token) {
    throw new ApiError(401, 'No authentication token available');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText || `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse error, use default message
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export const api = {
  async get<T = unknown>(endpoint: string): Promise<T> {
    const response = await authenticatedFetch(endpoint, { method: 'GET' });
    return parseResponse<T>(response);
  },

  async post<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await authenticatedFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return parseResponse<T>(response);
  },

  async put<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await authenticatedFetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return parseResponse<T>(response);
  },

  async patch<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await authenticatedFetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return parseResponse<T>(response);
  },

  async delete<T = unknown>(endpoint: string): Promise<T> {
    const response = await authenticatedFetch(endpoint, { method: 'DELETE' });
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText || `HTTP ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response.text() as unknown as T;
  },

  async postFormData<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    const token = await getAuthToken();
    if (!token) {
      throw new ApiError(401, 'No authentication token available');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return parseResponse<T>(response);
  },
};
