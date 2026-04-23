import { Injectable, Logger } from '@nestjs/common';
import type { DocumentScanResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class MockOcrAdapter {
  private readonly logger = new Logger(MockOcrAdapter.name);

  async scanDocument(imageBase64: string, documentType: string): Promise<DocumentScanResult> {
    this.logger.log(`[MOCK OCR] Scanning document type: ${documentType}`);
    return {
      isDocument: true,
      firstName: 'MOCKED',
      lastName: 'NAME',
      documentNumber: '12345678',
      dateOfBirth: '01/01/1990',
    };
  }
}