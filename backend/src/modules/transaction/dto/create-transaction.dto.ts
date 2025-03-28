import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';
import { AutoMap } from '@automapper/classes';

export class CreateTransactionDto {
  @AutoMap()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @AutoMap()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @AutoMap()
  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @AutoMap()
  @ApiProperty({ example: TransactionType.DEPOSIT, enum: TransactionType })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @AutoMap()
  @ApiProperty({
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
    required: false,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}
