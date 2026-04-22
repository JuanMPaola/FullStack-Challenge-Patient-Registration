import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailPayload } from '../notifications.service';

@Processor('notifications')
export class EmailProcessor {
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

  @Process('registration-email')
  async handleRegistrationEmail(job: Job<SendEmailPayload>): Promise<void> {
    const { to, fullName } = job.data;

    await this.transporter.sendMail({
      from: this.configService.get('mail.from'),
      to,
      subject: 'Registration Confirmation',
      html: `
        <h1>Welcome, ${fullName}!</h1>
        <p>Your registration was successful.</p>
      `,
    });
  }
}