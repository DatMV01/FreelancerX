import { AutoMap } from '@automapper/classes';
import { IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order.enum';

export class CreateOrderDto {
  @AutoMap()
  @IsOptional()
  buyerId: string;

  @AutoMap()
  @IsOptional()
  gigId: string;

  @AutoMap()
  @IsOptional()
  packageId: string;

  @AutoMap()
  @IsOptional()
  currency: string;

  @AutoMap()
  @IsOptional()
  quantity: number;

  @AutoMap()
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
}
