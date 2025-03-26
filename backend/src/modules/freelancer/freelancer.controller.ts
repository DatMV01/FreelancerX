import {
  Body,
  Controller,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { FreelancerDto } from './dto/freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { FreelancerEntity } from './entities/freelancer.entity';
import { FreelancerService } from './freelancer.service';
import { AuthGuard } from '@nestjs/passport';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';

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
}
