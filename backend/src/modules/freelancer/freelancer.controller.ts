import { BaseController } from '../base/base.controller';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerEntity } from './entities/freelancer.entity';
import { FreelancerService } from './freelancer.service';
import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ADMIN_GROUP,
  CREATE_GROUP,
  ME_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

@Controller('freelancer')
export class FreelancerController extends BaseController<
  FreelancerEntity,
  FreelancerDto,
  CreateFreelancerDto,
  UpdateFreelancerDto
> {
  constructor(protected readonly _service: FreelancerService) {
    super(
      _service,
      FreelancerEntity,
      FreelancerDto,
      CreateFreelancerDto,
      UpdateFreelancerDto,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new freelancer' })
  @ApiBody({ type: CreateFreelancerDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: FreelancerDto,
  })
  createFreelancer(
    @Body() data: CreateFreelancerDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<FreelancerDto> {
    data = {
      ...data,
      userId: currentUser.id,
    };
    return super.create(data);
  }

  @Get('/profile/email/:email')
  @SerializeOptions({ groups: [ADMIN_GROUP] })
  @ApiOperation({ summary: 'Get freelancer information by email' })
  @ApiBody({ type: FreelancerDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity found',
    type: FreelancerDto,
  })
  async getFreelancerProfileByEmail(
    @Param('email') email: string,
  ): Promise<FreelancerDto> {
    if (!email) {
      throw new BadRequestException('Email can not empty');
    }

    const entity = await this.baseService.findOne({
      where: { email },
      relations: ['user'],
    });

    const { user, ...finalEntity } = entity;
    finalEntity.avatar = user.avatar as any;
    finalEntity.country = user.country as any;
    finalEntity.phone = user.phone as any;

    return this.mapFromEntityToDto(finalEntity as any);
  }

  @Get('/profile/id/:id')
  @SerializeOptions({ groups: [ADMIN_GROUP] })
  @ApiOperation({ summary: 'Get freelancer information by email' })
  @ApiBody({ type: FreelancerDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity found',
    type: FreelancerDto,
  })
  async getFreelancerProfileById(
    @Param('id') id: string,
  ): Promise<FreelancerDto> {
    if (!id) {
      throw new BadRequestException('Id can not empty');
    }

    const entity = await this.baseService.findOne({
      where: { id },
      relations: ['user'],
    });

    const { user, ...finalEntity } = entity;
    finalEntity.avatar = user.avatar as any;
    finalEntity.country = user.country as any;
    finalEntity.phone = user.phone as any;

    return this.mapFromEntityToDto(finalEntity as any);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateFreelancerDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: FreelancerDto,
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFreelancerDto,
  ): Promise<FreelancerDto> {
    const dto = await super.update(id, data);
    return dto;
  }
}
