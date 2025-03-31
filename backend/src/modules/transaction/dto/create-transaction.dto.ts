import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';
import { AutoMap } from '@automapper/classes';

export class CreateTransactionDto {
  @AutoMap()
  @ApiPropertyOptional({
    description: 'Unique identifier of the user making the transaction',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Unique identifier of the related order, if applicable',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @AutoMap()
  @ApiProperty({
    description: 'Transaction amount in the respective currency',
    example: 100.5,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @AutoMap()
  @ApiProperty({
    description: 'Type of transaction (e.g., DEPOSIT, WITHDRAWAL)',
    example: TransactionType.DEPOSIT,
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Current status of the transaction',
    example: TransactionStatus.PENDING,
    enum: TransactionStatus,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}
