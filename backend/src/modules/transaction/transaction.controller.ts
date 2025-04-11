import { Controller, Get, Param } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

import { Patch, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';

@Controller('transaction')
export class TransactionController extends BaseController<
  TransactionEntity,
  TransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto
> {
  constructor(protected readonly _service: TransactionService) {
    super(
      _service,
      TransactionEntity,
      TransactionDto,
      CreateTransactionDto,
      UpdateTransactionDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateTransactionDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: TransactionDto,
  })
  async create(data: CreateTransactionDto): Promise<TransactionDto> {
    return super.create(data);
  }

  @Get('/stripe/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity found' })
  async findStripeById(@Param('id') id: string) {
    const entity = await this._service.findStripeById(id);

    return entity;
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateTransactionDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: TransactionDto,
  })
  async update(
    id: string,
    data: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return super.update(id, data);
  }
}
