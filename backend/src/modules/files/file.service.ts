import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AllConfigType, FILE_CONFIG_REGISTER } from 'src/config/config.type';
import { MaybeNull } from 'src/utils/types/nullable.type';
import { In, Like, Repository } from 'typeorm';
import { FileConfig } from './config/file.config';
import { FileType } from './domain/file.domain';
import { FileEntity } from './entities/file.entity';
import { FileMapper } from './mappers/file.mapper';
import * as path from 'path';
import * as fs from 'fs';
import { RoleEnum } from '../role/enum/role.enum';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

@Injectable()
export class FileLocalService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2); // Convert to MB and round to 2 decimal places

  async create(file: Express.Multer.File, currentUser: any): Promise<FileType> {
    const fileConfig = this.configService.get(FILE_CONFIG_REGISTER as any, {
      infer: true,
    }) as FileConfig;

    if (file.size > fileConfig.maxFileSize) {
      throw new BadRequestException(
        `File is larger than ${this.bytesToMB(fileConfig.maxFileSize)} MB`,
      );
    }

    const data: FileEntity = {
      path: `${file.path}`,
      user: {
        id: currentUser.id,
      } as any,
    } as any;

    const persistence = await this.fileRepository.save(data);

    const domain = FileMapper.toDomain(persistence);

    return domain;
  }

  async findById(id: FileType['id']): Promise<MaybeNull<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  async findByIds(ids: FileType['id'][]): Promise<FileType[]> {
    const entities = await this.fileRepository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map((entity) => FileMapper.toDomain(entity));
  }

  async deleteFileByID(
    fileId: string,
    currentUser: JwtAccessPayloadType,
  ): Promise<boolean> {
    let entity;

    if (currentUser.role === RoleEnum[RoleEnum.ADMIN]) {
      entity = await this.fileRepository.findOne({
        where: { id: fileId },
      });
    }
    entity = await this.fileRepository.findOne({
      where: { id: fileId, user: { id: currentUser.id } },
    });

    if (!entity) return false;

    const filePath = path.resolve('.\\', entity.path);

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      await fs.promises.unlink(filePath);

      const result = await this.fileRepository.softDelete(entity.id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async deleteFileByName(name: string): Promise<boolean> {
    const entity = await this.fileRepository.findOne({
      where: { url: Like(`%${name}%`) },
    });

    if (!entity) return false;

    const filePath = path.resolve('.\\', entity.url);

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      await fs.promises.unlink(filePath);

      const result = await this.fileRepository.softDelete(entity.id);
      return (result.affected ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}
