import appConfig, { AppConfig } from 'src/config/app.config';
import fileConfig, { FileConfig, FileDriver } from '../config/file.config';
import { FileDto } from '../dto/file.dto';
import { FileEntity } from '../entities/file.entity';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class FileMapper {
  static toDto(raw: FileEntity): FileDto {
    const dto = new FileDto();
    dto.id = raw.id;
    dto.url = raw.url;
    dto.mimeType = raw.mimeType;
    dto.provider = raw.provider;

    return dto;
  }

  static toPersistence(domainEntity: FileDto): FileEntity {
    const entity = new FileEntity();
    entity.id = domainEntity.id;
    entity.url = domainEntity.url;
    entity.provider = domainEntity?.provider;
    entity.mimeType = domainEntity?.mimeType;
    return entity;
  }
}
