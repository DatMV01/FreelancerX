import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController extends BaseController<
  TransactionEntity,
  TransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  constructor(protected readonly _service: TransactionService) {
    super(
      _service,
      TransactionEntity,
      TransactionDto,
      CreateTransactionDto,
      UpdateTransactionDto,
    );
  }
}
