import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { OrderStatus } from '../enum/order.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @AutoMap()
  @IsOptional()
  freelancerId: string;

  @AutoMap()
  @IsOptional()
  buyerId: string;

  @AutoMap()
  @IsOptional()
  status: OrderStatus;

  @AutoMap()
  @IsOptional()
  startDate: Date;

  @AutoMap()
  @IsOptional()
  action: string;
}
