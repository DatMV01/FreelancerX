import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, Roles } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { PageDto, PageMetaDto } from '../base/dto/pagination';
import { RoleEnum } from '../role/enum/role.enum';
import { RolesGuard } from '../role/role.guard';
import { RequestWithdrawalDto } from './dto/create-widthdrawal.dto';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/common/guards';
import { buildObjectFromQuery } from 'src/utils/query-utils';

@Controller('wallets')
export class WalletController {
  constructor(protected readonly service: WalletService) {}

  // @Post('/earning/pending')
  // @UseGuards(AuthGuard('jwt'))
  // async addPendingEarning(@Body('order') order: any) {
  //   return this.service.addPendingEarningToFreelancer(order);
  // }

  // @Post('refund')
  // @UseGuards(AuthGuard('jwt'))
  // async refundToBuyer(@Body('order') order: any) {
  //   return this.service.refundToBuyer(order);
  // }

  // @Post('deposit')
  // @UseGuards(AuthGuard('jwt'))
  // async deposit(
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  //   @Body('amount') amount: string,
  //   @Body('description') description: string,
  // ) {
  //   const userId = currentUser.id;

  //   return this.service.deposit(userId, Number(amount), description);
  // }

  // @Patch('adjust')
  // async adjustBalance(@Body() dto: AdjustBalanceDto) {
  //   return this.service.adjustBalance(
  //     dto.userId,
  //     Number(dto.amount),
  //     dto.actorType,
  //     dto.description,
  //   );
  // }

  @Post('/withdraw/request')
  @UseGuards(AuthGuard('jwt'))
  async requestWithdraw(
    @CurrentUser() currentUser: JwtAccessPayloadType,
    @Body() dto: RequestWithdrawalDto,
  ) {
    const userId = currentUser.id;
    return this.service.requestWithdraw(userId, dto);
  }

  @Patch('/earning/approve/:transactionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async approvePendingEarning(
    @Param('transactionId') transactionId: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    return this.service.approvePendingEarning({ transactionId }, currentUser);
  }

  // --- 4. Admin duyệt rút tiền ---
  @Patch('/withdraw/approve/:transactionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async approveWithdraw(
    @Param('transactionId') transactionId: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    return this.service.approveWithdraw(transactionId, currentUser);
  }

  // --- 5. Admin từ chối rút tiền ---
  @Patch('/withdraw/reject/:transactionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async rejectWithdraw(
    @Param('transactionId') transactionId: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    return this.service.rejectWithdraw(transactionId, reason, currentUser);
  }

  @Get('/infomation')
  @UseGuards(AuthGuard('jwt'))
  async getWalletInfo(@CurrentUser() currentUser: JwtAccessPayloadType) {
    const userId = currentUser.id;
    return this.service.getWalletInfo(userId);
  }

  @Get('/transactions')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request, @CurrentUser() currentUser: any) {
    const rawQueryString = req.url.split('?')[1] ?? '';
    const queryString = rawQueryString.replace(`rawQuery=`, '');

    const queryObj = buildObjectFromQuery(queryString) as any;

    const [results, count] = await this.service.findAll(queryObj, currentUser);

    return new PageDto<any>(
      results,
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: queryObj,
      }),
    );
  }

  @Get('/transactions/:id')
  @UseGuards(AuthGuard('jwt'))
  async getTransactionById(
    @Param('id') id: string,

    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    const userId = currentUser.id;
    return this.service.getTransactionById(id);
  }

  @Get('/earnings/:year')
  @UseGuards(AuthGuard('jwt'))
  async getEarningsDataByYear(
    @Param('year') year: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<any> {
    const result = await this.service.getEarningsDataByYear(
      currentUser,
      Number(year),
    );

    return result;
  }
}
