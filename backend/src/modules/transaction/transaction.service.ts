import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionStripeEntity } from './entities/transactionStripe.entity';
import { consoleError } from 'src/utils/common';

@Injectable()
@Injectable()
export class TransactionService extends BaseService<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly _repository: Repository<TransactionEntity>,

    @InjectRepository(TransactionStripeEntity)
    private readonly transactionStripeRepo: Repository<TransactionStripeEntity>,
  ) {
    super(_repository);
  }

  async findStripeById(id: string) {
    const entity = await this.transactionStripeRepo.findOne({
      where: { id } as FindOptionsWhere<TransactionEntity>,
    });

    if (!entity) {
      consoleError(`Stripe with ID ${id} not found`);
      throw new NotFoundException(`Stripe with ID ${id} not found`);
    }

    return entity;;
  }
}
