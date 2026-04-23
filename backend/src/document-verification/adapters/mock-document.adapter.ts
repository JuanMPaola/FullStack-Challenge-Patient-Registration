import { Injectable, Logger } from '@nestjs/common';
import type { DocumentVerifier, DocumentVerificationResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class MockDocumentAdapter implements DocumentVerifier {
  private readonly logger = new Logger(MockDocumentAdapter.name);

  async verify(): Promise<DocumentVerificationResult> {
    return {
      isValid: true,
      isDocument: true,
      firstName: 'MOCK',
      lastName: 'USER',
      documentNumber: '12345678',
    };
  }
}