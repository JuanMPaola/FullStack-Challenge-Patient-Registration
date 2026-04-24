export interface DocumentVerificationResult {
  isDocument?: boolean;
  isValid: boolean;
  firstName?: string;
  lastName: string;
  documentNumber?: string;
}

export interface DocumentScanResult {
  isDocument: boolean;
  firstName: string;
  lastName: string;
  documentNumber?: string;
  dateOfBirth?: string;
  documentType?: string;
}

export interface DocumentVerifier {
  verify(documentNumber: string, extraParams?: Record<string, string>): Promise<DocumentVerificationResult>;
}