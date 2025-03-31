import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions
} from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { RatingDto } from './dto/rating.dto';
import { RatingService } from './rating.service';

import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingEntity } from './entities/rating.entity';

import {
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('rating')
export class RatingController extends BaseController<
  RatingEntity,
  RatingDto,
  CreateRatingDto,
  UpdateRatingDto
> {
  constructor(protected readonly _service: RatingService) {
    super(_service, RatingEntity, RatingDto, CreateRatingDto, UpdateRatingDto);
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateRatingDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: RatingDto,
  })
  async create(@Body() data: CreateRatingDto): Promise<RatingDto> {
    const { gigId, userId, rateNumber, comment } = data;
    const rating = await this._service.addRating(
      gigId,
      userId,
      rateNumber,
      comment,
    );

    return super.mapFromEntityToDto(rating);
  }

  @Post(':ratingId/reply')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async replyToRating(
    @Param('ratingId') ratingId: string,
    @Body('ownerId') ownerId: string,
    @Body('reply') reply: string,
  ) {
    return this._service.replyToRating(ratingId, ownerId, reply);
  }

  @Get('average')
  // @UseGuards(AuthGuard('jwt'))
  async getGigAverageRating(@Param('gigId') gigId: string) {
    return this._service.getGigAverageRating(gigId);
  }
}
