import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateOrderDetailDto } from './dto/create-orderdetail.dto';
import { OrderDetailDto } from './dto/orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { OrderDetailEntity } from './entities/orderdetail.entity';
import { OrderDetailService } from './orderdetail.service';

@Controller('orderdetail')
export class OrderDetailController extends BaseController<
  OrderDetailEntity,
  OrderDetailDto,
  CreateOrderDetailDto,
  UpdateOrderdetailDto
> {
  constructor(protected readonly _service: OrderDetailService) {
    super(_service, OrderDetailDto, OrderDetailEntity);
  }
}
