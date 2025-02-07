import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { ReviewEntity } from './entities/review.entity';

@Injectable()
export class ReviewService extends BaseService<ReviewEntity> {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly _repository: Repository<ReviewEntity>,
  ) {
    super(_repository);
  }
}
