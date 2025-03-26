import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewDto } from './dto/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController extends BaseController<
  ReviewEntity,
  ReviewDto,
  CreateReviewDto,
  UpdateReviewDto
> {
  constructor(protected readonly _service: ReviewService) {
    super(_service, ReviewEntity, ReviewDto, CreateReviewDto, UpdateReviewDto);
  }
}
