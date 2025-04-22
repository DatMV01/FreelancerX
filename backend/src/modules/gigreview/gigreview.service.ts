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
import { OrderStatus } from '../order/order.enum';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

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

  async createReview(
    currentUser: JwtAccessPayloadType,

    dto: CreateGigReviewDto,
  ) {
    const { orderId, gigId } = dto;

    const checkReview = await this._repository.findOne({
      where: { orderId },
    });

    if (checkReview) {
      throw new BadRequestException('This order has already been reviewed');
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.buyerId !== currentUser.id) {
      throw new ForbiddenException('You are not the buyer of this order');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Order must be completed to leave a review',
      );
    }

    const review = this._repository.create({
      rating: dto.rating,
      comment: dto.comment,
      gigId: order.gigId,
      reviewerId: currentUser.id,
      order,
    });

    await this._repository.save(review);

    return review;
  }

  async replyToReview(id: string, freelancerId: string, reply: string) {
    const review = await this._repository.findOne({
      where: { id },
      relations: ['gig'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.gig.freelancerId !== freelancerId) {
      throw new ForbiddenException('You are not the owner of this gig');
    }

    if (review.reply) {
      throw new BadRequestException('You already replied to this review');
    }

    review.reply = reply;
    review.freelancerId = freelancerId;
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
      avgRating: gig.ratingAverage,
      totalReviews: gig.ratingCount,
    };
  }
  async getReviewByOrder(orderId: string): Promise<any> {
    return await this._repository.findOne({ where: { orderId } });
  }

  async getReviewsByGig(gigId: string, sort: string) {
    throw new Error('Method not implemented.');
  }
}
