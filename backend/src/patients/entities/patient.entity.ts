import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DocumentType {
  DNI_AR = 'DNI_AR',
  CI_UY = 'CI_UY',
}

@Entity('patients')
export class Patient {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  fullName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  countryCode: string;

  @ApiProperty()
  @Column()
  phoneNumber: string;

  @ApiProperty({ enum: DocumentType })
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  documentNumber: string;

  @ApiProperty()
  @Column()
  documentPhotoUrl: string;

  @ApiProperty()
  @Column({ default: false })
  documentVerified: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}