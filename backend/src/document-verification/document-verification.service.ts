import { Injectable } from '@nestjs/common';
import { DocumentVerificationFactory } from './document-verification.factory';
import { DocumentType } from '../patients/entities/patient.entity';
import { MockOcrAdapter } from './adapters/mock-ocr.adapter';
import { StorageService } from '../storage/storage.service';
import { readFileSync } from 'fs';
import type { DocumentScanResult, DocumentVerificationResult } from './interfaces/document-verifier.interface';
import { VerifikOcrAdapter } from './adapters/verifik-ocr.adapter';

@Injectable()
export class DocumentVerificationService {
  constructor(
    private readonly factory: DocumentVerificationFactory,
    private readonly mockOcrAdapter: MockOcrAdapter,
    private readonly storageService: StorageService,
    private readonly verifykOcrAdapter: VerifikOcrAdapter,
  ) { }

  async verify(
    documentType: DocumentType,
    documentNumber: string,
    extraParams?: Record<string, string>,
  ): Promise<DocumentVerificationResult> {
    const verifier = this.factory.getVerifier(documentType);
    return verifier.verify(documentNumber, extraParams);
  }

  async scanDocument(fileBuffer: Buffer, documentType: string): Promise<DocumentScanResult & { photoUrl: string }> {
    const result = await this./* verifykOcrAdapter */mockOcrAdapter.scanDocument(
      fileBuffer.toString('base64'),
      documentType,
    );

    const photoUrl = await this.storageService.uploadBuffer(fileBuffer, 'image/jpeg');

    return { ...result, photoUrl };
  }
}