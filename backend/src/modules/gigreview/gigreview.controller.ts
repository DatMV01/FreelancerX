import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { GigReviewDto as GigReviewDto } from './dto/gigreview.dto';
import { GigReviewService } from './gigreview.service';

import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { CreateGigReviewDto } from './dto/create-gigreview.dto';
import { UpdateGigReviewDto as UpdateGigReviewDto } from './dto/update-gigreview.dto';
import { GigReviewEntity } from './entities/gigreview.entity';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

@Controller('reviews')
export class GigReviewController extends BaseController<
  GigReviewEntity,
  GigReviewDto,
  CreateGigReviewDto,
  UpdateGigReviewDto
> {
  constructor(protected readonly _service: GigReviewService) {
    super(
      _service,
      GigReviewEntity,
      GigReviewDto,
      CreateGigReviewDto,
      UpdateGigReviewDto,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateGigReviewDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: GigReviewDto,
  })
  async createReview(
    @Body() data: CreateGigReviewDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<GigReviewDto> {
    const review = await this._service.createReview(currentUser, data);

    return review as any;
  }

  @Get('/gig/:gigId')
  async getGigReviews(
    @Param('gigId') gigId: string,
    @Query('sort') sort: 'newest' | 'highest' | 'lowest' = 'newest',
  ) {
    return this._service.getReviewsByGig(gigId, sort);
  }

  @Get('/order/:orderId')
  async getOrderReview(@Param('orderId') orderId: string) {
    return this._service.getReviewByOrder(orderId);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async replyToReview(
    id: string,
    @Body('freelancerId') freelancerId: string,
    @Body('reply') reply: string,
    //  @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    return this._service.replyToReview(id, freelancerId, reply);
  }

  @Post(':ratingId/reply')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async replyToRating(
    @Param('ratingId') ratingId: string,
    @Body('ownerId') ownerId: string,
    @Body('reply') reply: string,
  ) {
    return this._service.replyToReview(ratingId, ownerId, reply);
  }

  @Get('average')
  async getGigAverageRating(@Param('gigId') gigId: string) {
    return this._service.getGigAverageRating(gigId);
  }
}
