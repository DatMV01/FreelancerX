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
import { FileController } from './file.controller';
import { FileLocalService } from './file.service';

const videoMimeTypes: string[] = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/x-msvideo',
  'video/mpeg',
  'video/quicktime',
  'video/3gpp',
  'video/3gpp2',
  'video/x-flv',
  'video/x-matroska',
  'video/x-ms-wmv',
];

const imageMimeTypes: string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  // 'image/svg+xml',
  // 'image/tiff',
  // 'image/x-icon',
  // 'image/vnd.microsoft.icon',
  // 'image/heic',
  // 'image/heif',
];

// const documentMimeTypes: string[] = [
//   'application/pdf',
//   'application/msword',
//   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   'application/vnd.ms-excel',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   'application/vnd.ms-powerpoint',
//   'application/vnd.openxmlformats-officedocument.presentationml.presentation',
//   'text/plain',
//   'application/rtf',
//   'application/vnd.oasis.opendocument.text',
//   'application/vnd.oasis.opendocument.spreadsheet',
//   'application/vnd.oasis.opendocument.presentation',
// ];

const documentMimeTypesObject = {
  pdf: 'application/pdf',
  // doc: 'application/msword',
  // docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // xls: 'application/vnd.ms-excel',
  // xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // ppt: 'application/vnd.ms-powerpoint',
  // pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // txt: 'text/plain',
  // rtf: 'application/rtf',
  // odt: 'application/vnd.oasis.opendocument.text',
  // ods: 'application/vnd.oasis.opendocument.spreadsheet',
  // odp: 'application/vnd.oasis.opendocument.presentation',
};

const documentMimeTypes: string[] = Object.values(documentMimeTypesObject);

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

  const allowedMimeTypes = [
    ...imageMimeTypes,
    ...videoMimeTypes,
    ...documentMimeTypes,
  ];
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
  const fileNameUTF8 = Buffer.from(file.originalname, 'latin1').toString(
    'utf8',
  );

  const fileName = basename(fileNameUTF8, ext);
  callback(null, `${fileName}-${uniqueSuffix}${ext}`);
};

const destination = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, destination: string) => void,
) => {

  if (!file || !file.originalname ) {
    return callback(new Error('No file or filename provided'), '');
  }
  if (file.originalname .startsWith('avatar___')) {
    if (!fs.existsSync(`./public/avatars`)) {
      fs.mkdirSync(`./public/avatars`, { recursive: true });
    }

    return callback(null, `./public/avatars`);
  } else if (imageMimeTypes.includes(file.mimetype)) {
    if (!fs.existsSync(`./public/images`)) {
      fs.mkdirSync(`./public/images`, { recursive: true });
    }

    return callback(null, `./public/images`);
  } else if (videoMimeTypes.includes(file.mimetype)) {
    if (!fs.existsSync(`./public/videos`)) {
      fs.mkdirSync(`./public/videos`, { recursive: true });
    }

    return callback(null, `./public/videos`);
  } else if (documentMimeTypes.includes(file.mimetype)) {
    if (!fs.existsSync(`./public/documents`)) {
      fs.mkdirSync(`./public/documents`, { recursive: true });
    }

    return callback(null, `./public/documents`);
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
  controllers: [FileController],
  providers: [FileLocalService],
  exports: [FileLocalService, TypeOrmModule.forFeature([FileEntity])],
})
export class FileModule {}
