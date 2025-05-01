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
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';
import { OrderStatus } from '../order/enum/order.enum';

@Injectable()
export class GigReviewService extends BaseService<GigReviewEntity> {
  constructor(
    @InjectRepository(GigReviewEntity)
    private readonly _repository: Repository<GigReviewEntity>,

    @InjectRepository(GigEntity)
    private readonly gigRepo: Repository<GigEntity>,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(FreelancerEntity)
    private readonly freelancerRepository: Repository<FreelancerEntity>,
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
      freelancerId: order.freelancerId,
      order,
    });

    await this._repository.save(review);

    return review;
  }

  async replyToReview(
    currentUser: JwtAccessPayloadType,
    reviewId: string,
    reply: string,
  ) {
    const review = await this._repository.findOne({
      where: { id: reviewId },
      relations: ['gig'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reply) {
      throw new BadRequestException('Review was replied');
    }

    const freelancer = await this.freelancerRepository.findOne({
      where: { userId: currentUser.id },
    });

    if (!freelancer) {
      throw new NotFoundException('Freelancer not found');
    }

    if (review.gig.freelancerId !== freelancer.id) {
      throw new ForbiddenException('You are not the owner of this gig');
    }

    review.reply = reply;
    review.replydAt = new Date();

    return await this._repository.save(review);
  }

  async replyToReview2(id: string, freelancerId: string, reply: string) {
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
    review.replydAt = new Date();

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

  async getGigReviews({
    gigId,
    page,
    limit,
  }: {
    gigId: string;
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await this._repository.findAndCount({
      skip,
      take: limit,
      where: { gigId },
    });

    return {
      reviews,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findAllByFreelancerId(freelancerId: string) {
    return this._repository.find({
      where: { freelancerId: freelancerId },
      relations: ['reviewer', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  async getGigRatingCount(gigId: string) {
    const result = await this._repository
      .createQueryBuilder('review')
      .select('review.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('review.gig_id = :gigId', { gigId })
      .groupBy('review.rating')
      .getRawMany();
    return result;
  }
}
