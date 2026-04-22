import { Module } from '@nestjs/common';
import { DocumentVerificationService } from './document-verification.service';
import { DocumentVerificationFactory } from './document-verification.factory';
import { ArgentinaDniAdapter } from './adapters/argentina-dni.adapter';
import { UruguayCiAdapter } from './adapters/uruguay-ci.adapter';
import { MockDocumentAdapter } from './adapters/mock-document.adapter';

@Module({
  providers: [
    DocumentVerificationService,
    DocumentVerificationFactory,
    ArgentinaDniAdapter,
    UruguayCiAdapter,
    MockDocumentAdapter
  ],
  exports: [DocumentVerificationService],
})
export class DocumentVerificationModule {}