import { Module } from '@nestjs/common';
import { GigReviewService } from './gigreview.service';
import { GigReviewController } from './gigreview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoMapper } from 'src/modules/base/mapper/mapper';
import { GigReviewEntity } from './entities/gigreview.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { OrderEntity } from '../order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GigReviewEntity, GigEntity, OrderEntity]),
  ],
  controllers: [GigReviewController],
  providers: [GigReviewService, AutoMapper],
})
export class GigReviewModule {}
