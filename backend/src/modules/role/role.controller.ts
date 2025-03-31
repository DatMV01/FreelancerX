import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';

import { Patch, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('role')
export class RoleController extends BaseController<
  RoleEntity,
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto
> {
  constructor(protected readonly roleSevice: RoleService) {
    super(roleSevice, RoleEntity, RoleDto, CreateRoleDto, UpdateRoleDto);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateRoleDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: RoleDto,
  })
  async create(data: CreateRoleDto): Promise<RoleDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: Number, required: false })
  @ApiBody({ type: UpdateRoleDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: RoleDto,
  })
  async update(id: number, data: UpdateRoleDto): Promise<RoleDto> {
    return super.update(Number(id), data);
  }
}
