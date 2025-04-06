import { Controller, Get, Param } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { Patch, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { FreelancerDto } from '../freelancer/dto/freelancer.dto';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController extends BaseController<
  UserEntity,
  UserDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(protected readonly service: UserService) {
    super(service, UserEntity, UserDto, CreateUserDto, UpdateUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity found' })
  async findOneById(@Param('id') id: string) {
    const entity = await this.baseService.findOne({
      where: { id },
      relations: [
        'freelancer',
        'freelancer.freelancersLanguages',
        'freelancer.freelancersSkills',
      ],
    });

    const dto = this.mapFromEntityToDto(entity);

    return dto;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateUserDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: UserDto,
  })
  async create(data: CreateUserDto): Promise<UserDto> {
    return super.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateUserDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: UserDto,
  })
  async update(id: string, data: UpdateUserDto): Promise<UserDto> {
    return super.update(id, data);
  }

  protected additionalMapping(dto: UserDto, entity: UserEntity): UserDto {
    return { ...dto, freelancer: new FreelancerDto({ ...dto.freelancer }) };
  }
}
