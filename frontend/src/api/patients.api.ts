import type { CreatePatientPayload, Patient } from '../types/patient.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const patientsApi = {
  getAll: async (token: string): Promise<Patient[]> => {
    const res = await fetch(`${API_URL}/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  },

  getMe: async (token: string): Promise<Patient> => {
    const res = await fetch(`${API_URL}/patients/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch patient profile');
    return res.json();
  },

  create: async (payload: CreatePatientPayload, token: string): Promise<Patient> => {
    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? 'Failed to create patient');
    }

    return res.json();
  },
};