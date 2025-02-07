import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _repository: Repository<OrderEntity>,
  ) {
    super(_repository);
  }
}
