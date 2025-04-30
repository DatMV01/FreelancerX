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
import { AuthGuard } from '@nestjs/passport';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestWithdrawalDto } from './dto/create-widthdrawal.dto';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { PageDto, PageMetaDto } from '../base/dto/pagination';
import { QueryDto } from '../base/dto/query.dto';
import { WalletTransactionEntity } from './entities/wallet_transactions.entity';
import { RoleEnum } from '../role/enum/role.enum';
import { RolesGuard } from '../role/role.guard';
import { WalletService } from './wallet.service';
import { AdjustBalanceDto, FilterTransactionDto } from './dto/wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(protected readonly service: WalletService) {}

  // --- 1. Thêm thu nhập Pending ---
  @Post('earning/pending')
  @UseGuards(AuthGuard('jwt'))
  async addPendingEarning(@Body('order') order: any) {
    return this.service.addPendingEarning(order);
  }

  // --- 2. Duyệt thu nhập Pending ---
  @Patch('earning/approve')
  @UseGuards(AuthGuard('jwt'))
  async approvePendingEarning(
    @Body() dto: { transactionId: string; orderId: string },
  ) {
    return this.service.approvePendingEarning(dto);
  }

  // --- 3. Freelancer yêu cầu rút tiền ---
  @Post('withdraw/request')
  @UseGuards(AuthGuard('jwt'))
  async requestWithdraw(
    @CurrentUser() currentUser: JwtAccessPayloadType,
    @Body() dto: RequestWithdrawalDto,
  ) {
    const userId = currentUser.id;
    return this.service.requestWithdraw(userId, dto);
  }

  // --- 4. Admin duyệt rút tiền ---
  @Patch('withdraw/approve/:transactionId')
  @UseGuards(AuthGuard('jwt'))
  async approveWithdraw(@Param('transactionId') transactionId: string) {
    return this.service.approveWithdraw(transactionId);
  }

  // --- 5. Admin từ chối rút tiền ---
  @Patch('withdraw/reject/:transactionId')
  @UseGuards(AuthGuard('jwt'))
  async rejectWithdraw(
    @Param('transactionId') transactionId: string,
    @Body('reason') reason: string,
  ) {
    return this.service.rejectWithdraw(transactionId, reason);
  }

  // --- 6. Hoàn tiền cho Buyer ---
  @Post('refund')
  @UseGuards(AuthGuard('jwt'))
  async refundToBuyer(@Body('order') order: any) {
    return this.service.refundToBuyer(order);
  }

  // --- 7. Admin nạp tiền cho user ---
  @Post('deposit')
  @UseGuards(AuthGuard('jwt'))
  async deposit(
    @CurrentUser() currentUser: JwtAccessPayloadType,
    @Body('amount') amount: string,
    @Body('description') description: string,
  ) {
    const userId = currentUser.id;

    return this.service.deposit(userId, Number(amount), description);
  }

  // --- 8. Admin chỉnh sửa số dư ---
  @Patch('adjust')
  async adjustBalance(@Body() dto: AdjustBalanceDto) {
    return this.service.adjustBalance(
      dto.userId,
      Number(dto.amount),
      dto.actorType,
      dto.description,
    );
  }

  // --- 9. Lấy thông tin ví user ---
  @Get('/infomation')
  @UseGuards(AuthGuard('jwt'))
  async getWalletInfo(@CurrentUser() currentUser: JwtAccessPayloadType) {
    const userId = currentUser.id;
    return this.service.getWalletInfo(userId);
  }

  // --- 10. Lấy lịch sử giao dịch ví ---
  @Get('/transactions')
  @UseGuards(AuthGuard('jwt'))
  async getWalletTransactions(
    @CurrentUser() currentUser: JwtAccessPayloadType,
    @Query() filter: FilterTransactionDto,
  ) {
    const userId = currentUser.id;

    return this.service.getWalletTransactions(userId, filter as any);
  }

  // @Get('/freelancer')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiOperation({ summary: 'Get all entities' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'List of entities',
  //   type: PageDto<WalletTransactionEntity>,
  // })
  // async findAll(
  //   @Query() query: QueryDto<any>,
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ) {
  //   const { page, limit, filters, sorts, fields } = query;

  //   const [results, count] = await this.service.findAll(
  //     page,
  //     limit,
  //     filters,
  //     sorts,
  //     fields as any,
  //     currentUser,
  //   );

  //   return new PageDto<any>(
  //     results,
  //     new PageMetaDto({
  //       itemCount: count,
  //       pageOptionsDto: { limit, page, filters, sorts },
  //     }),
  //   );
  // }

  // @Post('/withdrawal-request')
  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({ groups: [CREATE_GROUP] })
  // @ApiOperation({ summary: 'Create a new entity' })
  // @ApiBody({ type: Object, required: false })
  // async createWithdrawal(
  //   @Body() data: CreateWithdrawalDto,
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ): Promise<any> {
  //   return await this.service.createWithdrawal({
  //     freelancerId: currentUser.freelancerId,
  //     data,
  //   });
  // }

  // @Patch(':id/approve')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles(RoleEnum.ADMIN)
  // async approveWithdraw(@Param('id') id: string) {
  //   return this.service.approveWithdraw(id);
  // }

  // @Patch(':id/reject')
  // //@UseGuards(AuthGuard('jwt'))
  // @Roles(RoleEnum.ADMIN, RoleEnum.FREELANCER)
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // async rejectWithdraw(
  //   @Param('id') id: string,
  //   @Body() rejectionReason: string,
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ) {
  //   return this.service.rejectWithdraw(id, rejectionReason);
  // }

  // @Get('/wallet')
  // @UseGuards(AuthGuard('jwt'))
  // async getWalletInfo(
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ): Promise<any> {
  //   return await this.service.getWalletInfo({
  //     freelancerId: currentUser.freelancerId,
  //   });
  // }

  // @Get('/earnings/:year')
  // @UseGuards(AuthGuard('jwt'))
  // async getEarningsDataByYear(
  //   @Param('year') year: string,
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ): Promise<any> {
  //   const result = await this.service.getEarningsDataByYear(
  //     currentUser.freelancerId,
  //     Number(year),
  //   );

  //   return result;
  // }
}
