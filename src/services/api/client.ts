import { useAuthStore } from '../../features/auth/auth.store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const json = text ? (JSON.parse(text) as any) : null;

  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout();
    }
    const error: ApiError = json ?? {
      timestamp: new Date().toISOString(),
      status: res.status,
      error: res.statusText,
      message: text || 'Request failed',
    };
    const err = new Error(error.message);
    (err as any).status = res.status;
    throw err;
  }
  return json as T;
}

export const apiClient = {
  async request<T>(path: string, options: RequestInit = {}, method: HttpMethod = 'GET'): Promise<T> {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token && path !== '/auth/google') {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
    let res: Response;
    try {
      res = await fetch(url, {
        ...options,
        method,
        headers,
      });
    } catch (err) {
      throw new Error(`Network error contacting API at ${url}`);
    }

    return handleResponse<T>(res);
  },
  get: <T>(path: string) => apiClient.request<T>(path, {}, 'GET'),
  post: <T>(path: string, body?: any) =>
    apiClient.request<T>(path, { body: body ? JSON.stringify(body) : undefined }, 'POST'),
  put: <T>(path: string, body?: any) =>
    apiClient.request<T>(path, { body: body ? JSON.stringify(body) : undefined }, 'PUT'),
  del: <T>(path: string) => apiClient.request<T>(path, {}, 'DELETE'),
};
