export interface DocumentVerificationResult {
  isValid: boolean;
  fullName?: string;
  documentNumber?: string;
}

export interface DocumentVerifier {
  verify(documentNumber: string, extraParams?: Record<string, string>): Promise<DocumentVerificationResult>;
}