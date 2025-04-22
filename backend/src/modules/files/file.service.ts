import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AllConfigType, FILE_CONFIG_REGISTER } from 'src/config/config.type';
import { MaybeNull } from 'src/utils/types/nullable.type';
import { In, Like, Repository } from 'typeorm';
import { FileConfig, FileDriver } from './config/file.config';
import { FileDto } from './dto/file.dto';
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

  async create(file: Express.Multer.File, currentUser: any): Promise<FileDto> {
    const fileConfig = this.configService.get(FILE_CONFIG_REGISTER as any, {
      infer: true,
    }) as FileConfig;

    if (file.size > fileConfig.maxFileSize) {
      throw new BadRequestException(
        `File is larger than ${this.bytesToMB(fileConfig.maxFileSize)} MB`,
      );
    }

    const data: Partial<FileEntity> = {
      url: `${file.path}`,
      userId: currentUser.id,
      mimeType: file.mimetype,
    };

    const entity = await this.fileRepository.save(data);

    const dto = FileMapper.toDto(entity);

    return dto;
  }

  async findById(id: FileDto['id']): Promise<MaybeNull<FileDto>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDto(entity) : null;
  }

  async findByIds(ids: FileDto['id'][]): Promise<FileDto[]> {
    const entities = await this.fileRepository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map((entity) => FileMapper.toDto(entity));
  }

  async deleteFileByID(
    id: string,
    currentUser: JwtAccessPayloadType,
  ): Promise<boolean> {
    const entity = await this.fileRepository.findOne({
      where: { id },
    });

    if (!entity) {
      return false;
    }

    if (
      currentUser.role == RoleEnum[RoleEnum.ADMIN] ||
      entity.userId === currentUser.id
    ) {
      if (entity.provider === FileDriver.LOCAL) {
        return this.deleteFileLocal(entity);
      }
    }

    return false;
  }

  async deleteFileByName(
    name: string,
    currentUser: JwtAccessPayloadType,
  ): Promise<boolean> {
    const entity = await this.fileRepository.findOne({
      where: { url: Like(`%${name}%`) },
    });

    if (!entity) {
      return false;
    }

    if (
      currentUser.role == RoleEnum[RoleEnum.ADMIN] ||
      entity.userId === currentUser.id
    ) {
      if (entity.provider === FileDriver.LOCAL) {
        return this.deleteFileLocal(entity);
      }
    }

    return false;
  }

  async deleteFileLocal(entity: FileEntity) {
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
