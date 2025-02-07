import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { GigEntity } from './entities/gig.entity';
import { GigDto } from './dto/gig.dto';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';
import { GigService } from './gig.service';

@Controller('gig')
export class GigController extends BaseController<
  GigEntity,
  GigDto,
  CreateGigDto,
  UpdateGigDto
> {
  constructor(protected readonly _service: GigService) {
    super(_service, GigDto, GigEntity);
  }
}
