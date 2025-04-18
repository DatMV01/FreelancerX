import {
  Body,
  Controller,
  Get,
  Param,
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
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderQuestionsAnswersEntity } from './entities/orderQA.entity';

@Controller('orders')
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
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateOrderDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderDto,
  })
  async createOrder(
    @Body() data: CreateOrderDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<{
    orderId: string;
    transactionId: string;
    transactionStripeId: string;
    clientSecret: string;
    paymentIntentId: string;
  }> {
    return this._service.createOrder({ ...data, buyerId: currentUser.id });
  }

  @Get('/checkout/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity found' })
  async getCheckoutOrder(@Param('id') id: string) {
    const entity = await this.baseService.findOneById(id);

    return entity;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderQuestionsAnswersEntity,
  })
  async addQuestionsAnswersToOrder(
    @Body() data: OrderQuestionsAnswersEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsAnswersEntity> {
    return this._service.addQuestionsAnswersToOrder(data, currentUser);
  }
}
