import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AllConfigType, FILE_CONFIG_REGISTER } from 'src/config/config.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { In, Repository } from 'typeorm';
import { FileConfig } from './config/file.config';
import { FileType } from './domain/file.domain';
import { FileEntity } from './entities/file.entity';
import { FileMapper } from './mappers/file.mapper';

@Injectable()
export class FilesLocalService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create(file: Express.Multer.File): Promise<FileType> {
    const fileConfig = this.configService.get(FILE_CONFIG_REGISTER as any, {
      infer: true,
    }) as FileConfig;

    if (file.size > fileConfig.maxFileSize) {
      throw new BadRequestException('file is too large!');
    }

    const data: any = {
      path: `${file.path}`,
    };

    const persistence = await this.fileRepository.save(data);

    const domain = FileMapper.toDomain(persistence);

    return domain;
  }

  async findById(id: FileType['id']): Promise<NullableType<FileType>> {
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
}
