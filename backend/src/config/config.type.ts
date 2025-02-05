import { TypeORMConfig } from 'src/database/typeorm/typeorm.config';
import { AppConfig } from './app.config';
import { FileConfig } from 'src/modules/files/config/file.config';

export const APP_CONFIG_REGISTER = 'app';
export const DATABASE_CONFIG_REGISTER = 'database';
export const FILE_CONFIG_REGISTER = 'file';

export type AllConfigType = {
  APP_CONFIG_REGISTER: AppConfig;
  DATABASE_CONFIG_REGISTER: TypeORMConfig;
  FILE_CONFIG_REGISTER: FileConfig;
};
