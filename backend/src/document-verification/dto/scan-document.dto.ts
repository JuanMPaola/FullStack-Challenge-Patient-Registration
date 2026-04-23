import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { DocumentType } from '../../patients/entities/patient.entity';

export class ScanDocumentDto {
  @ApiProperty()
  @IsString()
  imageBase64: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: string;
}