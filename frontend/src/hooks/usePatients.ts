import { useState, useEffect, useCallback } from 'react';
import { patientsApi } from '../api/patients.api';
import type { CreatePatientPayload, Patient } from '../types/patient.types';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientsApi.getAll();
      setPatients(data);
    } catch {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const createPatient = async (payload: CreatePatientPayload): Promise<void> => {
    const newPatient = await patientsApi.create(payload);
    setPatients((prev) => [newPatient, ...prev]);
  };

  return { patients, loading, error, createPatient, refetch: fetchPatients };
};