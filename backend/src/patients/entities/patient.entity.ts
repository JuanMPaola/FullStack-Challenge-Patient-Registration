import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export const DocumentType = {
  DNI_AR: 'DNI_AR',
  CI_UY: 'CI_UY',
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

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
  @Column({ type: 'enum', enum: ['DNI_AR', 'CI_UY'] })
  documentType: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  documentNumber: string;

  @ApiProperty()
  @Column()
  documentPhotoUrl: string;

  @ApiProperty()
  @Column({ default: false })
  documentVerified: boolean;

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}