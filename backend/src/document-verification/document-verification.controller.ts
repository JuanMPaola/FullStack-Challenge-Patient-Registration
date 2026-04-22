import { Controller } from '@nestjs/common';
import { DocumentVerificationService } from './document-verification.service';

@Controller('document-verification')
export class DocumentVerificationController {
  constructor(private readonly documentVerificationService: DocumentVerificationService) {}
}
