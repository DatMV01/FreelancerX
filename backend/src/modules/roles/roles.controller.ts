import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RolesService } from './roles.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
export class RolesController extends BaseController<
  RoleEntity,
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(protected readonly roleSevice: RolesService) {
    super(roleSevice, RoleDto, RoleEntity);
  }

  @Post()
  async create(createBaseDto: CreateRoleDto): Promise<RoleDto> {
    return super.create(createBaseDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBaseDto: UpdateRoleDto,
  ): Promise<RoleDto | null> {
    return super.update(id, updateBaseDto);
  }
}
