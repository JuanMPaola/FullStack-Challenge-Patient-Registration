import type { CreatePatientPayload, Patient } from '../types/patient.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const res = await fetch(`${API_URL}/patients`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  },

  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    const formData = new FormData();
    formData.append('fullName', payload.fullName);
    formData.append('email', payload.email);
    formData.append('countryCode', payload.countryCode);
    formData.append('phoneNumber', payload.phoneNumber);
    formData.append('documentType', payload.documentType);
    formData.append('documentPhoto', payload.documentPhoto);
    if (payload.documentNumber) formData.append('documentNumber', payload.documentNumber);
    if (payload.dateOfBirth) formData.append('dateOfBirth', payload.dateOfBirth);

    const res = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? 'Failed to create patient');
    }

    return res.json();
  },
};