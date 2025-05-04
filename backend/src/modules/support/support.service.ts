import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { SupportEntity } from './entities/support.entity';

@Injectable()
export class SupportService extends BaseService<SupportEntity> {
  constructor(
    @InjectRepository(SupportEntity)
    private readonly _repository: Repository<SupportEntity>,
  ) {
    super(_repository);
  }

  private readonly logger = new Logger(SupportService.name);
}
