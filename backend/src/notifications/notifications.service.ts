import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { SmsStrategy } from './notification.strategy.interface.ts/sms strategy';

export interface SendEmailPayload {
  to: string;
  fullName: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly smsStrategy: SmsStrategy
  ) {}

  async sendRegistrationEmail(payload: SendEmailPayload): Promise<void> {
    await this.notificationsQueue.add('registration-email', payload);
  }

  async sendRegistrationSms(payload: { to: string; fullName: string }): Promise<void> {
  await this.smsStrategy.send(
    payload.to,
    `Welcome ${payload.fullName}, your registration was successful.`,
  );
}
}