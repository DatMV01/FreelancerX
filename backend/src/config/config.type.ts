import { TypeORMConfig } from 'src/database/typeorm/typeorm.config';
import { AppConfig } from './app.config';

export const APP_CONFIG_REGISTER = 'app';
export const DATABASE_CONFIG_REGISTER = 'database';

export type AllConfigType = {
  APP_CONFIG_REGISTER: AppConfig;
  DATABASE_CONFIG_REGISTER: TypeORMConfig;
};
