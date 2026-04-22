import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationStrategy } from '../strategies/notification.strategy.interface';

@Injectable()
export class SmsStrategy implements NotificationStrategy {
  private readonly logger = new Logger(SmsStrategy.name);

  constructor(private readonly configService: ConfigService) {}

  async send(to: string, message: string): Promise<void> {
    const smsEnabled = this.configService.get<string>('SMS_ENABLED') === 'true';

    if (!smsEnabled) {
      this.logger.log(`[SMS STUB] To: ${to} | Message: ${message}`);
      return;
    }

    const twilio = await import('twilio');
    const client = twilio.default(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );

    await client.messages.create({
      body: message,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to,
    });
  }
}