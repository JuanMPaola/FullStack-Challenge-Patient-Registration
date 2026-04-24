const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface ScanResult {
  isDocument: boolean;
  /* fullName?: string; */
  firstName: string;
  lastName: string;
  documentNumber?: string;
  dateOfBirth?: string;
  photoUrl?: string;
  documentType?: string;
}

export const documentVerificationApi = {
  scan: async (file: File, documentType: string, token: string): Promise<ScanResult> => {
    const formData = new FormData();
    formData.append('documentPhoto', file);
    formData.append('documentType', documentType);

    const res = await fetch(`${API_URL}/document-verification/scan`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message ?? 'Scan failed');
    }

    return res.json();
  },
};