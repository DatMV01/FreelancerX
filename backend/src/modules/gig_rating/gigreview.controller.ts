import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { GigRatingDto as GigRatingDto } from './dto/gigreview.dto';
import { GigReviewService } from './gigreview.service';

import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { CreateGigRatingDto } from './dto/create-gigreview.dto';
import { UpdateGigRatingDto as UpdateGigRatingDto } from './dto/update-gigreview.dto';
import { GigRatingEntity } from './entities/gigreview.entity';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

@Controller('reviews')
export class GigReviewController extends BaseController<
  GigRatingEntity,
  GigRatingDto,
  CreateGigRatingDto,
  UpdateGigRatingDto
> {
  constructor(protected readonly _service: GigReviewService) {
    super(
      _service,
      GigRatingEntity,
      GigRatingDto,
      CreateGigRatingDto,
      UpdateGigRatingDto,
    );
  }

  @Get('/freelancer')
  @UseGuards(AuthGuard('jwt'))
  async getAllReviewsOfFreelancer(
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    console.log(currentUser)
    return this._service.findAllByFreelancerId(currentUser.freelancerId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateGigRatingDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: GigRatingDto,
  })
  async createReview(
    @Body() data: CreateGigRatingDto,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ): Promise<GigRatingDto> {
    const review = await this._service.createReview(currentUser, data);

    return review as any;
  }

  @Get('/gig/:gigId/rating-count')
  async getGigRatingCount(@Param('gigId') gigId: string) {
    return this._service.getGigRatingCount(gigId);
  }

  @Get('/gig/:gigId')
  async getGigReviews(
    @Param('gigId') gigId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const reviews = await this._service.getGigReviews({
      gigId,
      page,
      limit,
    });
    return reviews;
  }

  @Get('/order/:orderId')
  async getOrderReview(@Param('orderId') orderId: string) {
    return this._service.getReviewByOrder(orderId);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async replyToReview(
    @Param('id') id: string,
    @Body('reply') reply: string,
    @CurrentUser() currentUser: JwtAccessPayloadType,
  ) {
    if (!id) {
      throw new NotFoundException('Id is required');
    }

    return this._service.replyToReview(currentUser, id, reply);
  }

  // @Post(':ratingId/reply')
  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({ groups: [CREATE_GROUP] })
  // async replyToRating(
  //   @Param('ratingId') ratingId: string,
  //   @Body('ownerId') ownerId: string,
  //   @Body('reply') reply: string,
  //   @CurrentUser() currentUser: JwtAccessPayloadType,
  // ) {
  //   return this._service.replyToReview2(ratingId, ownerId, reply);
  // }

  @Get('average')
  async getGigAverageRating(@Param('gigId') gigId: string) {
    return this._service.getGigAverageRating(gigId);
  }
}
