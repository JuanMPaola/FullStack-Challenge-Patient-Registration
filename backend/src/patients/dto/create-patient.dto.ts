import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { DocumentType } from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'Full name must contain only letters' })
  fullName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({ required: false, description: 'Required for CI_UY. Format: DD/MM/YYYY' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}