import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @AutoMap()
  @IsOptional()
  requirements: any;

  @AutoMap()
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
}
