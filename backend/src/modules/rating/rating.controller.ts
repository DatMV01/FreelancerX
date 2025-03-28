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
import { RatingService } from './rating.service';
import { RatingDto } from './dto/rating.dto';

import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingEntity } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { CREATE_GROUP } from 'src/common/constant/serialize.group';
import { PageDto } from '../base/dto/pagination';
import { QueryDto } from '../base/dto/query.dto';

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
  @SerializeOptions({ groups: [CREATE_GROUP] })
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
