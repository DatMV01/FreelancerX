import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TransactionMethod } from '../enum/transaction.enum';

export class CreateWithdrawalDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransactionMethod)
  method: TransactionMethod;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
