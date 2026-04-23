import { Module } from '@nestjs/common';
import { DocumentVerificationService } from './document-verification.service';
import { DocumentVerificationFactory } from './document-verification.factory';
import { DocumentVerificationController } from './document-verification.controller';
import { ArgentinaDniAdapter } from './adapters/argentina-dni.adapter';
import { UruguayCiAdapter } from './adapters/uruguay-ci.adapter';
import { MockDocumentAdapter } from './adapters/mock-document.adapter';
import { MockOcrAdapter } from './adapters/mock-ocr.adapter';
import { VerifikOcrAdapter } from './adapters/verifik-ocr.adapter';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports:[StorageModule],
  controllers: [DocumentVerificationController],
  providers: [
    DocumentVerificationService,
    DocumentVerificationFactory,
    ArgentinaDniAdapter,
    UruguayCiAdapter,
    MockDocumentAdapter,
    MockOcrAdapter,
    VerifikOcrAdapter,
  ],
  exports: [DocumentVerificationService],
})
export class DocumentVerificationModule {}