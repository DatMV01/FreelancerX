import { TypeORMConfig } from 'src/database/typeorm/typeorm.config';
import { AppConfig } from './app.config';
import { FileConfig } from 'src/modules/files/config/file.config';
import { AuthConfig } from 'src/modules/auth/config/auth.config';
import { MailConfig } from 'src/modules/mail/config/mail-config.type';

export const APP_CONFIG_REGISTER = 'app';
export const DATABASE_CONFIG_REGISTER = 'database';
export const FILE_CONFIG_REGISTER = 'file';
export const AUTH_CONFIG_REGISTER = 'auth';
export const MAIL_CONFIG_REGISTER = 'mail';

export type AllConfigType = {
  APP_CONFIG_REGISTER: AppConfig;
  DATABASE_CONFIG_REGISTER: TypeORMConfig;
  FILE_CONFIG_REGISTER: FileConfig;
  AUTH_CONFIG_REGISTER: AuthConfig;
  MAIL_CONFIG_REGISTER: MailConfig;
};
