import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { GigEntity } from './entities/gig.entity';

@Injectable()
export class GigService extends BaseService<GigEntity> {
  constructor(
    @InjectRepository(GigEntity)
    private readonly _repository: Repository<GigEntity>,
  ) {
    super(_repository);
  }
}
