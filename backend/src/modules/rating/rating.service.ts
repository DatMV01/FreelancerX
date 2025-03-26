import { BadRequestException, Get, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { RatingEntity } from './entities/rating.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { RatingReplyEntity } from './entities/rating-reply.entity';
import { QueryDto } from '../base/dto/query.dto';

@Injectable()
export class RatingService extends BaseService<RatingEntity> {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly _repository: Repository<RatingEntity>,

    @InjectRepository(GigEntity)
    private readonly gigRepo: Repository<GigEntity>,

    @InjectRepository(RatingReplyEntity)
    private readonly ratingReplyRepo: Repository<RatingReplyEntity>,
  ) {
    super(_repository);
  }

  async addRating(
    gigId: string,
    userId: string,
    rating: number,
    review?: string,
  ) {
    const gig = await this.gigRepo.findOne({ where: { id: gigId } });
    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    const newRating = this._repository.create({
      gig,
      user: { id: userId },
      rateNumber: rating,
      message: review,
    });
    await this._repository.save(newRating);

    const { avg, count } = await this._repository
      .createQueryBuilder('gr')
      .select('AVG(gr.rating)', 'avg')
      .addSelect('COUNT(gr.id)', 'count')
      .where('gr.gig = :gigId', { gigId })
      .getRawOne();

    gig.avgRating = parseFloat(avg) || 0;
    gig.reviewCount = parseInt(count) || 0;
    await this.gigRepo.save(gig);

    return newRating;
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
      avgRating: gig.avgRating,
      totalReviews: gig.reviewCount,
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

    if (rating.gig.freelancer.id !== ownerId)
      throw new BadRequestException('Only the gig owner can reply');

    const ownerReply = this.ratingReplyRepo.create({
      rating,
      freelancerId: ownerId,
      message,
    });

    return this.ratingReplyRepo.save(ownerReply);
  }
}
