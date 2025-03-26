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
}
