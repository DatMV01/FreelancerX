import {
  Controller,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { BaseController } from '../base/base.controller';

import { CreateOrderDto } from './dto/create-order.dto';

import { OrderDto } from './dto/order.dto';

import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
@Controller('order')
@ApiExtraModels(OrderDto, CreateOrderDto, UpdateOrderDto)
export class OrderController extends BaseController<
  OrderEntity,
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(protected readonly _service: OrderService) {
    super(_service, OrderEntity, OrderDto, CreateOrderDto, UpdateOrderDto);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateOrderDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderDto,
  })
  async create(data: CreateOrderDto): Promise<OrderDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateOrderDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: OrderDto,
  })
  async update(id: string, data: UpdateOrderDto): Promise<OrderDto> {
    return super.update(id, data);
  }
}
