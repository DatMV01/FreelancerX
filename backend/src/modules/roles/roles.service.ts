import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService extends BaseService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly sessionRepository: Repository<RoleEntity>,
  ) {
    super(sessionRepository);
  }
}
