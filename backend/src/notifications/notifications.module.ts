import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { EmailStrategy } from './notification.strategy.interface.ts/email.strategy';
import { EmailProcessor } from './processor/email.processor';
import { SmsStrategy } from './notification.strategy.interface.ts/sms strategy';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get('REDIS_PASSWORD') ?? undefined,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [NotificationsService, EmailProcessor, EmailStrategy, SmsStrategy],
  exports: [NotificationsService],
})
export class NotificationsModule {}