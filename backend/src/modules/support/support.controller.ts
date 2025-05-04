import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { BaseController } from '../base/base.controller';
import { SupportEntity } from './entities/support.entity';
import { SupportDto } from './dto/support.dto';

@Controller('supports')
export class SupportController extends BaseController<
  SupportEntity,
  SupportDto,
  CreateSupportDto,
  UpdateSupportDto
> {
  constructor(private readonly _service: SupportService) {
    super(
      _service,
      SupportEntity,
      SupportDto,
      CreateSupportDto,
      UpdateSupportDto,
    );
  }
}
