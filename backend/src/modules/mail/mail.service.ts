import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailData } from './interfaces/mail-data.interface';
import * as path from 'path';
import { AppConfig } from 'src/config/app.config';
import {
  AllConfigType,
  APP_CONFIG_REGISTER,
  MAIL_CONFIG_REGISTER,
} from 'src/config/config.type';
import { MailConfig } from './config/mail-config.type';
import { MailerService } from './mailer.service';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async forgotPassword(
    mailData: MailData<{ hash: string; tokenExpires: number }>,
  ): Promise<void> {
    const mailConfig = this.configService.get(MAIL_CONFIG_REGISTER as any, {
      infer: true,
    }) as MailConfig;

    const appConfig = this.configService.get(APP_CONFIG_REGISTER as any, {
      infer: true,
    }) as AppConfig;

    const resetPasswordTitle = 'Reset Password';
    let text1: null | string = `Hello ${mailData.to}`;
    let text2: null | string = 'You have requested to reset your password.';
    let text3: null | string = 'Click the button below to reset your password:';
    let text4: null | string =
      'If you did not request a password reset, please ignore this email.';

    const url = new URL(appConfig.frontendDomain + '/auth/password/reset/');
    url.searchParams.set('token', mailData.data.hash);
    url.searchParams.set('expires', mailData.data.tokenExpires.toString());

    const workingDirectory = appConfig.workingDirectory || __dirname;
    const appName = appConfig.name;
    const user = mailConfig.user;
    const templatePath = path.join(
      workingDirectory,
      'src',
      'modules',
      'mail',
      'mail-templates',
      'reset-password.hbs',
    );

    await this.mailerService.sendMail({
      from: `"FreelancerX" ${user}`,
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${url.toString()} ${resetPasswordTitle}`,
      templatePath,
      context: {
        title: resetPasswordTitle,
        url: url.toString(),
        actionTitle: resetPasswordTitle,
        app_name: appName,
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async sendWithdrawalSuccessEmail({
    to,
    name,
    amount,
    currency,
    referenceCode,
  }: {
    to: string;
    name: string;
    amount: string;
    currency: string;
    referenceCode: string;
  }): Promise<void> {
    const mailConfig = this.configService.get(MAIL_CONFIG_REGISTER as any, {
      infer: true,
    }) as MailConfig;

    const appConfig = this.configService.get(APP_CONFIG_REGISTER as any, {
      infer: true,
    }) as AppConfig;

    const workingDirectory = appConfig.workingDirectory || __dirname;
    const appName = appConfig.name;
    const user = mailConfig.user;
    const templatePath = path.join(
      workingDirectory,
      'src',
      'modules',
      'mail',
      'mail-templates',
      'withdrawal-success.hbs',
    );

    await this.mailerService.sendMail({
      from: `"FreelancerX" ${user}`,
      to: to,
      subject: 'Withdrawal Successful',
      templatePath,
      context: {
        app_name: appName,
        freelancerName: name,
        amount,
        currency,
        referenceCode,
      },
    });
  }

  async sendWithdrawalRejectedEmail({
    to,
    name,
    amount,
    currency,
    rejectionReason,
    referenceCode,
  }: {
    to: string;
    name: string;
    amount: string;
    currency: string;
    rejectionReason: string;
    referenceCode: string;
  }): Promise<void> {
    const mailConfig = this.configService.get(MAIL_CONFIG_REGISTER as any, {
      infer: true,
    }) as MailConfig;

    const appConfig = this.configService.get(APP_CONFIG_REGISTER as any, {
      infer: true,
    }) as AppConfig;

    const workingDirectory = appConfig.workingDirectory || __dirname;
    const appName = appConfig.name;
    const user = mailConfig.user;
    const templatePath = path.join(
      workingDirectory,
      'src',
      'modules',
      'mail',
      'mail-templates',
      'withdrawal-rejected.hbs',
    );

    await this.mailerService.sendMail({
      from: `"FreelancerX" ${user}`,
      to: to,
      subject: 'Withdrawal Rejected',
      templatePath,
      context: {
        app_name: appName,
        freelancerName: name,
        amount,
        currency,
        rejectionReason,
        referenceCode,
      },
    });
  }

  // async confirmNewEmail(mailData: MailData<{ hash: string }>): Promise<void> {
  //   const i18n = I18nContext.current();
  //   let emailConfirmTitle: null | string;
  //   let text1: null | string;
  //   let text2: null | string;
  //   let text3: null | string;

  //   if (i18n) {
  //     [emailConfirmTitle, text1, text2, text3] = await Promise.all([
  //       i18n.t('common.confirmEmail'),
  //       i18n.t('confirm-new-email.text1'),
  //       i18n.t('confirm-new-email.text2'),
  //       i18n.t('confirm-new-email.text3'),
  //     ]);
  //   }

  //   const url = new URL(
  //     this.configService.getOrThrow('app.frontendDomain', {
  //       infer: true,
  //     }) + '/confirm-new-email',
  //   );
  //   url.searchParams.set('hash', mailData.data.hash);

  //   await this.mailerService.sendMail({
  //     to: mailData.to,
  //     subject: emailConfirmTitle,
  //     text: `${url.toString()} ${emailConfirmTitle}`,
  //     templatePath: path.join(
  //       this.configService.getOrThrow('app.workingDirectory', {
  //         infer: true,
  //       }),
  //       'src',
  //       'mail',
  //       'mail-templates',
  //       'confirm-new-email.hbs',
  //     ),
  //     context: {
  //       title: emailConfirmTitle,
  //       url: url.toString(),
  //       actionTitle: emailConfirmTitle,
  //       app_name: this.configService.get('app.name', { infer: true }),
  //       text1,
  //       text2,
  //       text3,
  //     },
  //   });
  // }
}
