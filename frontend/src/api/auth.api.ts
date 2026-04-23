import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? 'Invalid credentials');
    }
    return res.json();
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? 'Registration failed');
    }
    return res.json();
  },
};