import { BaseController } from '../base/base.controller';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerEntity } from './entities/freelancer.entity';
import { FreelancerService } from './freelancer.service';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

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
  // @Get(':id')
  // // // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Get an entity by ID' })
  // @ApiParam({ name: 'id', type: String })
  // @ApiResponse({ status: 200, description: 'Entity found' })
  // async findOneById(@Param('id') id: string) {
  //   const entity = await this._service.findOneById(id);

  //   return this.mapFromEntityToDto(entity);
  // }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateFreelancerDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: FreelancerDto,
  })
  async create(data: CreateFreelancerDto): Promise<any> {
    return super.create(data)
    //return this._service.create(super.getEntityMapping(data));
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateFreelancerDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: FreelancerDto,
  })
  async update(id: string, data: UpdateFreelancerDto): Promise<FreelancerDto> {
    return super.update(id, data);
  }
}
