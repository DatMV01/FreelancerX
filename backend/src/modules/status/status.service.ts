import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { StatusEntity } from './entities/status.entity';

@Injectable()
export class StatusService extends BaseService<StatusEntity> {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly sessionRepository: Repository<StatusEntity>,
  ) {
    super(sessionRepository);
  }
}
