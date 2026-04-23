import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@admin.com';
    const password = this.configService.get<string>('ADMIN_PASSWORD') ?? 'admin123';

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      this.logger.log('Admin user already exists, skipping seed');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create(email, hashedPassword, UserRole.ADMIN);
    this.logger.log(`Admin user created: ${email}`);
  }
}