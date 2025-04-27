import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePayoutDto {
  @IsNotEmpty()
  @IsString()
  connectedAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
