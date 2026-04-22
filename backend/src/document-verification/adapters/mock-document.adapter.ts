import { Injectable, Logger } from '@nestjs/common';
import type { DocumentVerifier, DocumentVerificationResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class MockDocumentAdapter implements DocumentVerifier {
  private readonly logger = new Logger(MockDocumentAdapter.name);

  async verify(documentNumber: string): Promise<DocumentVerificationResult> {
    this.logger.log(`[MOCK] Verifying document: ${documentNumber}`);
    return {
      isValid: true,
      fullName: 'MOCK USER',
      documentNumber,
    };
  }
}