import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '../../modules/roles/dto/role.dto';
import { RoleEntity } from '../../modules/roles/entities/role.entity';

@Injectable()
export class AutoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, RoleEntity, RoleDto);
      createMap(mapper, RoleDto, RoleEntity);
    };
  }
}
