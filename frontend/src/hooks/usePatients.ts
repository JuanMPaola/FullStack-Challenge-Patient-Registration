import { useState, useEffect, useCallback } from 'react';
import { patientsApi } from '../api/patients.api';
import { useAuth } from '../context/AuthContext';
import type { CreatePatientPayload, Patient } from '../types/patient.types';

export const usePatients = () => {
  const { token, role } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = role === 'admin'
        ? await patientsApi.getAll(token)
        : await patientsApi.getMe(token);
      setPatients(Array.isArray(data) ? data : [data]);
    } catch {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const createPatient = async (payload: CreatePatientPayload): Promise<void> => {
    if (!token) return;
    const newPatient = await patientsApi.create(payload, token);
    setPatients((prev) => [newPatient, ...prev]);
  };

  return { patients, loading, error, createPatient, refetch: fetchPatients };
};