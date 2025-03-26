import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../base/base.service';
import { FreelancerEntity } from './entities/freelancer.entity';

@Injectable()
export class FreelancerService extends BaseService<FreelancerEntity> {
  constructor(
    @InjectRepository(FreelancerEntity)
    private readonly _repository: Repository<FreelancerEntity>,
  ) {
    super(_repository);
  }
}
