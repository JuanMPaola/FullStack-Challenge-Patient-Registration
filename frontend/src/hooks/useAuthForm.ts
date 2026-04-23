import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { patientsApi } from '../api/patients.api';
import type { DocumentType } from '../types/patient.types';

interface RegisterAndCreatePatientPayload {
  email: string;
  password: string;
  fullName: string;
  countryCode: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth?: string;
  documentPhotoUrl: string;
}

export const useAuthForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { accessToken } = await authApi.login({ email, password });
      login(accessToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { accessToken } = await authApi.register({ email, password });
      setRegistrationToken(accessToken);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (payload: RegisterAndCreatePatientPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const token = registrationToken;
      if (!token) throw new Error('No registration token found');

      await patientsApi.create({
        fullName: payload.fullName,
        countryCode: payload.countryCode,
        phoneNumber: payload.phoneNumber,
        documentType: payload.documentType as DocumentType,
        documentNumber: payload.documentNumber,
        dateOfBirth: payload.dateOfBirth,
        documentPhotoUrl: payload.documentPhotoUrl,
        email: payload.email,
      }, token);

      login(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, handleCreatePatient, registrationToken, loading, error };
};