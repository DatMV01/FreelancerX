import { BadRequestException, Get, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { ReviewEntity } from './entities/rating.entity';
import { GigEntity } from '../gig/entities/gig.entity';

@Injectable()
export class RatingService extends BaseService<ReviewEntity> {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly _repository: Repository<ReviewEntity>,

    @InjectRepository(GigEntity)
    private readonly gigRepo: Repository<GigEntity>,
  ) {
    super(_repository);
  }

  async addRating(
    gigId: string,
    userId: string,
    rateNumber: number,
    comment?: string,
  ) {
    const gig = await this.gigRepo.findOne({ where: { id: gigId } });
    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    const newRating = super.create({
      gig,
      userId,
      rateNumber,
      comment: !comment || comment === '' ? null : comment,
    });

    // const { avg, count } = await this._repository
    //   .createQueryBuilder('gr')
    //   .select('AVG(gr.rateNumber)', 'avg')
    //   .addSelect('COUNT(gr.id)', 'count')
    //   .where('gr.gig = :gigId', { gigId })
    //   .getRawOne();

    // gig.ratingAverate = parseFloat(avg) || 0;
    // gig.ratingCount = parseInt(count) || 0;

    // await this.gigRepo.save(gig);

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
    rating.replyAt = new Date();

    return super.update(ratingId, rating);
  }
}
