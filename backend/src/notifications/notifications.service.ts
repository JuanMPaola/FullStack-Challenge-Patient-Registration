import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

export interface SendEmailPayload {
  to: string;
  fullName: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async sendRegistrationEmail(payload: SendEmailPayload): Promise<void> {
    await this.notificationsQueue.add('registration-email', payload);
  }
}