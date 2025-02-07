import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { OrderDetailEntity } from './entities/orderdetail.entity';

@Injectable()
@Injectable()
export class OrderDetailService extends BaseService<OrderDetailEntity> {
  constructor(
    @InjectRepository(OrderDetailEntity)
    private readonly _repository: Repository<OrderDetailEntity>,
  ) {
    super(_repository);
  }
}
