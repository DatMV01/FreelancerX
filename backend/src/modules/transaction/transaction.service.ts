import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
@Injectable()
export class TransactionService extends BaseService<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _repository: Repository<TransactionEntity>,
  ) {
    super(_repository);
  }
}
