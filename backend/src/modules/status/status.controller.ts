import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateStatusDto } from './dto/create-status.dto';
import { StatusDto } from './dto/status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusEntity } from './entities/status.entity';
import { StatusService } from './status.service';

import { Patch, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('status')
export class StatusController extends BaseController<
  StatusEntity,
  StatusDto,
  CreateStatusDto,
  UpdateStatusDto
> {
  constructor(protected readonly roleSevice: StatusService) {
    super(
      roleSevice,
      StatusEntity,
      StatusDto,
      CreateStatusDto,
      UpdateStatusDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateStatusDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: StatusDto,
  })
  async create(data: CreateStatusDto): Promise<StatusDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateStatusDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: StatusDto,
  })
  async update(id: string, data: UpdateStatusDto): Promise<StatusDto> {
    return super.update(id, data);
  }
}
