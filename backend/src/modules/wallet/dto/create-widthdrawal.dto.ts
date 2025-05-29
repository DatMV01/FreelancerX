import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TransactionMethod } from '../enum/transaction.enum';

export class RequestWithdrawalDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(TransactionMethod)
  method: TransactionMethod;

  @IsOptional()
  metatdata: Record<string, any>;
}
