import { Injectable } from '@nestjs/common';
import { ArgentinaDniAdapter } from './adapters/argentina-dni.adapter';
import { UruguayCiAdapter } from './adapters/uruguay-ci.adapter';
import { DocumentType } from '../patients/entities/patient.entity';
import type { DocumentVerifier } from './interfaces/document-verifier.interface';
import { MockDocumentAdapter } from './adapters/mock-document.adapter';

@Injectable()
export class DocumentVerificationFactory {
  constructor(
    private readonly argentinaDniAdapter: ArgentinaDniAdapter,
    private readonly uruguayCiAdapter: UruguayCiAdapter,
    private readonly mockDocumentAdapter: MockDocumentAdapter,
  ) {}

  getVerifier(documentType: DocumentType): DocumentVerifier {
    switch (documentType) {
      case DocumentType.DNI_AR:
       return this.argentinaDniAdapter;
       // return this.mockDocumentAdapter;
      case DocumentType.CI_UY:
       return this.uruguayCiAdapter;
       // return this.mockDocumentAdapter;
    }
  }
}