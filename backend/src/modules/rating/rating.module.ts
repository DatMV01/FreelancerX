import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoMapper } from 'src/modules/base/mapper/mapper';
import { ReviewEntity } from './entities/rating.entity';
import { GigEntity } from '../gig/entities/gig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, GigEntity])],
  controllers: [RatingController],
  providers: [RatingService, AutoMapper],
})
export class RatingModule {}
