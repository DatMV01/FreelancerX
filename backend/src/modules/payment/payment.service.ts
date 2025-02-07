import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService extends BaseService<PaymentEntity> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly _repository: Repository<PaymentEntity>,
  ) {
    super(_repository);
  }
}
