import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { DocumentVerificationService } from '../document-verification/document-verification.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly notificationsService: NotificationsService,
    private readonly documentVerificationService: DocumentVerificationService,
    private readonly storageService: StorageService,
  ) { }

  async create(dto: CreatePatientDto, documentPhotoUrl: string, userId: string): Promise<Patient> {
  const existing = await this.patientRepository.findOneBy({ email: dto.email });
  if (existing) {
    throw new BadRequestException('Email already registered');
  }

  if (dto.documentNumber) {
    const result = await this.documentVerificationService.verify(
      dto.documentType,
      dto.documentNumber,
      dto.dateOfBirth ? { dateOfBirth: dto.dateOfBirth } : undefined,
    );
    if (!result.isValid) {
      throw new BadRequestException('Document verification failed');
    }
  }

  const publicUrl = await this.storageService.uploadFile(documentPhotoUrl, 'image/jpeg');

  const patient = this.patientRepository.create({
    ...dto,
    documentPhotoUrl: publicUrl,
    documentVerified: !!dto.documentNumber,
    userId,
  });

  const saved = await this.patientRepository.save(patient);

  await this.notificationsService.sendRegistrationEmail({
    to: saved.email,
    fullName: saved.fullName,
  });

  return saved;
}

async findByUserId(userId: string): Promise<Patient> {
  const patient = await this.patientRepository.findOneBy({ userId });
  if (!patient) {
    throw new NotFoundException('Patient profile not found');
  }
  return patient;
}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
    return patient;
  }
}