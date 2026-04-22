import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { DocumentVerificationModule } from '../document-verification/document-verification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]),
    NotificationsModule,
    DocumentVerificationModule,
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}