import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('role')
export class RoleController extends BaseController<
  RoleEntity,
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(protected readonly roleSevice: RoleService) {
    super(roleSevice, RoleDto, RoleEntity);
  }
}
