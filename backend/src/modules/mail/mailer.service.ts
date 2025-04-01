import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import * as nodemailer from 'nodemailer';
import { AllConfigType, MAIL_CONFIG_REGISTER } from 'src/config/config.type';
import Handlebars from 'handlebars';
import { MailConfig } from './config/mail-config.type';

@Injectable()
export class MailerService {
  private readonly transporter: nodemailer.Transporter;

  private readonly mailConfig = this.configService.get(
    MAIL_CONFIG_REGISTER as any,
    {
      infer: true,
    },
  ) as MailConfig;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const {
      host,
      port,
      ignoreTLS,
      secure,
      requireTLS,
      user,
      password,
      defaultName,
      defaultEmail,
    } = this.mailConfig;

    this.transporter = nodemailer.createTransport({
      // service: 'smtp',
      host,
      port,
      secure,
      ignoreTLS,
      requireTLS,
      auth: {
        user,
        pass: password,
      },
    });
  }

  async sendMail({
    templatePath,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    templatePath: string;
    context: Record<string, unknown>;
  }): Promise<void> {
    const mailConfig = this.configService.get(MAIL_CONFIG_REGISTER as any, {
      infer: true,
    }) as MailConfig;

    const {
      host,
      port,
      ignoreTLS,
      secure,
      requireTLS,
      user,
      password,
      defaultName,
      defaultEmail,
    } = mailConfig;

    let html: string | undefined;
    if (templatePath) {
      const template = await fs.readFile(templatePath, 'utf-8');
      html = Handlebars.compile(template, {
        strict: true,
      })(context);
    }

    await this.transporter.sendMail({
      ...mailOptions,
      from: mailOptions.from
        ? mailOptions.from
        : `"${defaultName}"<${defaultEmail}>`,
      html: mailOptions.html ? mailOptions.html : html,
    });
  }
}
