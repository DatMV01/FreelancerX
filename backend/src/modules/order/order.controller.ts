import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { CurrentUser } from 'src/common/decorators';
import { QueryInput } from 'src/utils/typeorm-utils';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseController } from '../base/base.controller';
import { PageDto } from '../base/dto/pagination';
import { QueryDto } from '../base/dto/query.dto';
import { RoleEnum } from '../role/enum/role.enum';
import { WalletService } from '../wallet/wallet.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderDeliverablesEntity } from './entities/order_deliverables.entity';
import { OrderQuestionsEntity } from './entities/order_questions.entity';
import { OrderStatus } from './enum/order.enum';
import { OrderService } from './order.service';

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
    private readonly walletService: WalletService,
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
      await this._service.addPendingEarningToFreelancer(updatedOrder.id);
    } else if (updatedOrder.status === OrderStatus.CANCEL) {
      await this._service.refundToBuyer(updatedOrder.id);
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
  async findAllOrdersByBuyer(
    @Req() req: Request,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<PageDto<OrderDto>> {
    currentUser.actorType = RoleEnum[RoleEnum.BUYER];

    const results = await super.findAll2(req, currentUser);

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
  async findAllOrdersByFreelancer(
    @Req() req: Request,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<PageDto<OrderDto>> {
    currentUser.actorType = RoleEnum[RoleEnum.FREELANCER];

    const results = await super.findAll2(req, currentUser);

    return results;
  }

  @Get('/admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<OrderEntity>,
  })
  async findAllOrdersByAdmin(
    @Req() req: Request,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<PageDto<OrderDto>> {
    currentUser.actorType = RoleEnum[RoleEnum.ADMIN];

    const results = await super.findAll2(req, currentUser);

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
