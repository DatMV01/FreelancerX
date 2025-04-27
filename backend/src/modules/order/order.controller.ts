import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { OrderQuestionsEntity } from './entities/order_questions.entity';
import { PageDto } from '../base/dto/pagination';
import { QueryDto } from '../base/dto/query.dto';
import { OrderDeliverablesEntity } from './entities/order_deliverables.entity';
import { OrderLogsEntity } from './entities/order_logs.entity';
import { OrderStatus } from './order.enum';
import { TransactionService } from '../transaction/transaction.service';

@Controller('orders')
@ApiExtraModels(OrderDto, CreateOrderDto, UpdateOrderDto)
export class OrderController extends BaseController<
  OrderEntity,
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(
    protected readonly _service: OrderService,
    private transactionService: TransactionService,
  ) {
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
    clientSecret: string;
    paymentIntentId: string;
  }> {
    return this._service.createOrder(
      { ...data, buyerId: currentUser.id },
      currentUser,
    );
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

  @Patch('/action/:id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity by action' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateOrderDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: OrderDto,
  })
  async updateOrderByAction(
    @Param('id') id: string,
    @Body() data: UpdateOrderDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderDto> {
    const updatedOrder = await this._service.updateOrderByAction(
      currentUser,
      id,
      data,
    );

    if (updatedOrder.status === OrderStatus.COMPLETED) {
      await this.transactionService.incrementPendingBalance(updatedOrder);
    }

    return updatedOrder;
  }

  @Get('/buyer')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<OrderEntity>,
  })
  async findAllBuyerOrders(
    @Query() query: QueryDto<OrderEntity>,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<PageDto<OrderDto>> {
    currentUser = {
      ...currentUser,
      role: 'buyer',
    };

    const results = await super.findAll(query, currentUser);
    //   const resultWithBuyer = this._service.mappingOrderWithBuyer(results);

    return results;
  }

  @Get('/freelancer')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<OrderEntity>,
  })
  async findAllFreelancerOrders(
    @Query() query: QueryDto<OrderEntity>,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<PageDto<OrderDto>> {
    currentUser = {
      ...currentUser,
      role: 'freelancer',
    };
    const results = await super.findAll(query, currentUser);

    return results;
  }

  @Post('/questions-answers')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderQuestionsEntity,
  })
  async addQuestionsAnswersToOrder(
    @Body() data: OrderQuestionsEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsEntity> {
    return this._service.addQuestionsAnswersToOrder(data, currentUser);
  }

  @Post('/delivery')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderDeliverablesEntity,
  })
  async addDeliveryWork(
    @Body() data: OrderDeliverablesEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    return this._service.addDeliveryWork(data, currentUser);
  }

  @Post('/re-delivery')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: OrderDeliverablesEntity,
  })
  async addReDeliveryWork(
    @Body() data: OrderDeliverablesEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    return this._service.addReDeliveryWork(data, currentUser);
  }

  @Patch('/questions-answers/:id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: Object, required: false })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  async updateQuestionsAnswersToOrder(
    @Param('id') id: string | number,
    @Body() data: OrderQuestionsEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<any> {
    if (!Object.keys(data as Record<string, any>).length) {
      throw new BadRequestException('Update data cannot be empty');
    }

    return this._service.updateQuestionsAnswersToOrder(data, currentUser);
  }
}
