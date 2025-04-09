import {
  BadRequestException,
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { GigReviewEntity } from './entities/gigreview.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { CreateGigReviewDto } from './dto/create-gigreview.dto';

@Injectable()
export class GigReviewService extends BaseService<GigReviewEntity> {
  constructor(
    @InjectRepository(GigReviewEntity)
    private readonly _repository: Repository<GigReviewEntity>,

    @InjectRepository(GigEntity)
    private readonly gigRepo: Repository<GigEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {
    super(_repository);
  }

  async createReview(userId: string, orderId: string, dto: CreateGigReviewDto) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['buyer', 'gig', 'review'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyer.id !== userId) {
      throw new ForbiddenException('You are not the buyer of this order');
    }

    if (order.status !== 'completed') {
      throw new BadRequestException(
        'Order must be completed to leave a review',
      );
    }

    if (order.review) {
      throw new BadRequestException('This order has already been reviewed');
    }

    const review = this._repository.create({
      rating: dto.rating,
      comment: dto.comment,
      gig: order.gig,
      reviewer: order.buyer,
      order,
    });

    await this._repository.save(review);

    return review;
  }
 
  async replyToReview(userId: string, reviewId: string, dto: { reply: string }) {
    const review = await this._repository.findOne({
      where: { id: reviewId },
      relations: ['gig', 'gig.freelancer'],
    });
  
    if (!review) {
      throw new NotFoundException('Review not found');
    }
  
    if (review.gig.freelancer.id !== userId) {
      throw new ForbiddenException('You are not the owner of this gig');
    }
  
    if (review.reply) {
      throw new BadRequestException('You already replied to this review');
    }
  
    review.reply = dto.reply;
    review.repliedAt = new Date();
  
    return await this._repository.save(review);
  }


  async getGigRatings(gigId: string) {
    return this._repository.find({
      where: { gig: { id: gigId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getGigAverageRating(gigId: string) {
    const gig = await this.gigRepo.findOne({ where: { id: gigId } });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    return {
      avgRating: gig.ratingAverate,
      totalReviews: gig.ratingCount,
    };
  }

  async replyToRating(ratingId: string, ownerId: string, message: string) {
    const rating = await this._repository.findOne({
      where: { id: ratingId },
      //   relations: ['gig', 'user'],
    });

    if (!rating) {
      throw new BadRequestException('Rating not found');
    }

    if (rating.freelancerId !== ownerId)
      throw new BadRequestException('Only the gig owner can reply');

    rating.reply = message;
    rating.repliedAt = new Date();

    return super.update(ratingId, rating);
  }
}
