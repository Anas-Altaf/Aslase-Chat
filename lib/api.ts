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
  const text = await response.text();

  if (!response.ok) {
    let message = response.statusText || `HTTP ${response.status}`;
    try {
      const body = JSON.parse(text);
      if (body?.message) message = Array.isArray(body.message) ? body.message.join('; ') : body.message;
    } catch {
      if (text) message = text;
    }
    throw new ApiError(response.status, message);
  }

  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
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
    return parseResponse<T>(response);
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
