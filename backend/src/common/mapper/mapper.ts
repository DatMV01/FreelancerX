import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '../../modules/roles/dto/role.dto';
import { RoleEntity } from '../../modules/roles/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { SessionEntity } from 'src/modules/session/entities/session.entity';
import { SessionDto } from 'src/modules/session/dto/session.dto';

@Injectable()
export class AutoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, RoleEntity, RoleDto);
      createMap(mapper, RoleDto, RoleEntity);

      createMap(mapper, StatusEntity, StatusDto);
      createMap(mapper, StatusDto, StatusEntity);

      createMap(mapper, SessionEntity, SessionDto);
      createMap(mapper, SessionDto, SessionEntity);
    };
  }
}
