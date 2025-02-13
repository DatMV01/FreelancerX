import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseMapper<BaseEntity, BaseDto, CreateDto, UpdateDto> {
  @InjectMapper() protected readonly mapper: Mapper;

  abstract toDTO(entity: BaseEntity): BaseDto;
  abstract toEntity(dto: BaseDto): BaseEntity;
  abstract toEntityFromCreateDto(createDto: CreateDto): BaseEntity;
  abstract toEntityFromUpdateDto(updateDto: UpdateDto): BaseEntity;

  toDTOs(entities: BaseEntity[]): BaseDto[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
