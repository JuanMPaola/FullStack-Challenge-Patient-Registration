import {
  Controller, Post, UseGuards,
  UploadedFile, UseInterceptors, BadRequestException, Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentVerificationService } from './document-verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('document-verification')
@ApiBearerAuth()
@Controller('document-verification')
export class DocumentVerificationController {
  constructor(private readonly documentVerificationService: DocumentVerificationService) {}

  @Post('scan')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Scan document image and extract data via OCR' })
  @ApiResponse({ status: 200, description: 'Document scanned successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['documentPhoto', 'documentType'],
      properties: {
        documentPhoto: { type: 'string', format: 'binary' },
        documentType: { type: 'string', enum: ['DNI_AR', 'CI_UY'] },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('documentPhoto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (extname(file.originalname).toLowerCase() !== '.jpg') {
          return cb(new Error('Only .jpg files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async scan(
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: string,
  ) {
    if (!file) throw new BadRequestException('Document photo is required');
    return this.documentVerificationService.scanDocument(file.path, documentType);
  }
}