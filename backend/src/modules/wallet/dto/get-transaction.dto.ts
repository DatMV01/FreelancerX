// dto/get-transactions.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';

export class GetTransactionsDto {
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsEnum(TransactionStatus, { each: true })
  status?: TransactionStatus[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
  @IsEnum(TransactionType, { each: true })
  type?: TransactionType[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  pageSize: number = 10;
}
