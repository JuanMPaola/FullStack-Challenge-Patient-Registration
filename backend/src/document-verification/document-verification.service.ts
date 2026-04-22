import { Injectable } from '@nestjs/common';
import { DocumentVerificationFactory } from './document-verification.factory';
import { DocumentType } from '../patients/entities/patient.entity';
import type { DocumentVerificationResult } from './interfaces/document-verifier.interface';

@Injectable()
export class DocumentVerificationService {
  constructor(private readonly factory: DocumentVerificationFactory) {}

  async verify(
    documentType: DocumentType,
    documentNumber: string,
    extraParams?: Record<string, string>,
  ): Promise<DocumentVerificationResult> {
    const verifier = this.factory.getVerifier(documentType);
    return verifier.verify(documentNumber, extraParams);
  }
}