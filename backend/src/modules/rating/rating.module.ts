import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoMapper } from 'src/common/mapper/mapper';
import { RatingEntity } from './entities/rating.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { RatingReplyEntity } from './entities/rating-owner-reply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatingEntity, GigEntity, RatingReplyEntity]),
  ],
  controllers: [RatingController],
  providers: [RatingService, AutoMapper],
})
export class RatingModule {}
