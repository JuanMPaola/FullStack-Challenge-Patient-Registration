import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotificationStrategy } from '../strategies/notification.strategy.interface';


@Injectable()
export class EmailStrategy implements NotificationStrategy {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('mail.host'),
      port: this.configService.get<number>('mail.port'),
      auth: {
        user: this.configService.get('mail.user'),
        pass: this.configService.get('mail.password'),
      },
    });
  }

  async send(to: string, message: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get('mail.from'),
      to,
      subject: 'Registration Confirmation',
      html: message,
    });
  }
}