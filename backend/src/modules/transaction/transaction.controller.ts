import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';


@Controller('transaction')
export class TransactionController {
  constructor(protected readonly service: TransactionService) {}

  // @Post()
  // // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({ groups: [CREATE_GROUP] })
  // @ApiOperation({ summary: 'Create a new entity' })
  // @ApiBody({ type: CreateTransactionDto, required: false })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Entity created successfully',
  //   type: TransactionDto,
  // })
  // async create(data: CreateTransactionDto): Promise<TransactionDto> {
  //   return super.create(data);
  // }

  // @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({ groups: [UPDATE_GROUP] })
  // @ApiOperation({ summary: 'Update an entity' })
  // @ApiParam({ name: 'id', type: String, required: false })
  // @ApiBody({ type: UpdateTransactionDto, required: false })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Entity updated successfully',
  //   type: TransactionDto,
  // })
  // async update(
  //   id: string,
  //   data: UpdateTransactionDto,
  // ): Promise<TransactionDto> {
  //   return super.update(id, data);
  // }
}
