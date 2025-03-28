import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';

export class TransactionDto extends BaseDto<TransactionDto> {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  user: UserDto;

  @AutoMap(() => OrderDto)
  order?: OrderDto;

  @AutoMap()
  amount: number;

  @AutoMap()
  transactionType: TransactionType;

  @AutoMap()
  status: TransactionStatus;
}
