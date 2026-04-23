export const DocumentType = {
  DNI_AR: 'DNI_AR',
  CI_UY: 'CI_UY',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  documentType: DocumentType;
  documentNumber?: string;
  documentPhotoUrl: string;
  documentVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientPayload {
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  documentType: DocumentType;
  documentNumber?: string;
  dateOfBirth?: string;
  documentPhotoUrl: string;
}