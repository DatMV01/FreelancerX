import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController extends BaseController<
  OrderEntity,
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(protected readonly _service: OrderService) {
    super(_service, OrderDto, OrderEntity);
  }
}
