import {
  Body,
  Controller,
  Get,
  Param,
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
  async create(@Body() data: CreateGigReviewDto): Promise<GigReviewDto> {
    const { gigId, reviewerId: userId, rating, comment } = data;
    const review = await this._service.createReview(gigId, userId, data);

    return review as any;
    //return super.mapFromEntityToDto(review);
  }

  @Get('/gig/:gigId')
  async getGigReviews(
    @Param('gigId') gigId: string,
    @Query('sort') sort: 'newest' | 'highest' | 'lowest' = 'newest',
  ) {
  //  return this.gigReviewService.getReviewsByGig(gigId, sort);
  }

  @Post('/:id/reply')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async editReply(
    @Param('ratingId') ratingId: string,
    @Body('ownerId') ownerId: string,
    @Body('reply') reply: string,
  ) {
    return this._service.replyToRating(ratingId, ownerId, reply);
  }

  @Post(':ratingId/reply')
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async replyToRating(
    @Param('ratingId') ratingId: string,
    @Body('ownerId') ownerId: string,
    @Body('reply') reply: string,
  ) {
    return this._service.replyToRating(ratingId, ownerId, reply);
  }

  @Get('average')
  async getGigAverageRating(@Param('gigId') gigId: string) {
    return this._service.getGigAverageRating(gigId);
  }
}
