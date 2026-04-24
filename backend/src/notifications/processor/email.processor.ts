import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailPayload } from '../notifications.service';

@Processor('notifications')
export class EmailProcessor {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get('mail.user');
    console.log('Mail config:', { host, port, user });

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass: this.configService.get('mail.password'),
      },
    });
  }

  @Process('registration-email')
  async handleRegistrationEmail(job: Job<SendEmailPayload>): Promise<void> {
    const { to, fullName } = job.data;
    console.log('Processing email job:', { to, fullName });

    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('mail.from'),
        to,
        subject: 'Registration Confirmation',
        html: `<h1>Welcome, ${fullName}!</h1><p>Your registration was successful.</p>`,
      });
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Email send error:', error);
    }
  }
}