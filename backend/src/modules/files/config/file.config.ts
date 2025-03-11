import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { FILE_CONFIG_REGISTER } from 'src/config/config.type';
import validateConfig from 'src/utils/validate.config';

export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
  S3_PRESIGNED = 's3-presigned',
}

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  ACCESS_KEY_ID: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  SECRET_ACCESS_KEY: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @ValidateIf((envValues) =>
    [FileDriver.S3, FileDriver.S3_PRESIGNED].includes(envValues.FILE_DRIVER),
  )
  @IsString()
  AWS_S3_REGION: string;

  @IsNumber()
  @IsOptional()
  MAX_FILE_SIZE: number;
}

export type FileConfig = {
  driver: FileDriver;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  maxFileSize: number;
};

export default registerAs<FileConfig>(FILE_CONFIG_REGISTER, () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver:
      (process.env.FILE_DRIVER as FileDriver | undefined) ?? FileDriver.LOCAL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: process.env.MAX_FILE_SIZE
      ? parseInt(process.env.MAX_FILE_SIZE)
      : 52428800, //50MB
  };
});
