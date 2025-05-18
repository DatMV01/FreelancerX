import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiExtraModels
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseController } from '../base/base.controller';
import { PageDto } from '../base/dto/pagination';
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
  async getCheckoutOrder(@Param('id') id: string) {
    const entity = await this.baseService.findOneById(id);

    return entity;
  }

  @Patch('/action/:id')
  @UseGuards(AuthGuard('jwt'))
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
  async addQuestionsAnswersToOrder(
    @Body() data: OrderQuestionsEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsEntity> {
    return this._service.addQuestionToOrder(data, currentUser);
  }

  @Post('/delivery')
  @UseGuards(AuthGuard('jwt'))
  async addDeliveryWork(
    @Body() data: OrderDeliverablesEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    return this._service.addDeliveryWork(data, currentUser);
  }

  @Post('/re-delivery')
  @UseGuards(AuthGuard('jwt'))
  async addReDeliveryWork(
    @Body() data: OrderDeliverablesEntity,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    return this._service.addReDeliveryWork(data, currentUser);
  }

  @Patch('/questions-answers/:id')
  @UseGuards(AuthGuard('jwt'))
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
