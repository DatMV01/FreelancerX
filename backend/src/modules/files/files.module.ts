import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { AllConfigType } from 'src/config/config.type';
import { FileEntity } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FilesLocalService } from './files.service';

const fileFilter = (
  req: any,
  file: {
    /** Field name specified in the form */
    fieldname: string;
    /** Name of the file on the user's computer */
    originalname: string;
    /** Encoding type of the file */
    encoding: string;
    /** Mime type of the file */
    mimetype: string;
    /** Size of the file in bytes */
    size: number;
    /** The folder to which the file has been saved (DiskStorage) */
    destination: string;
    /** The name of the file within the destination (DiskStorage) */
    filename: string;
    /** Location of the uploaded file (DiskStorage) */
    path: string;
    /** A Buffer of the entire file (MemoryStorage) */
    buffer: Buffer;
  },
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: `cantUploadFileType`,
        },
      }),
      false,
    );
  }

  callback(null, true);
};

const filename = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const uniqueSuffix = Date.now() + '-' + randomStringGenerator();
  const ext = extname(file.originalname);
  const fileName = basename(file.originalname, ext);
  callback(null, `${fileName}-${uniqueSuffix}${ext}`);
};

const destination = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, destination: string) => void,
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    if (!fs.existsSync(`./public/images`)) {
      fs.mkdirSync(`./public/images`, { recursive: true });
    }

    return callback(null, `./public/images`);
  }

  return callback(null, './public');
};

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fileFilter,
          storage: diskStorage({
            destination,
            filename,
          }),
          // limits: {
          //   fileSize: (configService as any).get('file.maxFileSize', {
          //     infer: true,
          //   }),
          // },
        };
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FilesLocalService],
  exports: [FilesLocalService, TypeOrmModule.forFeature([FileEntity])],
})
export class FilesModule {}
