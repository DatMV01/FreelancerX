import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';

export class TransactionDto extends BaseDto<TransactionDto> {
  @AutoMap()
  @ApiProperty({
    description: 'Unique identifier of the transaction',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  id: string;

  @AutoMap(() => UserDto)
  @ApiProperty({
    description: 'User associated with the transaction',
    type: () => UserDto,
  })
  user: UserDto;

  @AutoMap(() => OrderDto)
  @ApiPropertyOptional({
    description: 'Order associated with the transaction, if applicable',
    type: () => OrderDto,
  })
  order?: OrderDto;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction amount in the respective currency',
    example: 100.5,
    minimum: 0.01,
  })
  amount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Type of transaction (e.g., DEPOSIT, WITHDRAWAL)',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
  })
  transactionType: TransactionType;

  @AutoMap()
  @ApiProperty({
    description: 'Current status of the transaction',
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
  })
  status: TransactionStatus;
}
