import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patients/entities/patient.entity';

export const UserRole = {
  ADMIN: 'admin',
  PATIENT: 'patient',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: ['admin', 'patient'], default: 'patient' })
  role: UserRole;

  @OneToOne(() => Patient, (patient) => patient.user, { nullable: true })
  patient: Patient;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}