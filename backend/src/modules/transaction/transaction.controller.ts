import {
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
import { TransactionService } from './transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateWithdrawalDto } from './dto/create-widthdrawal.dto';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { PageDto, PageMetaDto } from '../base/dto/pagination';
import { QueryDto } from '../base/dto/query.dto';
import { FreelancerTransactionEntity } from './entities/freelancer_transactions.entity';
import { RoleEnum } from '../role/enum/role.enum';
import { RolesGuard } from '../role/role.guard';

@Controller('transaction')
export class TransactionController {
  constructor(protected readonly service: TransactionService) {}

  @Get('/freelancer')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<FreelancerTransactionEntity>,
  })
  async findAll(
    @Query() query: QueryDto<any>,
    @CurrentUser() currentUser: any,
  ) {
    const { page, limit, filters, sorts, fields } = query;

    const [results, count] = await this.service.findAll(
      page,
      limit,
      filters,
      sorts,
      fields as any,
      currentUser,
    );

    return new PageDto<any>(
      results,
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: { limit, page, filters, sorts },
      }),
    );
  }

  @Post('/withdrawal-request')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: Object, required: false })
  async createWithdrawal(
    @Body() data: CreateWithdrawalDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<any> {
    return await this.service.createWithdrawal({
      freelancerId: currentUser.freelancerId,
      data,
    });
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleEnum.ADMIN)
  async approveWithdraw(@Param('id') id: string) {
    return this.service.approveWithdraw(id);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @Roles(RoleEnum.ADMIN)
  async cancelWithdraw(@Param('id') id: string) {
    return this.service.cancelWithdraw(id);
  }

  @Patch(':id/reject')
  //@UseGuards(AuthGuard('jwt'))
  @Roles(RoleEnum.ADMIN,RoleEnum.FREELANCER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async rejectWithdraw(
    @Param('id') id: string,
    @Body() rejectionReason: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    return this.service.rejectWithdraw(id, rejectionReason);
  }

  @Get('/wallet')
  @UseGuards(AuthGuard('jwt'))
  async getWalletInfo(
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<any> {
    return await this.service.getWalletInfo({
      freelancerId: currentUser.freelancerId,
    });
  }

  @Get('/earnings/:year')
  @UseGuards(AuthGuard('jwt'))
  async getEarningsDataByYear(
    @Param('year') year: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<any> {
    const result = await this.service.getEarningsDataByYear(
      currentUser.freelancerId,
      Number(year),
    );

    return result;
  }

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
