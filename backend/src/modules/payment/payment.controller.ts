import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentDto } from './dto/payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentService } from './payment.service';

import { Patch, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
@Controller('payment')
export class PaymentController extends BaseController<
  PaymentEntity,
  PaymentDto,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(protected readonly _service: PaymentService) {
    super(
      _service,
      PaymentEntity,
      PaymentDto,
      CreatePaymentDto,
      UpdatePaymentDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreatePaymentDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: PaymentDto,
  })
  async create(data: CreatePaymentDto): Promise<PaymentDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdatePaymentDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: PaymentDto,
  })
  async update(id: string, data: UpdatePaymentDto): Promise<PaymentDto> {
    return super.update(id, data);
  }
}
